import { UseAuth } from "../../hooks/AuthProvider";
import apiFetch from "./apiFetch";
import ToastCustom from "../../components/ToastCustom";

const apiService = () => {
    const { bearerToken, refresh } = UseAuth();
    const apiUrl = import.meta.env.VITE_API_URL;

    const getOAuthUrl = async (website) => {
        const loadingToast = ToastCustom(`Connection to ${website}...`, "loading")
        try {
            const response = await apiFetch(`${apiUrl}/connect/url?website=${website}`, {
                method: "GET",
            }, bearerToken, refresh);

            if (response.ok) {
                const data = await response.json();
                window.location.href = data;
                return
            }
            throw new Error()
        } catch (error) {
            console.error("Error :", error);
            ToastCustom("Failed to connect...", "error", loadingToast)
        }
    };

    const sendAccessToken = async (code, website) => {
        const loadingToast = ToastCustom(`Connection to ${website}...`, "loading")
        try {
            const formData = new URLSearchParams();
            formData.append("code", code);
            formData.append("website", website)

            const response = await apiFetch(`${apiUrl}/connect/token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formData,
            }, bearerToken, refresh);

            if (response.ok) {
                ToastCustom("Successfully connected !", "success", loadingToast)
                return await response.json();
            }
            
            throw new Error()
        } catch (error) {
            console.error("Error :", error);
            ToastCustom("Connection failed...", "error", loadingToast)
        }
    }

    const getUserData = async (connections = true, portfolios = true) => {
        const selectedTypes = [];

        if (connections) selectedTypes.push("connections");
        if (portfolios) selectedTypes.push("portfolios");

        const args = selectedTypes.length > 0 ? `?types=${selectedTypes.join(",")}` : "";

        try {
            const response = await apiFetch(`${apiUrl}/user/data${args}`, {
                method: "GET"
            }, bearerToken, refresh);

            if (response.ok) {
                return await response.json();
            }

            throw new Error();
        } catch (error) {
            console.error("Error:", error);
            ToastCustom("Failed to get data...", "error");
        }
    };

    const getAllPublicProjects = async (connection) => {

        const args = `?account_id=${connection.id}&website=${connection.website}`

        try {
            const response = await apiFetch(`${apiUrl}/connect/projects${args}`, {
                method: "GET"
            }, bearerToken, refresh)

            if (response.ok) {
                return await response.json()
            }
        } catch (error) {
            console.error("Error:", error);
            ToastCustom("Failed to get data...", "error");
        }
    }


    const deleteConnection = async (id, setUserData) => {
        const loadingToast = ToastCustom(`Deleting connection...`, "loading")
        try {
            const response = await apiFetch(`${apiUrl}/connect/delete/${id}`, {
                method: "DELETE"
            }, bearerToken, refresh)

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${await response.text()}`);
            }

            setUserData(prevData => ({
                ...prevData,
                connections: prevData.connections.filter(conn => conn.id !== id)
            }));

            ToastCustom("Connection deleted !", "success", loadingToast)
        } catch (error) {
            console.error("Error :", error)
            ToastCustom("Failed to delete connection...", "error", loadingToast)
        }

    }

    const createPortfolio = async (setUserData) => {
        const loadingToast = ToastCustom("Creating a portfolio...", "loading")

        try {
            const response = await apiFetch(`${apiUrl}/portfolio/create`, {
                method: "GET"
            }, bearerToken, refresh);
    
            if (!response.ok) {
                ToastCustom("An error occured...", "error", loadingToast)
                throw new Error(`Erreur ${response.status}: ${await response.text()}`);
            }
    
            const data = await response.json();

            ToastCustom("Portfolio created !", "success", loadingToast)
    
            setUserData(prevData => ({
                ...prevData,
                portfolios: prevData.portfolios ? [...prevData.portfolios, data] : [data]
            }));
    
        } catch (error) {
            ToastCustom("Failed to create a portfolio", "error", loadingToast)
            console.error("Error :", error);
        }
    };

    const getPortfolioData = async (portfolioUuid) => {
        const response = await apiFetch(`${apiUrl}/portfolio/${portfolioUuid}`, {
            method: "GET"
        });

        const data = await response.json()

        if (!response.ok) {
            console.error("Failed to get porfolio data :", data.detail);
            throw new Error(data.detail);
        }

        return data
    }

    const updatePortfolio = async(portfolioUuid, portfolioData) => {
        try {
            const loadingToast = ToastCustom("Saving portfolio...", "loading")

            const response = await apiFetch(`${apiUrl}/portfolio/${portfolioUuid}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(portfolioData),
            }, bearerToken, refresh)

            if (!response.ok) {
                ToastCustom("An error occured...", "error", loadingToast)
                throw new Error(`Erreur ${response.status}: ${await response.text()}`);
            }

            ToastCustom("Portfolio saved !", "success", loadingToast)
        }  catch (error) {
            console.error("Erreur :", error)
        }
    }

    const deletePortfolio = async (portfolio, setUserData) => {
        try {
            const loadingToast = ToastCustom("Deleting portfolio...", "loading")

            const response = await apiFetch(`${apiUrl}/portfolio/${portfolio.uuid}`, {
                method: "DELETE"
            }, bearerToken, refresh )

            if (!response.ok) {
                ToastCustom("An error occured...", "error", loadingToast)
                throw new Error(`Erreur ${response.status}: ${await response.text()}`);
            }

            setUserData(prevData => ({
                ...prevData,
                portfolios: prevData.portfolios.filter(item => item.uuid !== portfolio.uuid)
            }));
            ToastCustom("Portfolio deleted !", "success", loadingToast)

        } catch (error) {
            console.error("Erreur :", error)
        }
    }
    

    return {
        getOAuthUrl,
        sendAccessToken,
        getUserData,
        getAllPublicProjects,
        deleteConnection,
        createPortfolio,
        getPortfolioData,
        updatePortfolio,
        deletePortfolio
    };
};

export default apiService;

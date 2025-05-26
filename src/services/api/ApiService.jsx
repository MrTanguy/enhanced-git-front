import { UseAuth } from "../../hooks/AuthProvider";
import apiFetch from "./apiFetch";
import ToastCustom from "../../components/ToastCustom";

const apiService = () => {
    const { bearerToken, refresh } = UseAuth();
    const apiUrl = import.meta.env.VITE_API_URL;

    const getOAuthUrl = async (website) => {
        try {
            const response = await apiFetch(`${apiUrl}/connect/url?website=${website}`, {
                method: "GET",
            }, bearerToken, refresh);

            if (response.ok) {
                const data = await response.json();
                window.location.href = data;
            }
            throw new Error()
        } catch (error) {
            console.error("Error :", error);
            ToastCustom("Failed to connect...", "error", loadingTeast)
        }
    };

    const sendAccessToken = async (code, website) => {
        try {
            const loadingTeast = ToastCustom(`Connection to ${website}...`, "loading")
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
                ToastCustom("Successfully connected !", "success", loadingTeast)
                const data = await response.json();
                return data
            }
            
            throw new Error()
        } catch (error) {
            console.error("Error :", error);
            ToastCustom("Connection failed...", "error", loadingTeast)
        }
    }

    const getUserData = async () => {

        try {
            const response = await apiFetch(`${apiUrl}/user/data`, {
                method: "GET"
            }, bearerToken, refresh)

            if (response.ok) {
                return await response.json()
            }

            throw new Error()
        } catch (error) {
            console.error("Error :", error)
            ToastCustom("Failed to get data...", "error")
        }
    }

    const deleteConnection = async (id, setUserData) => {
        const loadingTeast = ToastCustom(`Deleting connection...`, "loading")
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

            ToastCustom("Connection deleted !", "success", loadingTeast)
        } catch (error) {
            console.error("Error :", error)
            ToastCustom("Failed to delete connection...", "error", loadingTeast)
        }

    }

    const createPortfolio = async (setUserData) => {
        try {
            const loadingTeast = ToastCustom("Creating a portfolio...", "loading")

            const response = await apiFetch(`${apiUrl}/portfolio/create`, {
                method: "GET"
            }, bearerToken, refresh);
    
            if (!response.ok) {
                ToastCustom("An error occured...", "error", loadingTeast)
                throw new Error(`Erreur ${response.status}: ${await response.text()}`);
            }
    
            const data = await response.json();

            ToastCustom("Portfolio created !", "success", loadingTeast)
    
            setUserData(prevData => ({
                ...prevData,
                portfolios: prevData.portfolios ? [...prevData.portfolios, data] : [data] // Évite erreur si `portfolios` est undefined
            }));
    
        } catch (error) {
            ToastCustom("Failed to create a portfolio", "error", loadingTeast)
            console.error("Error :", error);
        }
    };

    const getPortfolioData = async (portfolioUuid) => {
        try {
            const response = await apiFetch(`${apiUrl}/portfolio/${portfolioUuid}`, {
                method: "GET"
            });

            if (!response.ok) {
                throw new Error(`Erreur ${response.status}: ${await response.text()}`);
            }

            return await response.json()

        } catch (error) {
            console.error("Erreur :", error);
        }
    }

    const updatePortfolio = async(portfolioUuid, portfolioData) => {
        try {
            const loadingTeast = ToastCustom("Saving portfolio...", "loading")

            const response = await apiFetch(`${apiUrl}/portfolio/${portfolioUuid}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(portfolioData),
            }, bearerToken, refresh)

            if (!response.ok) {
                ToastCustom("An error occured...", "error", loadingTeast)
                throw new Error(`Erreur ${response.status}: ${await response.text()}`);
            }

            ToastCustom("Portfolio saved !", "success", loadingTeast)
        }  catch (error) {
            console.error("Erreur :", error)
        }
    }

    const deletePortfolio = async (portfolio, setUserData) => {
        try {
            const loadingTeast = ToastCustom("Deleting portfolio...", "loading")

            const response = await apiFetch(`${apiUrl}/portfolio/${portfolio.uuid}`, {
                method: "DELETE"
            }, bearerToken, refresh )

            if (!response.ok) {
                ToastCustom("An error occured...", "error", loadingTeast)
                throw new Error(`Erreur ${response.status}: ${await response.text()}`);
            }

            setUserData(prevData => ({
                ...prevData,
                portfolios: prevData.portfolios.filter(item => item.uuid !== portfolio.uuid)
            }));
            ToastCustom("Portfolio deleted !", "success", loadingTeast)

        } catch (error) {
            console.error("Erreur :", error)
        }
    }
    

    return {
        getOAuthUrl,
        sendAccessToken,
        getUserData,
        deleteConnection,
        createPortfolio,
        getPortfolioData,
        updatePortfolio,
        deletePortfolio
    };
};

export default apiService;

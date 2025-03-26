import { UseAuth } from "../../hooks/AuthProvider";
import apiFetch from "./apiFetch";

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
        } catch (error) {
            console.error("Error :", error);
        }
    };

    const sendAccessToken = async (code, website) => {
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
                const data = await response.json();
                return data
            }
        } catch (error) {
            console.error("Error :", error);
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

        } catch (error) {
            console.error("Error :", error)
        }
    }

    const deleteConnection = async (id) => {
        try {
            const response = await apiFetch(`${apiUrl}/connect/delete/${id}`, {
                method: "DELETE"
            }, bearerToken, refresh)

            if (!response.ok) {
                throw new Error(`Erreur ${response.status}: ${await response.text()}`);
            }

            console.log("Connexion supprimée avec succès !");
        } catch (error) {
            console.error("Error :", error)
        }

    }

    const createPortfolio = async (setUserData) => {
        try {
            const response = await apiFetch(`${apiUrl}/portfolio/create`, {
                method: "GET"
            }, bearerToken, refresh);
    
            if (!response.ok) {
                throw new Error(`Erreur ${response.status}: ${await response.text()}`);
            }
    
            const data = await response.json();
    
            setUserData(prevData => ({
                ...prevData,
                portfolios: prevData.portfolios ? [...prevData.portfolios, data] : [data] // Évite erreur si `portfolios` est undefined
            }));
    
        } catch (error) {
            console.error("Erreur :", error);
        }
    };

    const getPotfolioData = async (portfolioUuid) => {
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
    

    return {
        getOAuthUrl,
        sendAccessToken,
        getUserData,
        deleteConnection,
        createPortfolio,
        getPotfolioData
    };
};

export default apiService;

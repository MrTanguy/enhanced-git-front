import { UseAuth } from "../../hooks/AuthProvider";
import apiFetch from "./apiFetch";

const apiService = () => {
    const { bearerToken, refresh } = UseAuth();
    const apiUrl = import.meta.env.VITE_API_URL;

    const getOAuthUrl = async (website) => {
        try {
            const response = await apiFetch(`${apiUrl}/auth/oauthurl?website=${website}`, {
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

            const response = await apiFetch(`${apiUrl}/auth/oauthtoken`, {
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
            const response = await apiFetch(`${apiUrl}/auth/userdata`, {
                method: "GET"
            }, bearerToken, refresh)

            if (response.ok) {
                return await response.json()
            }

        } catch (error) {
            console.error("Error :", error)
        }
    }

    return {
        getOAuthUrl,
        sendAccessToken,
        getUserData
    };
};

export default apiService;

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
            formData.append("accessToken", code);
            formData.append("website", website)

            const response = await apiFetch(`${apiUrl}/auth/oauthToken`, {
                method: "POST",
                body: formData,
            }, bearerToken, refresh);

            if (response.ok) {
                const data = await response.json();
                console.log(data)
            }
        } catch (error) {
            console.error("Error :", error);
        }
    }

    return {
        getOAuthUrl,
        sendAccessToken
    };
};

export default apiService;

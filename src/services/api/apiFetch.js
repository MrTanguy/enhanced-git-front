
const apiFetch = async (url, options = {}, bearerToken, refresh) => {

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${bearerToken}`,
            },
        });

        if (response.status === 401) {
            const newBearerToken = await refresh();

            const retryResponse = await fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    Authorization: `Bearer ${newBearerToken}`,
                },
            });

            return retryResponse;
        }

        return response;
    } catch (error) {
        console.error("Erreur lors de l'appel API :", error);
        throw error;
    }
};

export default apiFetch;

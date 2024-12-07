import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [bearerToken, setBearerToken] = useState(null);

    const login = async (email, password) => {
        try {

            const formData = new FormData()
            formData.append("username", email)
            formData.append("password", password)

            const response = await fetch('https://127.0.0.1:8000/auth/token', {
                method: 'POST',
                headers: {
                    'Authorization': 'application/x-www-form-urlencoded',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData,
                credentials: "include"
            })

            data = await response.json()

            console.log(data)

            if (!response.ok) {
                throw new Error(data.detail || 'Login failed');
            }

            setBearerToken(data.bearer)
        } catch (error) {
            console.error("Login error: ", error.message);
            throw error;
        }
    }

    return (
        <AuthContext.Provider value={{ bearerToken, login }}>
            {children}
        </AuthContext.Provider>
    )
}

// Hook pour utiliser le contexte
export const useAuth = () => {
    const context = useContext(AuthContext);

    // Ajout d'un log pour vérifier l'accès au contexte
    console.log('useAuth context:', context);

    if (!context) {
        console.error('useAuth must be used within an AuthProvider');
    }

    return context;
}

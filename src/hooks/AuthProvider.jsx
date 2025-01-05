import { React, createContext, useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;

    const [bearerToken, setBearerToken] = useState(() => {
        return localStorage.getItem("bearerToken");
    });

    const saveToken = (token) => {
        setBearerToken(token);
        localStorage.setItem("bearerToken", token);
    };

    const refresh = async () => {
        console.log("refresh");
        try {
            const response = await fetch(`${apiUrl}/auth/refresh`, {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                if (response.status === 401) {
                    navigate("/login");
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || "An error occurred");
                }
            }

            const data = await response.json();
            saveToken(data.bearer);
            return data.bearer
        } catch (error) {
            console.error("Erreur réseau ou JSON invalide :", error);
            throw error;
        }
    };

    const login = async (email, password) => {
        try {
            const formData = new URLSearchParams();
            formData.append("username", email);
            formData.append("password", password);

            const response = await fetch(`${apiUrl}/auth/token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formData,
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "An error occurred");
            }

            const data = await response.json();
            saveToken(data.bearer);
        } catch (error) {
            throw error;
        }
    };

    const register = async (email, password) => {
        try {
            const formData = new URLSearchParams();
            formData.append("username", email);
            formData.append("password", password);

            const response = await fetch(`${apiUrl}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formData,
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "An error occurred");
            }

            const data = await response.json();
            saveToken(data.bearer);
        } catch (error) {
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ bearerToken, login, register, refresh }}>
            {children}
        </AuthContext.Provider>
    );
};

export const UseAuth = () => {return useContext(AuthContext)}
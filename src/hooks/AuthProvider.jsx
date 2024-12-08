import { React, createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [bearerToken, setBearerToken] = useState(null);

    const login = async (email, password) => {
        try {

            const formData = new URLSearchParams();
            formData.append("username", email);
            formData.append("password", password);
    
            const response = await fetch('https://127.0.0.1:8000/auth/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "An error occurred");
            }
    
            const data = await response.json();
            setBearerToken(data.bearer); 
        } catch (error) {
            throw error; 
        }
    };

    const register = async (email, password) => {
        try {

            const formData = new URLSearchParams();
            formData.append("username", email);
            formData.append("password", password);
    
            const response = await fetch('https://127.0.0.1:8000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "An error occurred");
            }
    
            const data = await response.json();
            setBearerToken(data.bearer); 
        } catch (error) {
            throw error; 
        }
    }
    
    return (
        <AuthContext.Provider value={{ bearerToken, login, register }}>
            {children}
        </AuthContext.Provider>
    )
}

export const UseAuth = () => {return useContext(AuthContext)}
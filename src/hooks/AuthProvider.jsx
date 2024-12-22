import { React, createContext, useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [bearerToken, setBearerToken] = useState(() => {
        return localStorage.getItem('bearerToken');
    });

    const saveToken = (token) => {
        setBearerToken(token);
        localStorage.setItem('bearerToken', token); 
    };

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
                body: formData,
                credentials: "include"
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "An error occurred");
            }
    
            const data = await response.json();
            saveToken(data.bearer)
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
            saveToken(data.bearer)
        } catch (error) {
            throw error; 
        }
    }

    const refresh = async () => {
        console.log('refresh');
        try {
            const response = await fetch('https://127.0.0.1:8000/auth/refresh', {
                method: 'GET',
                credentials: 'include'
            });
    
            if (!response.ok) {
                if (response.status == 401) {
                    navigate('/login')
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || "An error occurred");
                }
            }
    
            const data = await response.json();
            saveToken(data.bearer)
        } catch (error) {
            console.error('Erreur réseau ou JSON invalide :', error);
        }
    };
    

    const getOAuthUrl = async (website) => {
        try {
            const response = await fetch(`https://127.0.0.1:8000/auth/oauthurl?website=${encodeURIComponent(website)}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${bearerToken}`,
                },
            });
    
            if (!response.ok) {
                if (response.status === 401) {
                    await refresh();
                } else {
                    console.error(await response.json());
                }
            } else {
                const data = await response.json();
                console.log(data)
                window.location.href = data;
            }
        } catch (error) {
            console.error(error.message);
        }
    };
    
    
    return (
        <AuthContext.Provider value={{ bearerToken, login, register, getOAuthUrl }}>
            {children}
        </AuthContext.Provider>
    )
}

export const UseAuth = () => {return useContext(AuthContext)}
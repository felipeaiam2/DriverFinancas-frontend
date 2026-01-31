import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        console.log(`Tentando login em: ${API_URL}/api/auth/login`);
        try {
            const { data } = await axios.post(`${API_URL}/api/auth/login`, { email, password });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));

            if (window.AndroidBridge && window.AndroidBridge.saveToken) {
                console.log("Enviando token para o app Android:", data.token);
                window.AndroidBridge.saveToken(data.token);
            } else {
                console.log("AndroidBridge não encontrado ou saveToken indisponível - rodando no navegador ou função não implementada?");
            }

            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const register = async (name, email, password) => {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        try {
            const { data } = await axios.post(`${API_URL}/api/auth/register`, { name, email, password });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
    };

    const getToken = () => {
        return user?.token;
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, getToken }}>
            {children}
        </AuthContext.Provider>
    );
};

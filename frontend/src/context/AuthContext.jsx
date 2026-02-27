import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('asm_token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchMe();
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchMe = async () => {
        try {
            const res = await axios.get('/api/users/me');
            setUser(res.data);
        } catch {
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = (tokenVal, userData) => {
        localStorage.setItem('asm_token', tokenVal);
        axios.defaults.headers.common['Authorization'] = `Bearer ${tokenVal}`;
        setToken(tokenVal);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('asm_token');
        delete axios.defaults.headers.common['Authorization'];
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

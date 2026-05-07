import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Restore session from sessionStorage (persists on refresh, clears on tab/browser close)
        const token = sessionStorage.getItem('token');
        const storedUser = sessionStorage.getItem('user');

        if (token && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
                setIsAuthenticated(true);
            } catch (e) {
                console.error('Failed to parse user from sessionStorage', e);
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await api.post('/auth/login', { username, password });
            const { access_token, role, username: responseUsername } = response;

            sessionStorage.setItem('token', access_token);

            const userData = {
                username: responseUsername || username,
                role
            };
            sessionStorage.setItem('user', JSON.stringify(userData));

            setUser(userData);
            setIsAuthenticated(true);
            return true;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const signup = async (username, password, role) => {
        try {
            await api.post('/auth/signup', { username, password, role });
            return true;
        } catch (error) {
            console.error('Signup failed:', error);
            throw error;
        }
    };

    const logout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

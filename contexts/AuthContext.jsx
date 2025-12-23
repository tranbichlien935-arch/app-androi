import firebaseApi from '@/services/firebase-api';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Listen to Firebase auth state changes
    useEffect(() => {
        const unsubscribe = firebaseApi.onAuthChange((firebaseUser) => {
            setUser(firebaseUser);
            setIsAuthenticated(!!firebaseUser);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    // Authentication methods
    const login = async (email, password) => {
        try {
            const result = await firebaseApi.login(email, password);
            return result.success;
        } catch (error) {
            throw error;
        }
    };

    const signup = async (email, password, fullName) => {
        try {
            const result = await firebaseApi.register(email, password, { fullName });
            return result.success;
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await firebaseApi.logout();
            return true;
        } catch (error) {
            throw error;
        }
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        signup,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

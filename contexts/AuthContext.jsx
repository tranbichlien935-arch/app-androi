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

    const value = {
        user,
        isAuthenticated,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

import { LEVEL_THRESHOLDS } from '@/constants/habits';
import { clearUser, loadUser, saveUser } from '@/utils/storage';
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

    // Load user on mount
    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const savedUser = await loadUser();
            if (savedUser) {
                setUser(savedUser);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Error loading user:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateLevel = (points) => {
        for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
            if (points >= LEVEL_THRESHOLDS[i].points) {
                return LEVEL_THRESHOLDS[i].level;
            }
        }
        return 1;
    };

    const login = async (email, password) => {
        try {
            // Simple local authentication - check if user exists
            const savedUser = await loadUser();

            if (savedUser && savedUser.email === email) {
                // In a real app, you'd verify password here
                setUser(savedUser);
                setIsAuthenticated(true);
                return true;
            }

            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const signup = async (email, password, name) => {
        try {
            // Check if user already exists
            const existingUser = await loadUser();
            if (existingUser) {
                return false; // User already exists
            }

            const newUser = {
                id: Date.now().toString(),
                email,
                name,
                points: 0,
                level: 1,
                createdAt: new Date().toISOString(),
            };

            await saveUser(newUser);
            setUser(newUser);
            setIsAuthenticated(true);
            return true;
        } catch (error) {
            console.error('Signup error:', error);
            return false;
        }
    };

    const logout = async () => {
        try {
            await clearUser();
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const updateUserPoints = async (points) => {
        try {
            if (!user) return;

            const newLevel = calculateLevel(points);
            const updatedUser = { ...user, points, level: newLevel };

            await saveUser(updatedUser);
            setUser(updatedUser);
        } catch (error) {
            console.error('Error updating points:', error);
        }
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        signup,
        logout,
        updateUserPoints,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

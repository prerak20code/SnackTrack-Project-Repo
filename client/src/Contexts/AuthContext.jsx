import { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../Services/index';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const initializeAuth = async () => {
            try {
                const userData = await userService.getCurrentUser(signal);
                if (userData && userData._id) {
                    setUser(userData);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
        return () => controller.abort();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await userService.login(credentials);
            setUser(response.user);
            setIsAuthenticated(true);
            return response;
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await userService.logout();
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const value = {
        user,
        setUser,
        isAuthenticated,
        loading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthContextProvider');
    }
    return context;
};

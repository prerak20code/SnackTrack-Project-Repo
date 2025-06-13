import { createContext, useContext, useState, useCallback } from 'react';

const NotificationsContext = createContext();

export function NotificationsProvider({ children }) {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((notification) => {
        setNotifications((prev) => [
            {
                id: Date.now(),
                timestamp: new Date(),
                ...notification,
            },
            ...prev,
        ]);
    }, []);

    const clearNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }, []);

    return (
        <NotificationsContext.Provider
            value={{
                notifications,
                addNotification,
                clearNotification,
            }}
        >
            {children}
        </NotificationsContext.Provider>
    );
}

export const useNotifications = () => useContext(NotificationsContext);

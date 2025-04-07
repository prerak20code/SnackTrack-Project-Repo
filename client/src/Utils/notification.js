// utils/notifications.js
export const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission !== 'granted') {
        try {
            await Notification.requestPermission();
        } catch (err) {
            console.error('Notification permission error:', err);
        }
    }
};

export function sendNotification(title, options = {}) {
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
        new Notification(title, options);
    }
};


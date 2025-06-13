import { useNotifications } from '../../Contexts/notifications.context';
import { format } from 'date-fns';
import { useDarkMode } from '../../Contexts/DarkMode';

export default function NotificationsPopup() {
    const { notifications, clearNotification } = useNotifications();
    const { isDarkMode } = useDarkMode();

    return (
        <div
            className={`relative w-[350px] sm:w-[450px] transition-all duration-300 rounded-xl overflow-hidden ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}
        >
            <div
                className={`p-4 border-b ${
                    isDarkMode
                        ? 'border-gray-700 text-white'
                        : 'border-gray-200 text-black'
                }`}
            >
                <h2 className="text-lg font-semibold">Notifications</h2>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                    <div
                        className={`p-4 text-center ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}
                    >
                        No notifications
                    </div>
                ) : (
                    notifications.map((notif) => (
                        <div
                            key={notif.id}
                            className={`p-4 border-b ${
                                isDarkMode
                                    ? 'hover:bg-gray-700 border-gray-700'
                                    : 'hover:bg-gray-50 border-gray-200'
                            } ${
                                notif.type === 'error'
                                    ? 'border-l-4 border-l-red-500'
                                    : 'border-l-4 border-l-green-500'
                            }`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3
                                        className={`font-medium ${
                                            isDarkMode
                                                ? 'text-white'
                                                : 'text-gray-900'
                                        }`}
                                    >
                                        {notif.title}
                                    </h3>
                                    <p
                                        className={`text-sm ${
                                            isDarkMode
                                                ? 'text-gray-300'
                                                : 'text-gray-600'
                                        }`}
                                    >
                                        {notif.message}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {format(
                                            new Date(notif.timestamp),
                                            'MMM d, yyyy h:mm a'
                                        )}
                                    </p>
                                </div>
                                <button
                                    onClick={() => clearNotification(notif.id)}
                                    className={`${
                                        isDarkMode
                                            ? 'text-gray-400 hover:text-gray-200'
                                            : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

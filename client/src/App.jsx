import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSideBarContext, useUserContext, usePopupContext } from './Contexts';
import { userService } from './Services';
import { icons } from './Assets/icons';
import { useSocket } from './customhooks/socket';
import toast from 'react-hot-toast';
import { sendNotification } from './Utils/notification';
import { useDarkMode } from './Contexts/DarkMode';

export default function App() {
    const [loading, setLoading] = useState(true);
    const { setUser, user } = useUserContext();
    const { setShowSideBar } = useSideBarContext();
    const { setShowPopup } = usePopupContext();
    const navigate = useNavigate();
    const location = useLocation();
    const socket = useSocket(false);
    const { isDarkMode } = useDarkMode();

    // get current user
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        (async function currentUser() {
            try {
                setLoading(true);
                const user = await userService.getCurrentUser(signal);
                setUser(user && !user.message ? user : null);
            } catch (err) {
                navigate('/server-error');
            } finally {
                setLoading(false);
            }
        })();

        return () => {
            controller.abort();
            setUser(null);
        };
    }, []);

    // socket listeners for order updates
    useEffect(() => {
        if (!socket || !user) return;

        const updateOrderInUI = (orderId, newStatus) => {
            console.log(`Order ${orderId} updated to ${newStatus}`);
        };

        socket.on('orderPrepared', (order) => {
            toast.success('Your order is prepared!');
            sendNotification('Order Prepared', {
                body: 'Your order is ready to be picked up.',
                icon: '/prepared-icon.png',
            });
            updateOrderInUI(order._id, 'Prepared');
        });

        socket.on('orderRejected', (order) => {
            toast.error('Your order was rejected.');
            sendNotification('Order Rejected', {
                body: 'Your order was rejected by the canteen.',
                icon: '/rejected-icon.png',
            });
            updateOrderInUI(order._id, 'Rejected');
        });

        socket.on('orderPickedUp', (order) => {
            toast.success('Order picked up!');
            sendNotification('Order Picked Up', {
                body: 'You have picked up your order.',
                icon: '/pickedup-icon.png',
            });
            updateOrderInUI(order._id, 'PickedUp');
        });

        return () => {
            socket.off('orderPrepared');
            socket.off('orderRejected');
            socket.off('orderPickedUp');
        };
    }, [socket, user]);

    // 📌 Request notification permission once user is available
    useEffect(() => {
        if (!user) return;

        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    toast.success('Notifications enabled!');
                } else if (permission === 'denied') {
                    toast('You can enable notifications in browser settings.', {
                        icon: '🔕',
                    });
                }
            });
        }
    }, [user]);

    // Close sidebar & popups on window resize and location change
    useEffect(() => {
        const closeSidebar = () => setShowSideBar(false);
        const closePopup = () => setShowPopup(false);
        window.addEventListener('resize', closeSidebar);
        closeSidebar();
        closePopup();
    }, [location]);

    return (
        <div
            className={`h-screen w-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}
        >
            {' '}
            {loading ? (
                <div className="text-black h-full w-full flex flex-col items-center justify-center">
                    <div className="size-[33px] fill-[#4977ec] dark:text-[#ececec]">
                        {icons.loading}
                    </div>
                    <p className="mt-2 text-2xl font-semibold">
                        Please Wait...
                    </p>
                    <p className="text-[16px] mt-1">
                        Please refresh the page, if it takes too long
                    </p>
                </div>
            ) : (
                <Outlet />
            )}
        </div>
    );
}

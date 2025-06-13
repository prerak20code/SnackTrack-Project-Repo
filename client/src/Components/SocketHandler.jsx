import { useEffect } from 'react';
import { useSocket } from '../customhooks/socket';
import { useNotifications } from '../Contexts/notifications.context';
import { useUserContext } from '../Contexts';
import toast from 'react-hot-toast';
import { sendNotification } from '../Utils/notification';

export default function SocketHandler() {
    const socket = useSocket(false);
    const { addNotification } = useNotifications();
    const { user } = useUserContext();

    useEffect(() => {
        // Debug logs
        console.log('Socket:', socket ? 'Connected' : 'Not connected');
        console.log('User:', user ? 'Authenticated' : 'Not authenticated');

        if (!socket || !user) {
            console.log('Socket or user not available, skipping setup');
            return;
        }

        const handleOrderPrepared = (order) => {
            console.log('Order prepared event received:', order);
            if (order?.student === user._id) {
                console.log('Showing notifications for prepared order');
                toast.success('Your order is prepared!');

                // Browser notification
                try {
                    sendNotification('Order Prepared', {
                        body: 'Your order is ready to be picked up.',
                        icon: '/prepared-icon.png',
                    });
                } catch (error) {
                    console.error('Browser notification failed:', error);
                }

                // In-app notification
                addNotification({
                    title: 'Order Prepared',
                    message: 'Your order is ready to be picked up.',
                    type: 'success',
                    orderId: order._id,
                    timestamp: new Date(),
                });
            }
        };

        const handleOrderRejected = (order) => {
            console.log('Order rejected event received:', order);
            if (order?.student === user._id) {
                console.log('Showing notifications for rejected order');
                toast.error('Your order was rejected.');

                try {
                    sendNotification('Order Rejected', {
                        body: 'Your order was rejected by the canteen.',
                        icon: '/rejected-icon.png',
                    });
                } catch (error) {
                    console.error('Browser notification failed:', error);
                }

                addNotification({
                    title: 'Order Rejected',
                    message: 'Your order was rejected by the canteen.',
                    type: 'error',
                    orderId: order._id,
                    timestamp: new Date(),
                });
            }
        };

        const handleOrderPickedUp = (order) => {
            console.log('Order picked up event received:', order);
            if (order?.student === user._id) {
                console.log('Showing notifications for picked up order');
                toast.success('Order picked up!');

                try {
                    sendNotification('Order Picked Up', {
                        body: 'You have picked up your order.',
                        icon: '/pickedup-icon.png',
                    });
                } catch (error) {
                    console.error('Browser notification failed:', error);
                }

                addNotification({
                    title: 'Order Picked Up',
                    message: 'You have picked up your order.',
                    type: 'success',
                    orderId: order._id,
                    timestamp: new Date(),
                });
            }
        };

        // Set up socket listeners
        console.log('Setting up socket listeners');
        socket.on('orderPrepared', handleOrderPrepared);
        socket.on('orderRejected', handleOrderRejected);
        socket.on('orderPickedUp', handleOrderPickedUp);

        // Cleanup function
        return () => {
            console.log('Cleaning up socket listeners');
            if (socket) {
                socket.off('orderPrepared', handleOrderPrepared);
                socket.off('orderRejected', handleOrderRejected);
                socket.off('orderPickedUp', handleOrderPickedUp);
            }
        };
    }, [socket, addNotification, user]);

    return null;
}

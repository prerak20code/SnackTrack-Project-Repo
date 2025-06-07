import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useUserDetails } from './userdetails'; // Import as a hook

export const useSocket = (canteen) => {
    const user = useUserDetails(); // ✅ Now it's a hook
    const [socket, setSocket] = useState(null);
    useEffect(() => {
        if (!user || !user._id) return; // ✅ Ensure user is available before connecting
        // console.log('Connecting to socket with user ID:', user._id);
        let userId = user._id;
        if (canteen) {
            console.log('Connecting to socket with canteen ID:', user._id);
            userId = user._id;
        } else {
            console.log('Connecting to socket with student ID:', user._id);
        }

        const newSocket = io(import.meta.env.VITE_BACKEND_URL, {
            auth: { userId: userId },
            reconnection: true,
            transports: ['websocket'],
        });

        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Socket connected:', newSocket.id);
        });

        newSocket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        return () => newSocket.disconnect();
    }, [user]);

    return socket;
};

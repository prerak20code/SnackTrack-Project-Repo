import { useEffect, useState } from 'react';
import { userService } from '../Services/index';

export const useUserDetails = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        (async () => {
            try {
                const userData = await userService.getCurrentUser(signal);

                if (userData && userData._id) {
                    setUser(userData);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        })();

        return () => controller.abort();
    }, []);

    return user;
};

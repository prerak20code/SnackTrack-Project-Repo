import { SERVER_ERROR } from '../Constants/constants';

class UserService {
    async getCurrentUser(signal) {
        try {
            const res = await fetch('/api/users/current', {
                method: 'GET',
                credentials: 'include',
                signal,
            });

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            if (err.name === 'AbortError') {
                console.log('fetch current user request aborted');
            } else {
                console.error('error in getCurrentUser service', err);
                throw err;
            }
        }
    }
}

export const userService = new UserService();

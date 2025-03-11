import { SERVER_ERROR } from '../Constants/constants';

class UserService {
    async getCurrentUser() {
        try {
            const res = await fetch('/api/users/current', {
                method: 'GET',
                credentials: 'include',
            });

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in getCurrentUser service', err);
            throw err;
        }
    }
}

export const userService = new UserService();

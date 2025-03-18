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

    async logout() {
        try {
            const res = await fetch('/api/users/logout', {
                method: 'PATCH',
                credentials: 'include',
            });

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in logout service', err);
            throw err;
        }
    }

    async getCanteens(signal) {
        try {
            const res = await fetch(`/api/users/canteens`, {
                method: 'GET',
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
                console.log('getCanteens request aborted.');
            } else {
                console.error('error in getCanteens service', err);
                throw err;
            }
        }
    }

    async sendEmailVerification(email) {
        try {
            const res = await fetch('/api/users/mail', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in sendEmailVerification service', err);
            throw err;
        }
    }

    async verifyEmail(email, code) {
        try {
            const res = await fetch('/api/users/verify', {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code }),
            });

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in verifyEmail service', err);
            throw err;
        }
    }
}

export const userService = new UserService();

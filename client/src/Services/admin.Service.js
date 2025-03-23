import { SERVER_ERROR } from '../Constants/constants';

class AdminService {
    async verifyAdminKey(key) {
        try {
            const res = await fetch(`/api/admins/verify-key`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key }),
            });

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in verifyAdminKey service', err);
            throw err;
        }
    }

    async verifyAdmin(signal) {
        try {
            const res = await fetch('/api/admins/verify', {
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
                console.log('verify admin request aborted');
            } else {
                console.error('error in verifyAdmin service', err);
                throw err;
            }
        }
    }

    async getCanteens(signal) {
        try {
            const res = await fetch(`/api/admins`, { method: 'GET', signal });

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
}

export const adminService = new AdminService();

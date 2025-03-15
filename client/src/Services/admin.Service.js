import { SERVER_ERROR } from '../Constants/constants';

class AdminService {
    async register() {}

    async login({ emailOrPhoneNo, password }) {
        try {
            const res = await fetch('/api/admins/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailOrPhoneNo, password }),
            });

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in admin login service', err);
            throw err;
        }
    }

    async logout() {
        try {
            const res = await fetch('/api/admins/logout', {
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
            console.error('error in admin logout service', err);
            throw err;
        }
    }

    async updateAccountDetails({ email, phoneNumber, fullName, password }) {
        try {
            const res = await fetch('/api/admins/account', {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    phoneNumber,
                    fullName,
                    password,
                }),
            });

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in admin updateAccountDetails service', err);
            throw err;
        }
    }

    async updatePassword(oldPassword, newPassword) {
        try {
            const res = await fetch('/api/admins/password', {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    newPassword,
                    oldPassword,
                }),
            });

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in admin updatePassword service', err);
            throw err;
        }
    }

    async updateAvatar(avatar) {
        try {
            const formData = new FormData();
            formData.append('avatar', avatar);

            const res = await fetch('/api/admins/avatar', {
                method: 'PATCH',
                credentials: 'include',
                body: formData,
            });

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in admin updateAvatar service', err);
            throw err;
        }
    }

    async registerContractor() {}

    async changeContractor() {}

    async getContractor() {}

    async addCanteen() {}

    async removeCanteen() {}

    async getCanteens(signal) {
        try {
            const res = await fetch(`/api/admins/canteens`, {
                method: 'GET',
                signal,
                credentials: 'include',
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
}

export const adminService = new AdminService();

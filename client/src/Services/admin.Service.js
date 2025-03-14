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

    async updateAccountDetails() {}

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

    async getCanteens() {}
}

export const adminService = new AdminService();

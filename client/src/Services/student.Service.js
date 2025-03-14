import { SERVER_ERROR } from '../Constants/constants';

class StudentService {
    async login({ userName, password }) {
        try {
            const res = await fetch('/api/students/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName, password }),
            });

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in student login service', err);
            throw err;
        }
    }

    async logout() {
        try {
            const res = await fetch('/api/students/logout', {
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
            console.error('error in student logout service', err);
            throw err;
        }
    }

    async updateAvatar(avatar) {
        try {
            const formData = new FormData();
            formData.append('avatar', avatar);

            const res = await fetch('/api/students/avatar', {
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
            console.error('error in student updateAvatar service', err);
            throw err;
        }
    }

    async updatePassword(oldPassword, newPassword) {
        try {
            const res = await fetch('/api/students/password', {
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
            console.error('error in student updatePassword service', err);
            throw err;
        }
    }

    async getStudents(canteenId, signal, page = 1, limit = 10) {
        try {
            const res = await fetch(
                `/api/students/${canteenId}/?page=${page}&limit=${limit}`,
                {
                    method: 'GET',
                    signal,
                    credentials: 'include',
                }
            );

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            if (err.name === 'AbortError') {
                console.log('getStudents request aborted.');
            } else {
                console.error('error in getStudents service', err);
                throw err;
            }
        }
    }
}

export const studentService = new StudentService();

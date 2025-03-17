import { SERVER_ERROR } from '../Constants/constants';

class ContractorService {
    // personal usage

    async login({ emailOrPhoneNo, password }) {
        try {
            const res = await fetch('/api/contractors/login', {
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
            console.error('error in contractor login service', err);
            throw err;
        }
    }

    async logout() {
        try {
            const res = await fetch('/api/contractors/logout', {
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
            console.error('error in contractor logout service', err);
            throw err;
        }
    }

    async updateAccountDetails({ email, phoneNumber, fullName, password }) {
        try {
            const res = await fetch('/api/contractors/account', {
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
            console.error(
                'error in contractor updateAccountDetails service',
                err
            );
            throw err;
        }
    }

    async updatePassword(oldPassword, newPassword) {
        try {
            const res = await fetch('/api/contractors/password', {
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
            console.error('error in contractor updatePassword service', err);
            throw err;
        }
    }

    async updateAvatar(avatar) {
        try {
            const formData = new FormData();
            formData.append('avatar', avatar);

            const res = await fetch('/api/contractors/avatar', {
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
            console.error('error in contractor updateAvatar service', err);
            throw err;
        }
    }

    // student management tasks

    async registerStudent({ fullName, rollNo, password, phoneNumber }) {
        try {
            const res = await fetch('/api/contractors/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName,
                    rollNo,
                    password,
                    phoneNumber,
                }),
            });

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in registerStudent service', err);
            throw err;
        }
    }

    async removeStudent(studentId, password) {
        try {
            const res = await fetch(`/api/contractors/students/${studentId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in removeStudent service', err);
            throw err;
        }
    }

    async removeAllStudents(password) {
        try {
            const res = await fetch(`/api/contractors/students`, {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in removeAllStudents service', err);
            throw err;
        }
    }

    async updateStudentAccountDetails(
        studentId,
        { fullName, phoneNumber, rollNo, password, contractorPassword }
    ) {
        try {
            const res = await fetch(`/api/contractors/students/${studentId}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName,
                    phoneNumber,
                    rollNo,
                    password,
                    contractorPassword,
                }),
            });

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in updateStudentAccountDetails service', err);
            throw err;
        }
    }

    // snack management tasks

    async removeSnack(snackId, password) {
        try {
            const res = await fetch(`/api/contractors/snacks/${snackId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in deleteSnack service', err);
            throw err;
        }
    }

    async addSnack({ image, name, price, password }) {
        try {
            const inputs = { image, name, price, password };
            const formData = new FormData();
            Object.entries(inputs).forEach(([key, value]) => {
                formData.append(key, value);
            });

            const res = await fetch('/api/contractors/snacks', {
                method: 'POST',
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
            console.error('error in addSnack service', err);
            throw err;
        }
    }

    async updateSnackDetails({ name, price, image, password }, snackId) {
        try {
            const inputs = { image, name, price, password };
            console.log(inputs);
            const formData = new FormData();
            Object.entries(inputs).forEach(([key, value]) => {
                formData.append(key, value);
            });

            const res = await fetch(`/api/contractors/snacks/${snackId}`, {
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
            console.error('error in updateSnackDetails service', err);
            throw err;
        }
    }

    async toggleSnackAvailability(snackId) {
        try {
            const res = await fetch(
                `/api/contractors/snacks/availability/${snackId}`,
                {
                    method: 'PATCH',
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
            console.error('error in toggleSnackAvailability service', err);
            throw err;
        }
    }

    // packaged food management tasks

    async removeItem(itemId, password) {
        try {
            const res = await fetch(`/api/contractors/packaged/${itemId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in deleteItem service', err);
            throw err;
        }
    }

    async addItem({ variants, category, password }) {
        try {
            const res = await fetch('/api/contractors/packaged', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    variants,
                    category,
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
            console.error('error in addItem service', err);
            throw err;
        }
    }

    async updateItemDetails({ category, variants, password }, itemId) {
        try {
            const res = await fetch(`/api/contractors/packaged/${itemId}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    variants,
                    password,
                    category,
                }),
            });

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in updateItemDetails service', err);
            throw err;
        }
    }
}

export const contractorService = new ContractorService();

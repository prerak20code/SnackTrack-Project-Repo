class StudentService {
    async login(inputs) {
        try {
            const res = await fetch('/api/students/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inputs),
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in login service', err);
            throw err;
        }
    }

    async register(inputs) {
        try {
            const formData = new FormData();
            Object.entries(inputs).forEach(([key, value]) => {
                formData.append(key, value);
            });

            const res = await fetch('/api/students/register', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            } else if (res.status === 400) {
                return data;
            } else {
                const data1 = await this.login({
                    loginInput: inputs.userName,
                    password: inputs.password,
                });
                return data1;
            }
        } catch (err) {
            console.error('error in register service', err);
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

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in logout service', err);
            throw err;
        }
    }

    async deleteAccount(password) {
        try {
            const res = await fetch('/api/students/delete', {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in deleteAccount service', err);
            throw err;
        }
    }

    async getCurrentUser(signal) {
        try {
            const res = await fetch('/api/students/current', {
                method: 'GET',
                credentials: 'include',
                signal,
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            if (err.name === 'AbortError') {
                console.log('get current user request aborted.');
            } else {
                console.error('error in getCurrentUser service', err);
                throw err;
            }
        }
    }

    async updateAccountDetails(inputs) {
        try {
            const res = await fetch('/api/students/account', {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inputs),
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in updateAccountDetails service', err);
            throw err;
        }
    }

    async updatePassword(newPassword, oldPassword) {
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

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in updatePassword service', err);
            throw err;
        }
    }
}

export const studentService = new StudentService();

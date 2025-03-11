class AuthService {
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
}

export const authService = new AuthService();

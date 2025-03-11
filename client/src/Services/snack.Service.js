class SnackService {
    async getSnacks(signal, channelId, limit = 10, page = 1, orderBy = 'desc') {
        try {
            const res = await fetch(
                `/api/snacks/channel/${channelId}?limit=${limit}&orderBy=${orderBy}&page=${page}`,
                { signal, method: 'GET' }
            );

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            if (err.name === 'AbortError') {
                console.log('get snacks request aborted.');
            } else {
                console.error('error in getSnacks service', err);
                throw err;
            }
        }
    }

    async updateSnackDetails(inputs, postId) {
        try {
            const res = await fetch(`/api/snacks/details/${postId}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inputs), // title, content & category
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in updateSnackDetails service', err);
            throw err;
        }
    }

    async updateSnackImage(postImage, postId) {
        try {
            const formData = new FormData();
            formData.append('image', image);

            const res = await fetch(`/api/snacks/image/${postId}`, {
                method: 'PATCH',
                credentials: 'include',
                body: formData,
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in updateSnackImage service', err);
            throw err;
        }
    }

    async deleteSnack(postId) {
        try {
            const res = await fetch(`/api/snacks/delete/${postId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in deleteSnack service', err);
            throw err;
        }
    }

    async addSnack(inputs) {
        try {
            const formData = new FormData();
            Object.entries(inputs).forEach(([key, value]) => {
                formData.append(key, value);
            });

            const res = await fetch('/api/snacks/add', {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in addSnack service', err);
            throw err;
        }
    }

    async toggleSnackAvailability(postId) {
        try {
            const res = await fetch(`/api/snacks/availability/${postId}`, {
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
            console.error('error in toggleSnackAvailability service', err);
            throw err;
        }
    }
}

export const snackService = new SnackService();

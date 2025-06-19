import { SERVER_ERROR } from '../Constants/constants';

class SnackService {
    async getSnacks(signal) {
        try {
            const res = await fetch(`/api/snacks`, {
                signal,
                method: 'GET',
            });

            const data = await res.json();
            // console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            if (err.name === 'AbortError') {
                console.log('getSnacks request aborted.');
            } else {
                console.error('error in getSnacks service', err);
                throw err;
            }
        }
    }

    async getPackagedFoodItems(signal) {
        try {
            const res = await fetch(`/api/snacks/packaged`, {
                signal,
                method: 'GET',
            });

            const data = await res.json();
            // console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            if (err.name === 'AbortError') {
                console.log('getPackagedFoodItems request aborted.');
            } else {
                console.error('error in getPackagedFoodItems service', err);
                throw err;
            }
        }
    }
    async getTopSnacks(signal) {
        try {
            const res = await fetch(`/api/snacks/top-snacks`, {
                method: 'GET',
                signal,
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Failed to fetch top snacks');
            }

            return data;
        } catch (err) {
            if (err.name === 'AbortError') {
                console.log('getTopSnacks request aborted.');
            } else {
                console.error('Error in getTopSnacks service:', err.message);
                throw err;
            }
        }
    }
}

export const snackService = new SnackService();

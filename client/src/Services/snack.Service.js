import { SERVER_ERROR } from '../Constants/constants';

class SnackService {
    async getSnacks(signal, page = 1, limit = 10) {
        try {
            const res = await fetch(`/api/snacks?limit=${limit}&page=${page}`, {
                signal,
                method: 'GET',
            });

            const data = await res.json();
            console.log(data);

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

    async getPackagedFoodItems(signal, page = 1, limit = 10) {
        try {
            const res = await fetch(
                `/api/snacks/packaged?limit=${limit}&page=${page}`,
                { signal, method: 'GET' }
            );

            const data = await res.json();
            console.log(data);

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
}

export const snackService = new SnackService();

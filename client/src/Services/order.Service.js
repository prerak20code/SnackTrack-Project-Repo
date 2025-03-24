import { SERVER_ERROR } from '../Constants/constants';

class OrderService {
    async placeOrder(cartItems, total) {
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cartItems: cartItems.map((i) => ({
                        itemId: i._id,
                        quantity: i.quantity,
                        itemType: i.type,
                        price: i.price,
                    })),
                    total,
                }),
            });

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in placeOrder service', err);
            throw err;
        }
    }

    async updateOrderStatus(orderId, status) {}

    async getOrders(studentId) {}
}

export const orderService = new OrderService();

import { SERVER_ERROR } from '../Constants/constants';
class OrderService {
    async placeOrder(cartItems, total, socket) {
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cartItems: cartItems.map((i) => ({
                        canteenId: i.canteenId,
                        studentId: i.studentId,
                        itemId: i._id,
                        quantity: i.quantity,
                        itemType: i.type,
                        price: i.price,
                        name: i.name,
                    })),
                    total,
                }),
            });

            const data = await res.json();

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }

            const { order, studentinfo } = await data;

            const finalOrder = {
                _id: order._id,
                amount: order.amount,
                canteenId: order.canteenId,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
                status: order.status,
                items: [
                    ...order.items?.map((item) => ({
                        _id: item._id,
                        name: item.name,
                        canteenId: item.canteenId,
                        studentId: item.studentId,
                        itemId: item.itemId,
                        quantity: item.quantity,
                        itemType: item.itemType,
                        price: item.price,
                    })),
                ],
                studentId: order.studentId,
                studentInfo: studentinfo,
            };

            console.log('studentinfo', finalOrder.studentInfo);
            console.log('data item', finalOrder.items);
            if (socket) {
                socket.emit('newOrder', finalOrder);
                console.log('📦 Order placed & event emitted:', finalOrder);
            } else {
                console.log(
                    "⚠️ Socket not connected, order won't reflect in real-time."
                );
            }

            return finalOrder;
        } catch (err) {
            console.error('error in placeOrder service', err);
            throw err;
        }
    }

    async updateOrderStatus(order, orderId, status, socket) {
        try {
            const res = await fetch(`/api/orders/${orderId}?status=${status}`, {
                method: 'PATCH',
                credentials: 'include',
            });
            order.status = status;
            if (status === 'PickedUp') {
                socket.emit('orderPickedUp', order, status);
                console.log('📦 Order picked up & event emitted:', order);
            } else if (status === 'Prepared') {
                socket.emit('orderPrepared', order, status);
                console.log('📦 Order prepared & event emitted:', order);
            } else if (status === 'Rejected') {
                socket.emit('orderRejected', order, status);
                console.log('📦 Order rejected & event emitted:', order);
            }

            const data = await res.json();

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in updateOrderStatus service', err);
            throw err;
        }
    }

    async getStudentOrders(studentId, signal, page, limit) {
        try {
            const res = await fetch(
                `/api/orders/${studentId}?page=${page}&limit=${limit}`,
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
                console.log('getStudentOrders request aborted.');
            } else {
                console.error('error in getStudentOrders service', err);
                throw err;
            }
        }
    }

    async getCanteenOrders(status, page, limit, signal, socket) {
        try {
            const res = await fetch(
                `/api/orders?limit=${limit}&page=${page}&status=${status}`,
                {
                    method: 'GET',
                    signal,
                    credentials: 'include',
                }
            );

            const data = await res.json();
            console.log('data lll', data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            if (err.name === 'AbortError') {
                console.log('getCanteenOrders request aborted.');
            } else {
                console.error('error in getCanteenOrders service', err);
                throw err;
            }
        }
    }
}

export const orderService = new OrderService();

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LIMIT } from '../../Constants/constants';
import { paginate } from '../../Utils';
import { orderService } from '../../Services';
import { motion } from 'framer-motion';
import { ContractorOrderCard } from '..';
import { useSocket } from '../../customhooks/socket';
import toast from 'react-hot-toast';
export default function PendingOrders() {
    const [orders, setOrders] = useState(() => []); // ✅ Always initialize as an array
    const [ordersInfo, setOrdersInfo] = useState({});
    const [loading, setLoading] = useState(false);
    const [trigger, setTrigger] = useState(0); // ✅ Force rerender when updated
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const socket = useSocket(true);

    const paginateRef = paginate(ordersInfo?.hasNextPage, loading, setPage);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        async function getOrders() {
            try {
                setLoading(true);
                const res = await orderService.getCanteenOrders(
                    'Pending',
                    page,
                    LIMIT,
                    signal
                );

                if (res && Array.isArray(res.orders)) {
                    setOrders(res.orders);
                    setOrdersInfo(res.ordersInfo);
                } else {
                    setOrders([]); // ✅ Ensure it's an array
                }
            } catch (err) {
                navigate('/server-error');
            } finally {
                setLoading(false);
            }
        }

        getOrders();
        console.log(orders);
        return () => controller.abort();
    }, [page, navigate]);

    // ✅ Update the UI every time a new order is received
    useEffect(() => {
        if (!socket) {
            console.log('no socket');
            return;
        }

        function handleNewOrder(order) {
            console.log('🔔 New order received:', order);
            console.log(order._id);
            toast.success(`New order by: ${order.studentInfo.fullName}`);
            // if (!order || !order._id) return;
            // ✅ Correctly append the new order to the array
            setOrders((prevOrders) => [order, ...prevOrders]);

            console.log(orders);
            // setTrigger((prev) => prev + 1); // ✅ Force re-render
        }

        socket.on('newOrder', handleNewOrder);

        return () => {
            socket.off('newOrder', handleNewOrder);
        };
    }, [socket]);

    return loading ? (
        <div>Loading...</div>
    ) : orders.length > 0 ? (
        <motion.div
            key={trigger} // ✅ Ensures UI updates
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
            {orders.map((order, i) => (
                <motion.div
                    key={order._id || i} // ✅ Safe fallback key
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <ContractorOrderCard
                        order={order}
                        reference={
                            i + 1 === orders.length && ordersInfo?.hasNextPage
                                ? paginateRef
                                : null
                        }
                        socket={socket}
                        onStatusChange={(id) => {
                            setOrders((prev) =>
                                prev.filter((o) => o._id !== id)
                            );
                        }}
                    />
                </motion.div>
            ))}
        </motion.div>
    ) : (
        <div>No orders found</div>
    );
}

import { useState, useEffect } from 'react';
import { useUserContext } from '../Contexts';
import { orderService } from '../Services';
import { motion } from 'framer-motion';

const BillsPage = () => {
    const [bills, setBills] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useUserContext();

    const defaultDate = new Date();
    const [selectedDate, setSelectedDate] = useState({
        year: defaultDate.getFullYear(),
        month: defaultDate.getMonth() + 1,
    });

    const [monthInput, setMonthInput] = useState(
        `${defaultDate.getFullYear()}-${String(defaultDate.getMonth() + 1).padStart(2, '0')}`
    );

    useEffect(() => {
        if (user?.canteenId) {
            fetchBills();
        }
    }, [selectedDate, user]);

    const handleMonthChange = (e) => {
        const [year, month] = e.target.value.split('-');
        setMonthInput(e.target.value);
        setSelectedDate({ year: parseInt(year), month: parseInt(month) });
    };

    const fetchBills = async () => {
        if (!user?.canteenId) {
            console.error('Error: User or canteenId is undefined');
            setLoading(false);
            return;
        }

        const { year, month } = selectedDate;
        try {
            setLoading(true);
            const response = await orderService.getCanteenMonthlyBill(
                user.canteenId,
                year,
                month
            );

            const totalOrders = response.length;
            const totalRevenue = response.reduce(
                (sum, order) => sum + order.amount,
                0
            );

            setBills({ orders: response, totalOrders, totalRevenue });
        } catch (error) {
            console.error('Error fetching bills:', error);
            setBills(null);
        } finally {
            setLoading(false);
        }
    };

    const formatOrderItems = (items) => {
        if (!items || items.length === 0) return 'No items';
        return (
            <ul className="list-disc pl-5">
                {items.map((item, index) => (
                    <motion.li
                        key={index}
                        className="mb-1"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                        {item.name || 'Unknown Item'} x {item.quantity}
                    </motion.li>
                ))}
            </ul>
        );
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
                📊 Canteen Monthly Revenue
            </h1>

            <div className="flex items-center gap-4 mb-6">
                <label className="text-lg font-medium text-gray-700">
                    Select Month:
                </label>
                <input
                    type="month"
                    value={monthInput}
                    onChange={handleMonthChange}
                    className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 transition duration-200"
                />
            </div>

            {loading ? (
                <p className="text-gray-600">Loading...</p>
            ) : bills ? (
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <div className="mb-6">
                        <p className="text-xl font-semibold text-gray-800">
                            ✅ Total Picked Up Orders:{' '}
                            <span className="text-blue-600">
                                {bills.totalOrders}
                            </span>
                        </p>
                        <p className="text-xl font-semibold text-gray-800">
                            💰 Total Revenue:{' '}
                            <span className="text-green-600">
                                ₹{bills.totalRevenue}
                            </span>
                        </p>
                    </div>

                    {bills.orders.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-blue-100 text-blue-800 text-left">
                                        <th className="border p-3">📅 Date</th>
                                        <th className="border p-3">
                                            👤 Student
                                        </th>
                                        <th className="border p-3">
                                            🆔 Roll No.
                                        </th>
                                        <th className="border p-3">🍽️ Items</th>
                                        <th className="border p-3 text-right">
                                            💵 Amount
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bills.orders.map((order, index) => (
                                        <motion.tr
                                            key={order._id}
                                            className={`border transition duration-200 ${
                                                index % 2 === 0
                                                    ? 'bg-gray-50'
                                                    : 'bg-white'
                                            } hover:bg-blue-50`}
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                duration: 0.3,
                                                delay: index * 0.1,
                                            }}
                                        >
                                            <td className="border p-3">
                                                {new Date(
                                                    order.createdAt
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="border p-3 font-medium">
                                                {order.studentName || 'N/A'}
                                            </td>
                                            <td className="border p-3 text-gray-700">
                                                {order.studentRollNumber ||
                                                    'N/A'}
                                            </td>
                                            <td className="border p-3">
                                                {formatOrderItems(order.items)}
                                            </td>
                                            <td className="border p-3 text-right font-semibold text-green-600">
                                                ₹{order.amount}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="mt-4 text-gray-500">
                            No orders found for this month.
                        </p>
                    )}
                </div>
            ) : (
                <p className="text-gray-600">
                    No data available for this month.
                </p>
            )}
        </div>
    );
};

export default BillsPage;

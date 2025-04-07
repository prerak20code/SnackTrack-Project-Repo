import { useState, useEffect } from 'react';
import { useUserContext } from '../Contexts';
import { orderService } from '../Services';
import { format } from 'date-fns';
import { motion } from 'framer-motion'; // ✅ Import Framer Motion

const BillsPage = () => {
    const [bills, setBills] = useState([]);
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
    const [loading, setLoading] = useState(true);
    const [totalAmount, setTotalAmount] = useState(0);
    const { user } = useUserContext();
    const [countdown, setCountdown] = useState(2); // ✅ Timer for loading

    useEffect(() => {
        if (user) fetchBills();
    }, [month, user]);

    useEffect(() => {
        if (loading) {
            let interval = setInterval(() => {
                setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [loading]);

    const fetchBills = async () => {
        setLoading(true);
        setCountdown(5); // Reset timer

        try {
            const [year, monthNum] = month.split('-');
            const data = await orderService.getStudentMonthlyBill(
                user._id,
                year,
                monthNum
            );

            if (data && !data.message) {
                const pickedUpOrders = data.orders.filter(
                    (order) => order.status === 'PickedUp'
                );
                setBills(pickedUpOrders);
                setTotalAmount(
                    pickedUpOrders.reduce((sum, order) => sum + order.amount, 0)
                );
            } else {
                setBills([]);
                setTotalAmount(0);
            }
        } catch (error) {
            console.error('Error fetching bills:', error);
        }
        setLoading(false);
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-orange-600 text-center mb-6">
                Monthly Bills
            </h1>

            {/* Month Selector */}
            <div className="flex justify-center mb-6">
                <input
                    type="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="border-2 border-orange-500 px-4 py-2 rounded-lg text-lg focus:ring-2 focus:ring-orange-500 focus:outline-none shadow-sm"
                />
            </div>

            {loading ? (
                <div className="text-center text-orange-500 text-lg py-6">
                    <motion.div
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1.2 }}
                        className="text-2xl font-bold"
                    >
                        Loading... ⏳ {countdown}
                    </motion.div>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <motion.table
                        className="min-w-full border-4 border-orange-500 shadow-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }} // ✅ Slower fade-in effect
                    >
                        <thead>
                            <tr className="bg-orange-500 text-white text-lg font-semibold">
                                <th className="border-2 border-orange-700 px-6 py-3">
                                    Date
                                </th>
                                <th className="border-2 border-orange-700 px-6 py-3">
                                    🍽️ Items (Name × Quantity)
                                </th>
                                <th className="border-2 border-orange-700 px-6 py-3">
                                    Total Amount
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {bills.length ? (
                                bills.map((bill, billIndex) => (
                                    <motion.tr
                                        key={bill._id}
                                        className="border-2 border-orange-500 text-gray-800 text-lg"
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.7,
                                            delay: billIndex * 0.2,
                                        }} // ✅ Slower motion
                                    >
                                        <td className="border-2 border-orange-500 px-6 py-3 text-center font-medium">
                                            {format(
                                                new Date(bill.createdAt),
                                                'dd-MM-yyyy'
                                            )}
                                        </td>
                                        <td className="border-2 border-orange-500 px-6 py-3 text-center">
                                            {bill.items.map((item, index) => (
                                                <motion.div
                                                    key={index}
                                                    className="text-lg font-semibold"
                                                    initial={{
                                                        opacity: 0,
                                                        x: -20,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        x: 0,
                                                    }}
                                                    transition={{
                                                        duration: 0.7,
                                                        delay: index * 0.1,
                                                    }} // ✅ Slower item animation
                                                >
                                                    {item?.itemId?.name ||
                                                        'Unknown'}{' '}
                                                    × {item.quantity}
                                                </motion.div>
                                            ))}
                                        </td>
                                        <td className="border-2 border-orange-500 px-6 py-3 text-center font-bold">
                                            ₹{bill.amount.toFixed(2)}
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="text-center text-gray-600 p-6 text-lg"
                                    >
                                        No bills found for this month.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </motion.table>
                </div>
            )}

            {/* Total Amount Display */}
            <motion.div
                className="mt-6 p-4 bg-orange-500 text-white text-xl font-semibold text-center rounded-lg shadow-md"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                Total Amount for {format(new Date(month), 'MMMM yyyy')}: ₹
                {totalAmount.toFixed(2)}
            </motion.div>
        </div>
    );
};

export default BillsPage;

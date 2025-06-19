import { useState, useEffect } from 'react';
import { useUserContext } from '../Contexts';
import { orderService } from '../Services';
import { format } from 'date-fns';
import { useDarkMode } from '../Contexts/DarkMode';

const BillsPage = () => {
    const [bills, setBills] = useState([]);
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
    const [loading, setLoading] = useState(true);
    const [totalAmount, setTotalAmount] = useState(0);
    const { user } = useUserContext();
    const [countdown, setCountdown] = useState(5);
    const { isDarkMode } = useDarkMode();

    useEffect(() => {
        if (user) fetchBills();
        // eslint-disable-next-line
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
        setCountdown(5);

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
        <div
            className={`max-w-5xl mx-auto p-6 ${
                isDarkMode ? 'bg-gray-900' : 'bg-white'
            }`}
        >
            <h1
                className={`text-3xl font-bold text-center mb-6 ${
                    isDarkMode ? 'text-[#4977ec]' : 'text-orange-600'
                }`}
            >
                Monthly Bills
            </h1>

            {/* Month Selector */}
            <div className="flex justify-center mb-6">
                <input
                    type="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className={`px-4 py-2 rounded-lg border-2 ${
                        isDarkMode
                            ? 'bg-gray-800 border-gray-700 text-white'
                            : 'border-orange-500 text-gray-900'
                    } focus:ring-2 focus:ring-[#4977ec] focus:outline-none shadow-sm`}
                />
            </div>

            {loading ? (
                <div
                    className={`text-center text-lg py-6 ${
                        isDarkMode ? 'text-[#4977ec]' : 'text-orange-500'
                    }`}
                >
                    <div className="text-2xl font-bold">
                        Loading... ⏳ {countdown}
                    </div>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table
                        className={`min-w-full border-4 shadow-lg ${
                            isDarkMode
                                ? 'border-gray-700 text-white'
                                : 'border-orange-500 text-gray-800'
                        }`}
                    >
                        <thead>
                            <tr
                                className={
                                    isDarkMode ? 'bg-gray-800' : 'bg-orange-500'
                                }
                            >
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
                                bills.map((bill) => (
                                    <tr
                                        key={bill._id}
                                        className={`border-2 text-lg ${
                                            isDarkMode
                                                ? 'border-gray-700 text-gray-300'
                                                : 'border-orange-500 text-gray-800'
                                        }`}
                                    >
                                        <td className="border-2 border-orange-500 px-6 py-3 text-center font-medium">
                                            {format(
                                                new Date(bill.createdAt),
                                                'dd-MM-yyyy'
                                            )}
                                        </td>
                                        <td className="border-2 border-orange-500 px-6 py-3 text-center">
                                            {bill.items.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="text-lg font-semibold"
                                                >
                                                    {item?.itemName ||
                                                        'Unknown'}{' '}
                                                    × {item.quantity}
                                                </div>
                                            ))}
                                        </td>
                                        <td className="border-2 border-orange-500 px-6 py-3 text-center font-bold">
                                            ₹{bill.amount.toFixed(2)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className={`text-center p-6 text-lg ${
                                            isDarkMode
                                                ? 'text-gray-400'
                                                : 'text-gray-600'
                                        }`}
                                    >
                                        No bills found for this month.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Total Amount Display */}
            <div
                className={`mt-6 p-4 text-xl font-semibold text-center rounded-lg shadow-md ${
                    isDarkMode
                        ? 'bg-gray-800 text-white'
                        : 'bg-orange-500 text-white'
                }`}
            >
                Total Amount for {format(new Date(month), 'MMMM yyyy')}: ₹
                {totalAmount.toFixed(2)}
            </div>
        </div>
    );
};

export default BillsPage;

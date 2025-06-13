import { useState } from 'react';
import { motion } from 'framer-motion';
import { icons } from '../../Assets/icons';
import { useDarkMode } from '../../Contexts/DarkMode';

export default function StudentOrderCard({ order, reference }) {
    const [expanded, setExpanded] = useState(false);
    const { amount, _id, createdAt, status, items } = order;
    const { isDarkMode } = useDarkMode();

    return (
        <motion.div
            ref={reference}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`rounded-xl shadow-sm border overflow-hidden transition-all hover:shadow-md ${
                isDarkMode
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-100'
            }`}
        >
            <div
                className="p-4 cursor-pointer"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex flex-col items-center gap-1">
                        <h2
                            className={`text-sm font-medium mb-1 ${
                                isDarkMode ? 'text-gray-200' : 'text-gray-800'
                            }`}
                        >
                            ORDER #{_id.slice(-8).toUpperCase()}
                        </h2>
                        <p
                            className={`text-xs ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}
                        >
                            {new Date(createdAt).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <span
                            className={`px-2 pt-[2px] pb-[3px] text-xs font-bold rounded-full ${
                                status === 'Pending'
                                    ? isDarkMode
                                        ? 'bg-yellow-900/50 text-yellow-200'
                                        : 'bg-yellow-50 text-yellow-700'
                                    : status === 'Rejected'
                                      ? isDarkMode
                                          ? 'bg-red-900/50 text-red-200'
                                          : 'bg-red-50 text-red-700'
                                      : isDarkMode
                                        ? 'bg-green-900/50 text-green-200'
                                        : 'bg-green-50 text-green-700'
                            }`}
                        >
                            {status}
                        </span>

                        <div className="flex items-center gap-3">
                            <span
                                className={`text-[17px] font-semibold ${
                                    isDarkMode
                                        ? 'text-gray-200'
                                        : 'text-gray-900'
                                }`}
                            >
                                ₹{amount.toFixed(2)}
                            </span>
                            <div className="flex items-center gap-4">
                                <div
                                    className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
                                >
                                    <div
                                        className={`size-[11px] ${
                                            isDarkMode
                                                ? 'fill-gray-400'
                                                : 'fill-gray-500'
                                        }`}
                                    >
                                        {icons.arrowDown}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {expanded && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className={`px-5 pb-5 border-t ${
                        isDarkMode ? 'border-gray-700' : 'border-gray-100'
                    }`}
                >
                    <div className="space-y-4 mt-4">
                        {items.map((item) => (
                            <div
                                key={item._id}
                                className="flex justify-between items-center"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`size-10 rounded-lg flex items-center justify-center ${
                                            isDarkMode
                                                ? 'bg-gray-700'
                                                : 'bg-gray-100'
                                        }`}
                                    >
                                        <div
                                            className={`size-5 ${
                                                isDarkMode
                                                    ? 'text-gray-400'
                                                    : 'text-gray-400'
                                            }`}
                                        >
                                            {item.itemType === 'Snack'
                                                ? icons.snack
                                                : icons.soda}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <h3
                                            className={`text-sm font-medium capitalize ${
                                                isDarkMode
                                                    ? 'text-gray-200'
                                                    : 'text-gray-800'
                                            }`}
                                        >
                                            {item.name || item.category}
                                        </h3>
                                        <p
                                            className={`text-xs ${
                                                isDarkMode
                                                    ? 'text-gray-400'
                                                    : 'text-gray-500'
                                            }`}
                                        >
                                            Qty: {item.quantity} • ₹
                                            {item.price.toFixed(2)} each
                                        </p>
                                    </div>
                                </div>
                                <span
                                    className={`text-sm font-semibold ${
                                        isDarkMode
                                            ? 'text-gray-200'
                                            : 'text-gray-900'
                                    }`}
                                >
                                    ₹{(item.price * item.quantity).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div
                        className={`mt-6 pt-4 border-t ${
                            isDarkMode ? 'border-gray-700' : 'border-gray-100'
                        }`}
                    >
                        <div
                            className={`flex justify-between text-sm ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}
                        >
                            <span>Subtotal</span>
                            <span>₹{amount.toFixed(2)}</span>
                        </div>
                        <div
                            className={`flex justify-between text-sm mt-1 ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}
                        >
                            <span>Packing</span>
                            <span>₹0.00</span>
                        </div>
                        <div
                            className={`flex justify-between font-medium mt-2 ${
                                isDarkMode ? 'text-gray-200' : 'text-gray-900'
                            }`}
                        >
                            <span>Total</span>
                            <span>₹{amount.toFixed(2)}</span>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { icons } from '../../Assets/icons';

export default function OrderCard({ order }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
        >
            <div
                className="p-4 cursor-pointer"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex flex-col items-center gap-1">
                        <h2 className="text-sm font-medium text-gray-800 mb-1">
                            ORDER #{order._id.slice(-8).toUpperCase()}
                        </h2>
                        <p className="text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString(
                                'en-US',
                                {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                }
                            )}
                        </p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-4">
                            <span
                                className={`px-3 py-[3px] text-xs font-bold rounded-full ${
                                    order.status === 'Pending'
                                        ? 'bg-yellow-50 text-yellow-700'
                                        : order.status === 'Cancelled'
                                          ? 'bg-red-50 text-red-700'
                                          : 'bg-green-50 text-green-700'
                                }`}
                            >
                                {order.status}
                            </span>
                            <div
                                className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
                            >
                                <div className="size-3 text-gray-400">
                                    {icons.arrowDown}
                                </div>
                            </div>
                        </div>

                        <span className="text-lg font-semibold text-gray-900">
                            ₹{order.amount.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>

            {expanded && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="px-5 pb-5 border-t border-gray-100"
                >
                    <div className="space-y-4 mt-4">
                        {order.items.map((item) => (
                            <div
                                key={item._id}
                                className="flex justify-between items-center"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="size-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <div className="size-5 text-gray-400">
                                            {item.itemType === 'Snack'
                                                ? icons.snack
                                                : icons.soda}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-medium text-gray-800 capitalize">
                                            {item.name || item.itemType}
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            Qty: {item.quantity} • ₹
                                            {item.price.toFixed(2)} each
                                        </p>
                                    </div>
                                </div>
                                <span className="text-sm font-semibold text-gray-900">
                                    ₹{(item.price * item.quantity).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Subtotal</span>
                            <span>₹{order.amount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mt-1">
                            <span>Packing</span>
                            {/* <span>₹{packingCharges.toFixed(2)}</span> */}
                            <span>₹0.00</span>
                        </div>
                        <div className="flex justify-between font-medium text-gray-900 mt-2">
                            <span>Total</span>
                            <span>₹{order.amount.toFixed(2)}</span>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}

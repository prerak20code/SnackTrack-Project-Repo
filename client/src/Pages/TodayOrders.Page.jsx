import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDarkMode } from '../Contexts/DarkMode';
import { io } from 'socket.io-client';
import {
    CompletedOrders,
    PendingOrders,
    Filter,
    RejectedOrders,
    PreparedOrders,
} from '../Components';
import { useSocket } from '../customhooks/socket';
export default function TodayOrdersPage() {
    const [searchParams] = useSearchParams();
    const filter = searchParams.get('filter') || 'Pending'; // Default to 'Pending'
    const [pendingOrders, setPendingOrders] = useState([]);
    const { isDarkMode } = useDarkMode();

    // Fetch existing pending orders from backend on mount
    const socket = useSocket(true);
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`/api/orders?status=Pending`); // Adjust API URL as needed
                const data = await response.json();
                if (response.ok) {
                    console.log('✅ Existing orders fetched:', data.orders);
                    setPendingOrders(data.orders);
                } else {
                    console.error('⚠️ Failed to fetch orders:', data.message);
                }
            } catch (error) {
                console.error('❌ Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);
    const options = [
        { value: 'Pending', label: 'Pending' },
        { value: 'PickedUp', label: 'Completed' },
        { value: 'Rejected', label: 'Rejected' },
        { value: 'Prepared', label: 'Prepared' },
    ];

    return (
        <div
            className={`w-full p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}
        >
            <div className="flex items-center justify-between mb-8">
                <h1
                    className={`text-3xl font-bold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}
                >
                    Today's Orders
                </h1>
                <Filter
                    options={options}
                    defaultOption={filter}
                    isDarkMode={isDarkMode}
                />
            </div>

            {/* Render Based on Filter */}
            <div>
                {filter === 'Pending' ? (
                    <PendingOrders orders={pendingOrders} socket={socket} />
                ) : filter === 'Rejected' ? (
                    <RejectedOrders socket={socket} />
                ) : filter === 'Prepared' ? (
                    <PreparedOrders socket={socket} />
                ) : (
                    <CompletedOrders socket={socket} />
                )}
            </div>
        </div>
    );
}

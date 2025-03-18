import { useSearchParams } from 'react-router-dom';
import { CompletedOrders, PendingOrders, Filter } from '../Components';

export default function TodayOrdersPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const filter = searchParams.get('filter') || 'pending'; // Default to 'pending'

    const options = [
        { value: 'pending', label: 'Pending' },
        { value: 'completed', label: 'Completed' },
    ];

    return (
        <div>
            <div className="w-full flex justify-between mb-6 items-center">
                <p className="text-2xl font-semibold">Today's Orders</p>
                <Filter
                    options={options}
                    defaultOption={filter}
                    className="w-48"
                />
            </div>

            {/* Render Based on Filter */}
            <div className="px-8 pb-8">
                {filter === 'pending' ? <PendingOrders /> : <CompletedOrders />}
            </div>
        </div>
    );
}

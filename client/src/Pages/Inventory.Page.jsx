import { useSearchParams } from 'react-router-dom';
import { icons } from '../Assets/icons';
import { EditSnacks, EditPackagedItems, Filter } from '../Components';

export default function InventoryPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const filter = searchParams.get('filter') || 'snacks'; // Default to 'snacks'

    const options = [
        { value: 'snacks', label: 'Snacks', icon: icons.snack },
        { value: 'packaged', label: 'Packaged', icon: icons.soda },
    ];

    return (
        <div>
            <div className="w-full flex justify-end">
                <Filter
                    options={options}
                    defaultOption={filter}
                    className="mb-6 w-48"
                />
            </div>
            {/* Render Based on Filter */}
            <div className="px-8 pb-8">
                {filter === 'snacks' ? <EditSnacks /> : <EditPackagedItems />}
            </div>
        </div>
    );
}

import { useSearchParams } from 'react-router-dom';
import { Snacks, PackagedItems, Filter } from '../Components';
import { icons } from '../Assets/icons';

export default function HomePage() {
    const [searchParams] = useSearchParams();
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
            <div className="px-4 pb-8">
                {filter === 'snacks' ? <Snacks /> : <PackagedItems />}
            </div>
        </div>
    );
}

import { useNavigate, useSearchParams } from 'react-router-dom';
import { Snacks, PackagedItems, Filter } from '../Components';
import { icons } from '../Assets/icons';
import { useEffect } from 'react';
import { useSnackContext } from '../Contexts';
import { snackService } from '../Services';

export default function HomePage() {
    const [searchParams] = useSearchParams();
    const filter = searchParams.get('filter') || 'snacks'; // Default to 'snacks'
    const { setSnacks, setItems, setLoading } = useSnackContext();
    const navigate = useNavigate();

    const options = [
        { value: 'snacks', label: 'Snacks', icon: icons.snack },
        { value: 'packaged', label: 'Packaged', icon: icons.soda },
    ];

    useEffect(() => {
        setLoading(true);

        const controller = new AbortController();
        const signal = controller.signal;

        (async function getSnacks() {
            try {
                const [snacks, items] = await Promise.all([
                    snackService.getSnacks(signal),
                    snackService.getPackagedFoodItems(signal),
                ]);
                if (snacks && !snacks.message) setSnacks(snacks);
                if (items && !items.message) setItems(items);
            } catch (err) {
                navigate('/server-error');
            } finally {
                setLoading(false);
            }
        })();

        return () => controller.abort();
    }, []);

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
            <div className="sm:px-4 pb-8">
                {filter === 'snacks' ? <Snacks /> : <PackagedItems />}
            </div>
        </div>
    );
}

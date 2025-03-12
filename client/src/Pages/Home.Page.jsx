import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SnackView } from '../Components';
import { snackService } from '../Services';
import { paginate } from '../Utils';
import { icons } from '../Assets/icons';
import { LIMIT } from '../Constants/constants';
import { useSearchContext } from '../Contexts';

export default function HomePage() {
    const [snacks, setSnacks] = useState([]);
    const [snacksInfo, setSnacksInfo] = useState({});
    const [page, setPage] = useState(1);
    const { search } = useSearchContext();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // pagination
    const paginateRef = paginate(snacksInfo?.hasNextPage, loading, setPage);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        (async function getSnacks() {
            try {
                setLoading(true);
                const res = await snackService.getSnacks(signal, page, LIMIT);
                if (res && !res.message) {
                    setSnacks((prev) => [...prev, ...res.snacks]);
                    setSnacksInfo(res.snacksInfo);
                }
            } catch (err) {
                navigate('/server-error');
            } finally {
                setLoading(false);
            }
        })();

        return () => controller.abort();
    }, [page]);

    const snackElements = snacks
        ?.filter(
            (snack) =>
                !search ||
                snack.name.toLowerCase().includes(search.toLowerCase())
        )
        .map((snack, index) => (
            <SnackView
                key={snack._id}
                snack={snack}
                reference={
                    index + 1 === snacks.length && snacksInfo?.hasNextPage
                        ? paginateRef
                        : null
                }
            />
        ));

    return (
        <div>
            {snackElements.length > 0 && (
                <div className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-6">
                    {snackElements}
                </div>
            )}

            {loading ? (
                page === 1 ? (
                    <div className="w-full text-center">
                        loading first batch...
                        {/* pulses */}
                    </div>
                ) : (
                    <div className="flex items-center justify-center my-2 w-full">
                        <div className="size-7 fill-[#4977ec] dark:text-[#f7f7f7]">
                            {icons.loading}
                        </div>
                    </div>
                )
            ) : (
                snackElements.length === 0 && <div>No snacks found !!</div>
            )}
        </div>
    );
}

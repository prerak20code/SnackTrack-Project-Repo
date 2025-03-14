import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PackagedItemView } from '../../Components';
import { snackService } from '../../Services';
import { paginate } from '../../Utils';
import { icons } from '../../Assets/icons';
import { LIMIT } from '../../Constants/constants';
import { useContractorContext, useSearchContext } from '../../Contexts';

export default function PackagedItems() {
    const { items, setItems } = useContractorContext();
    const [itemsInfo, setItemsInfo] = useState({});
    const [page, setPage] = useState(1);
    const { search } = useSearchContext();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // pagination
    const paginateRef = paginate(itemsInfo?.hasNextPage, loading, setPage);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        (async function getSnacks() {
            try {
                setLoading(true);
                const res = await snackService.getPackagedFoodItems(
                    signal,
                    page,
                    LIMIT
                );
                if (res && !res.message) {
                    setItems((prev) => [...prev, ...res.items]);
                    setItemsInfo(res.itemsInfo);
                }
            } catch (err) {
                navigate('/server-error');
            } finally {
                setLoading(false);
            }
        })();

        return () => {
            controller.abort();
            setItems([]);
            setItemsInfo({});
        };
    }, [page]);

    const itemElements = items
        ?.filter(
            (item) =>
                !search ||
                item.category?.toLowerCase().includes(search.toLowerCase())
        )
        .map((item, index) => (
            <PackagedItemView
                key={item._id}
                item={item}
                reference={
                    index + 1 === items.length && itemsInfo?.hasNextPage
                        ? paginateRef
                        : null
                }
            />
        ));

    return (
        <div>
            {itemElements.length > 0 && (
                <div className="flex flex-col gap-5">{itemElements}</div>
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
                itemElements.length === 0 && <div>No Items Found !!</div>
            )}
        </div>
    );
}

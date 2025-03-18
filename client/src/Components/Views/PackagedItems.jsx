import { PackagedItemView, Button } from '../../Components';
import {
    useSnackContext,
    useSearchContext,
    usePopupContext,
    useUserContext,
} from '../../Contexts';
import { icons } from '../../Assets/icons';

export default function PackagedItems() {
    const { loading, items } = useSnackContext();
    const { search } = useSearchContext();
    const { setShowPopup, setPopupInfo } = usePopupContext();
    const { user } = useUserContext();

    const itemElements = items
        ?.filter(
            (item) =>
                !search ||
                item.category?.toLowerCase().includes(search.toLowerCase())
        )
        .map((item) => <PackagedItemView key={item._id} item={item} />);

    function addItem() {
        setShowPopup(true);
        setPopupInfo({ type: 'addItem' });
    }

    return (
        <div className="md:px-6">
            {loading ? (
                <div className="w-full text-center">loading...</div>
            ) : itemElements.length > 0 ? (
                <div className="relative">
                    {user.role === 'contractor' && (
                        <Button
                            onClick={addItem}
                            btnText={
                                <div className="flex items-center justify-center gap-2">
                                    <div className="size-[20px] fill-white">
                                        {icons.plus}
                                    </div>
                                    <span className="text-lg">Add Item</span>
                                </div>
                            }
                            title="Add Snack"
                            className="absolute z-[10] -top-16 text-white rounded-md w-fit text-nowrap px-3 h-[40px] bg-[#4977ec] hover:bg-[#3b62c2]"
                        />
                    )}
                    <div className={`flex flex-col w-full gap-6`}>
                        {itemElements}
                    </div>
                </div>
            ) : (
                <div>No Items Found !!</div>
            )}
        </div>
    );
}

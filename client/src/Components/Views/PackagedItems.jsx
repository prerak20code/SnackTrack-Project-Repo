import { PackagedItemView, Button } from '../../Components';
import {
    useSnackContext,
    useSearchContext,
    usePopupContext,
    useUserContext,
} from '../../Contexts';
import { icons } from '../../Assets/icons';
import { useDarkMode } from '../../Contexts/DarkMode';

export default function PackagedItems() {
    const { items } = useSnackContext();
    const { search } = useSearchContext();
    const { setShowPopup, setPopupInfo } = usePopupContext();
    const { user } = useUserContext();
    const { isDarkMode } = useDarkMode();

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

    return itemElements.length >= 0 ? (
        <div className="relative">
            {user.role === 'contractor' && (
                <Button
                    onClick={addItem}
                    btnText={
                        <div className="flex items-center justify-center gap-2">
                            <div className="size-[16px] fill-white">
                                {icons.plus}
                            </div>
                            <span className="text-[18px]">Add Item</span>
                        </div>
                    }
                    title="Add Snack"
                    className="absolute z-[1] -top-16 text-white rounded-md w-fit text-nowrap px-3 h-[39px] bg-[#4977ec] hover:bg-[#3b62c2]"
                />
            )}
            <div className={`flex flex-col w-full gap-6`}>{itemElements}</div>
        </div>
    ) : (
        <div
            className={`text-center py-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
        >
            No Items Found !!
        </div>
    );
}

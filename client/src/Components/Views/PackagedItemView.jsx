import toast from 'react-hot-toast';
import { Button } from '..';
import { icons } from '../../Assets/icons';
import { usePopupContext, useUserContext } from '../../Contexts';
import { useDarkMode } from '../../Contexts/DarkMode';
import { useState } from 'react';

export default function PackagedItemView({ item, reference }) {
    const { _id, category } = item;
    const [variants, setVariants] = useState(item.variants);
    const { user } = useUserContext();
    const { setShowPopup, setPopupInfo } = usePopupContext();
    const { isDarkMode } = useDarkMode();

    function editItem() {
        setShowPopup(true);
        setPopupInfo({ type: 'editItem', target: item });
    }

    function removeItem() {
        setShowPopup(true);
        setPopupInfo({ type: 'removeItem', target: item });
    }

    function addToCart(price) {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        setVariants((prev) =>
            prev.map((v) => (v.price === price ? { ...v, quantity: 1 } : v))
        );
        const newCartItem = {
            _id,
            category,
            type: 'PackagedFood',
            price,
            quantity: 1,
        };
        localStorage.setItem(
            'cartItems',
            JSON.stringify(cartItems.concat(newCartItem))
        );
    }

    function updateQuantity(price, newQuantity, availableCount) {
        if (newQuantity > availableCount) {
            toast.error('max quantity reached');
            return;
        }
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const updatedCartItems = cartItems.map((i) =>
            i._id === _id && i.price === price
                ? { ...i, quantity: newQuantity }
                : i
        );
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
        setVariants((prev) =>
            prev.map((v) =>
                v.price === price ? { ...v, quantity: newQuantity } : v
            )
        );
    }

    function removeFromCart(price) {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        const updatedCartItems = cartItems.filter((item) => {
            item._id !== _id && item.price !== price;
        });

        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
        setVariants((prev) =>
            prev.map((v) => (v.price === price ? { ...v, quantity: 0 } : v))
        );
    }

    return (
        <div
            ref={reference}
            className={`p-6 relative shadow-lg rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}
        >
            {user.role === 'contractor' && (
                <div className="absolute right-6 top-4 flex gap-3 justify-end">
                    <Button
                        btnText={
                            <div
                                className={`size-[18px] ${
                                    isDarkMode
                                        ? 'fill-white group-hover:fill-[#4977ec]'
                                        : 'group-hover:fill-[#4977ec]'
                                }`}
                            >
                                {icons.edit}
                            </div>
                        }
                        className={`p-[10px] group rounded-full drop-shadow-sm ${
                            isDarkMode
                                ? 'bg-gray-700 hover:bg-gray-600'
                                : 'bg-[#f0efef] hover:bg-[#ebeaea]'
                        }`}
                        onClick={editItem}
                    />
                    <div>
                        <Button
                            btnText={
                                <div
                                    className={`size-[18px] ${
                                        isDarkMode
                                            ? 'fill-white group-hover:fill-red-500'
                                            : 'group-hover:fill-red-700'
                                    }`}
                                >
                                    {icons.delete}
                                </div>
                            }
                            className={`p-[10px] group rounded-full drop-shadow-lg ${
                                isDarkMode
                                    ? 'bg-gray-700 hover:bg-gray-600'
                                    : 'bg-[#f0efef] hover:bg-[#ebeaea]'
                            }`}
                            onClick={removeItem}
                        />
                    </div>
                </div>
            )}

            <p
                className={`text-xl mb-4 flex items-center gap-2 font-bold truncate ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
                }`}
            >
                {category}{' '}
                <span
                    className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                >
                    (1pc)
                </span>
            </p>

            <div className="overflow-x-auto pb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 min-w-[max-content]">
                    {variants?.map(
                        ({ price, _id, availableCount, quantity }) => (
                            <div
                                key={_id}
                                className={`flex flex-row items-center justify-between gap-4 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 min-w-[200px] ${
                                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                                }`}
                            >
                                <div className="flex flex-col gap-1">
                                    <div
                                        className={`flex items-center gap-2 font-bold ${
                                            isDarkMode
                                                ? 'text-white'
                                                : 'text-gray-800'
                                        }`}
                                    >
                                        <div
                                            className={`size-2 rounded-full ${
                                                isDarkMode
                                                    ? 'bg-white'
                                                    : 'bg-gray-800'
                                            }`}
                                        ></div>
                                        <p>Rs. {price}</p>
                                    </div>

                                    <p
                                        className={`text-sm font-semibold ${
                                            availableCount > 0
                                                ? 'text-green-500'
                                                : 'text-red-500'
                                        }`}
                                    >
                                        {availableCount > 0
                                            ? `Available: ${availableCount} pcs`
                                            : 'Out of Stock'}
                                    </p>
                                </div>

                                {user.role === 'student' &&
                                    availableCount > 0 &&
                                    (quantity > 0 ? (
                                        <div
                                            className={`flex items-center border rounded-lg overflow-hidden ${
                                                isDarkMode
                                                    ? 'border-gray-600'
                                                    : 'border-gray-300'
                                            }`}
                                        >
                                            <Button
                                                className={`px-3 py-1 ${
                                                    isDarkMode
                                                        ? 'text-gray-300 hover:bg-gray-600'
                                                        : 'text-gray-500 hover:bg-gray-100'
                                                }`}
                                                onClick={() =>
                                                    quantity === 1
                                                        ? removeFromCart(price)
                                                        : updateQuantity(
                                                              price,
                                                              quantity - 1,
                                                              availableCount
                                                          )
                                                }
                                                btnText="-"
                                            />
                                            <span
                                                className={`px-3 py-1 ${
                                                    isDarkMode
                                                        ? 'text-white'
                                                        : 'text-gray-900'
                                                }`}
                                            >
                                                {quantity}
                                            </span>
                                            <Button
                                                className={`px-3 py-1 ${
                                                    isDarkMode
                                                        ? 'text-gray-300 hover:bg-gray-600'
                                                        : 'text-gray-500 hover:bg-gray-100'
                                                }`}
                                                onClick={() =>
                                                    updateQuantity(
                                                        price,
                                                        quantity + 1,
                                                        availableCount
                                                    )
                                                }
                                                btnText="+"
                                            />
                                        </div>
                                    ) : (
                                        <Button
                                            btnText={
                                                <div className="flex items-center justify-center p-2">
                                                    <div className="size-4 fill-white">
                                                        {icons.plus}
                                                    </div>
                                                </div>
                                            }
                                            onClick={() => addToCart(price)}
                                            className="flex items-center justify-center bg-[#4977ec] hover:bg-[#3b62c2] shadow-md rounded-full transition-colors duration-300"
                                        />
                                    ))}
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

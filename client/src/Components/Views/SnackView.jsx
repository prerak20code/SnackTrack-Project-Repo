import { useNavigate } from 'react-router-dom';
import { Button } from '..';
import { icons } from '../../Assets/icons';
import {
    usePopupContext,
    useSnackContext,
    useUserContext,
} from '../../Contexts';
import { contractorService } from '../../Services';
import { useState } from 'react';
import { useDarkMode } from '../../Contexts/DarkMode';

export default function SnackView({ snack, reference }) {
    const { _id, image, name, price, info, isAvailable } = snack;
    const [quantityInCart, setQuantityInCart] = useState(snack.quantity);
    const { user } = useUserContext();
    const { setSnacks } = useSnackContext();
    const navigate = useNavigate();
    const { setShowPopup, setPopupInfo } = usePopupContext();
    const { isDarkMode } = useDarkMode();

    async function toggleAvailability() {
        try {
            const res = await contractorService.toggleSnackAvailability(_id);
            if (
                res &&
                res.message === 'snack availability toggled successfully'
            ) {
                setSnacks((prev) =>
                    prev.map((snack) =>
                        snack._id === _id
                            ? { ...snack, isAvailable: !snack.isAvailable }
                            : snack
                    )
                );
            }
        } catch (err) {
            navigate('/server-error');
        }
    }

    function editSnack() {
        setShowPopup(true);
        setPopupInfo({ type: 'editSnack', target: snack });
    }

    function removeSnack() {
        setShowPopup(true);
        setPopupInfo({ type: 'removeSnack', target: snack });
    }

    function addToCart() {
        setQuantityInCart(1);
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const newCartItem = {
            _id,
            name,
            price,
            image,
            type: 'Snack',
            quantity: 1,
        };
        localStorage.setItem(
            'cartItems',
            JSON.stringify(cartItems.concat(newCartItem))
        );
    }

    function updateQuantity(newQuantity) {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const updatedCartItems = cartItems.map((i) =>
            i._id === _id ? { ...i, quantity: newQuantity } : i
        );
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
        setQuantityInCart(newQuantity);
    }

    function removeFromCart() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const updatedCartItems = cartItems.filter((i) => i._id !== _id);
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
        setQuantityInCart(0);
    }

    return (
        <div
            ref={reference}
            className={`p-4 relative cursor-pointer shadow-lg rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            }`}
        >
            {user.role === 'contractor' && (
                <div className="absolute right-6 top-6 flex gap-3 justify-end">
                    <Button
                        btnText={
                            <div
                                className={`size-[18px] ${isDarkMode ? 'group-hover:fill-[#4977ec] fill-white' : 'group-hover:fill-[#4977ec]'}`}
                            >
                                {icons.edit}
                            </div>
                        }
                        className={`p-[10px] group rounded-full drop-shadow-sm ${
                            isDarkMode
                                ? 'bg-gray-700 hover:bg-gray-600'
                                : 'bg-[#f0efef] hover:bg-[#ebeaea]'
                        }`}
                        onClick={editSnack}
                    />
                    <div>
                        <Button
                            btnText={
                                <div
                                    className={`size-[18px] ${isDarkMode ? 'group-hover:fill-red-500 fill-white' : 'group-hover:fill-red-700'}`}
                                >
                                    {icons.delete}
                                </div>
                            }
                            className={`p-[10px] group rounded-full drop-shadow-lg ${
                                isDarkMode
                                    ? 'bg-gray-700 hover:bg-gray-600'
                                    : 'bg-[#f0efef] hover:bg-[#ebeaea]'
                            }`}
                            onClick={removeSnack}
                        />
                    </div>
                </div>
            )}

            {/* Image */}
            <div className="h-[180px] w-full rounded-xl overflow-hidden shadow-md">
                <img
                    alt="snack image"
                    src={image}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-3 w-full mt-4">
                {/* Availability and Price */}
                <div className="flex items-center justify-between">
                    {/* Availability */}
                    <div
                        className={`flex items-center gap-2 shadow-sm rounded-full px-3 py-1 ${
                            isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                        }`}
                    >
                        <div
                            className={`size-2 rounded-full ${isAvailable ? 'bg-green-600' : 'bg-red-500'}`}
                        />
                        <span
                            className={`text-sm font-semibold ${isAvailable ? 'text-green-500' : 'text-red-500'}`}
                        >
                            {isAvailable ? 'Available' : 'Not Available'}
                        </span>
                    </div>

                    {/* Price */}
                    <p
                        className={`text-sm font-bold shadow-sm rounded-full px-3 py-1 ${
                            isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                        }`}
                    >
                        Rs. {price}
                    </p>
                </div>

                {/* Name and Info */}
                <div className="flex flex-col gap-2">
                    {/* Name */}
                    <p
                        className={`text-xl font-bold truncate ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}
                    >
                        {name}
                    </p>

                    {/* Info */}
                    {info && (
                        <p
                            className={`text-sm line-clamp-2 ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}
                        >
                            {info}
                        </p>
                    )}
                </div>

                {/* Add to Cart Button or Toggle Switch */}
                <div className="w-full flex items-center justify-end mt-2">
                    {user.role !== 'contractor' ? (
                        isAvailable &&
                        (quantityInCart > 0 ? (
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
                                            ? 'text-gray-300 hover:bg-gray-700'
                                            : 'text-gray-500 hover:bg-gray-100'
                                    }`}
                                    onClick={() =>
                                        quantityInCart === 1
                                            ? removeFromCart()
                                            : updateQuantity(quantityInCart - 1)
                                    }
                                    btnText="-"
                                />
                                <span
                                    className={
                                        isDarkMode
                                            ? 'text-white px-3 py-1'
                                            : 'text-gray-900 px-3 py-1'
                                    }
                                >
                                    {quantityInCart}
                                </span>
                                <Button
                                    className={`px-3 py-1 ${
                                        isDarkMode
                                            ? 'text-gray-300 hover:bg-gray-700'
                                            : 'text-gray-500 hover:bg-gray-100'
                                    }`}
                                    onClick={() =>
                                        updateQuantity(quantityInCart + 1)
                                    }
                                    btnText="+"
                                />
                            </div>
                        ) : (
                            <Button
                                btnText={
                                    <div className="flex items-center justify-center gap-2">
                                        <span>Add to Cart</span>
                                        <div className="size-4 fill-white">
                                            {icons.plus}
                                        </div>
                                    </div>
                                }
                                onClick={addToCart}
                                className="rounded-md px-3 py-[5px] text-white bg-[#4977ec] hover:bg-[#3b62c2] shadow-md transition-colors duration-300"
                            />
                        ))
                    ) : (
                        <div className="flex items-center justify-center">
                            <label
                                htmlFor={_id}
                                className="relative inline-flex items-center cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={isAvailable}
                                    id={_id}
                                    onChange={toggleAvailability}
                                />
                                <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#4977ec] transition-colors duration-200" />
                                <div className="absolute left-1 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 peer-checked:translate-x-5" />
                            </label>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

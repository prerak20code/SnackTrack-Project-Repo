import { useState } from 'react';
import { Button, EmptyCart } from '../Components';
import { useNavigate } from 'react-router-dom';
import { icons } from '../Assets/icons';
import { SNACK_PLACEHOLDER_IMAGE } from '../Constants/constants';
import { orderService } from '../Services';
import { usePopupContext } from '../Contexts';
import { useSocket } from '../customhooks/socket';
import SelectTablePopup from '../Components/Popups/SelectTablePopup';
import { useDarkMode } from '../Contexts/DarkMode';

export default function CartPage() {
    const [ordering, setOrdering] = useState(false);
    const [specialInstructions, setSpecialInstructions] = useState('');
    const navigate = useNavigate();
    const { setShowPopup, setPopupInfo } = usePopupContext();
    const socket = useSocket(false);
    const { isDarkMode } = useDarkMode();

    const [showTablePopup, setShowTablePopup] = useState(false);
    const [cartItems, setCartItems] = useState(
        JSON.parse(localStorage.getItem('cartItems')) || []
    );
    const containsSnack = cartItems.some((item) => item.type === 'Snack');
    const subtotal = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );
    const tax = subtotal * 0.05; // 5% tax
    const total = subtotal + tax;

    function updateQuantity(itemId, price, newQuantity) {
        console.log('containsSnack:', containsSnack);
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const updatedCartItems = cartItems.map((item) =>
            item._id === itemId && item.price === price
                ? { ...item, quantity: newQuantity }
                : item
        );
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
        setCartItems(updatedCartItems);
    }

    function removeFromCart(itemId, price, type) {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const updatedCartItems = cartItems.filter((item) => {
            if (type === 'Snack') {
                return item._id !== itemId;
            } else {
                return !(item._id === itemId && item.price === price);
            }
        });
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
        setCartItems(updatedCartItems);
    }

    async function placeOrder(tableNumber) {
        try {
            setOrdering(true);
            const cartItems =
                JSON.parse(localStorage.getItem('cartItems')) || [];
            const res = await orderService.placeOrder(
                cartItems,
                total,
                socket,
                tableNumber,
                specialInstructions
            );

            if (res && !res.message) {
                setShowPopup(true);
                setPopupInfo({
                    type: 'orderPlaced',
                    data: { itemsCount: cartItems.length },
                });
                localStorage.removeItem('cartItems');
                setCartItems([]);
                setSpecialInstructions('');
            }
        } catch (err) {
            navigate('/server-error');
        } finally {
            setOrdering(false);
        }
    }

    const cartItemElements = cartItems.map(
        ({ price, _id, name, category, type, image, quantity }) => (
            <div
                key={`${_id}-${price}`}
                className={`w-full flex flex-col sm:flex-row items-end sm:items-center justify-between border-b py-4 ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                }`}
            >
                <div className="w-full flex items-center gap-4 justify-between">
                    <div className="flex items-center gap-4">
                        <div
                            className={`size-[50px] overflow-hidden border rounded-lg flex items-center justify-center ${
                                isDarkMode
                                    ? 'border-gray-700'
                                    : 'border-gray-300'
                            }`}
                        >
                            <img
                                src={image || SNACK_PLACEHOLDER_IMAGE}
                                alt={`${name || category} image`}
                                className="object-cover size-full"
                            />
                        </div>
                        <div>
                            <h3
                                className={`text-lg font-medium ${
                                    isDarkMode
                                        ? 'text-gray-200'
                                        : 'text-gray-900'
                                }`}
                            >
                                {name || category}
                            </h3>
                            <p
                                className={`${
                                    isDarkMode
                                        ? 'text-gray-200'
                                        : 'text-gray-900'
                                }`}
                            >
                                ₹{price.toFixed(2)}
                            </p>
                        </div>
                    </div>

                    <div
                        className={`sm:hidden flex items-center border rounded-lg overflow-hidden ${
                            isDarkMode ? 'border-gray-700' : 'border-gray-300'
                        }`}
                    >
                        <Button
                            className={`px-3 py-1 ${
                                isDarkMode ? 'text-gray-200' : 'text-gray-900'
                            }`}
                            onClick={() =>
                                quantity === 1
                                    ? removeFromCart(_id, price, type)
                                    : updateQuantity(_id, price, quantity - 1)
                            }
                            btnText="-"
                        />
                        <span
                            className={
                                isDarkMode ? 'text-white' : 'text-gray-900'
                            }
                        >
                            {quantity}
                        </span>
                        <Button
                            className={`px-3 py-1 ${
                                isDarkMode
                                    ? 'text-gray-400 hover:bg-gray-700'
                                    : 'text-gray-500 hover:bg-gray-100'
                            }`}
                            onClick={() =>
                                updateQuantity(_id, price, quantity + 1)
                            }
                            btnText="+"
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-4 mt-3 sm:mt-0">
                    <div className="hidden sm:flex items-center border border-gray-300 rounded-lg overflow-hidden">
                        <Button
                            className="px-3 py-1 text-gray-500 hover:bg-gray-100"
                            onClick={() =>
                                quantity === 1
                                    ? removeFromCart(_id, price, type)
                                    : updateQuantity(_id, price, quantity - 1)
                            }
                            btnText="-"
                        />
                        <span
                            className={`px-3 py-1 ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}
                        >
                            {quantity}
                        </span>
                        <Button
                            className="px-3 py-1 text-gray-500 hover:bg-gray-100"
                            onClick={() =>
                                updateQuantity(_id, price, quantity + 1)
                            }
                            btnText="+"
                        />
                    </div>
                    <div className="flex items-center gap-1">
                        <p
                            className={
                                isDarkMode ? 'text-white' : 'text-gray-900'
                            }
                        >
                            ₹{(price * quantity).toFixed(2)}
                        </p>
                        <Button
                            btnText={
                                <div className="size-[18px] fill-red-600">
                                    {icons.delete}
                                </div>
                            }
                            className="hover:bg-gray-100 p-2 rounded-full"
                            onClick={() => removeFromCart(_id, price, type)}
                        />
                        {/* <Button
                            btnText={
                                <div className="size-[18px] fill-[#4977ec]">
                                    {icons.edit}
                                </div>
                            }
                            className="hover:bg-gray-100 p-2 rounded-full"
                            onClick={() => editItem(_id, price, type)}
                        /> */}
                    </div>
                </div>
            </div>
        )
    );

    return cartItems.length > 0 ? (
        <div
            className={`rounded-xl drop-shadow-sm w-full py-10 px-4 sm:px-6 lg:px-8 ${
                isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
            }`}
        >
            <h1
                className={`text-3xl font-bold mb-8 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                }`}
            >
                Your Cart
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items Section */}
                <div
                    className={`lg:col-span-2 rounded-lg shadow-md p-6 ${
                        isDarkMode ? 'bg-gray-800' : 'bg-white'
                    }`}
                >
                    <h2
                        className={`text-xl font-semibold mb-4 ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}
                    >
                        Cart Items
                    </h2>
                    {cartItemElements}

                    {/* Special Instructions Input */}
                    {containsSnack && (
                        <div className="mt-6">
                            <label
                                htmlFor="specialInstructions"
                                className={`block font-medium mb-1 ${
                                    isDarkMode
                                        ? 'text-gray-300'
                                        : 'text-gray-700'
                                }`}
                            >
                                Special Instructions (optional)
                            </label>
                            <textarea
                                id="specialInstructions"
                                value={specialInstructions}
                                onChange={(e) =>
                                    setSpecialInstructions(e.target.value)
                                }
                                rows={3}
                                placeholder="E.g., Make it extra spicy, no onions, etc."
                                className={`w-full p-2 rounded-md shadow-sm focus:ring-2 focus:ring-[#4977ec] focus:outline-none resize-none ${
                                    isDarkMode
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400'
                                        : 'bg-white border-gray-300 text-black placeholder:text-gray-500'
                                }`}
                            />
                        </div>
                    )}
                </div>

                {/* Order Summary Section */}
                <div
                    className={`rounded-lg shadow-md p-6 ${
                        isDarkMode ? 'bg-gray-800' : 'bg-white'
                    }`}
                >
                    <h2
                        className={`text-xl font-semibold mb-6 ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}
                    >
                        Order Summary
                    </h2>
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <p
                                className={
                                    isDarkMode
                                        ? 'text-gray-300'
                                        : 'text-gray-600'
                                }
                            >
                                Subtotal
                            </p>
                            <p
                                className={
                                    isDarkMode ? 'text-white' : 'text-gray-900'
                                }
                            >
                                ₹{subtotal.toFixed(2)}
                            </p>
                        </div>
                        <div className="flex justify-between">
                            <p
                                className={
                                    isDarkMode
                                        ? 'text-gray-300'
                                        : 'text-gray-600'
                                }
                            >
                                Tax (5%)
                            </p>
                            <p
                                className={
                                    isDarkMode ? 'text-white' : 'text-gray-900'
                                }
                            >
                                ₹{tax.toFixed(2)}
                            </p>
                        </div>
                        <div
                            className={`border-t pt-4 ${
                                isDarkMode
                                    ? 'border-gray-700'
                                    : 'border-gray-200'
                            }`}
                        >
                            <div className="flex justify-between">
                                <p
                                    className={`text-lg font-semibold ${
                                        isDarkMode
                                            ? 'text-white'
                                            : 'text-gray-900'
                                    }`}
                                >
                                    Total
                                </p>
                                <p
                                    className={`text-lg font-semibold ${
                                        isDarkMode
                                            ? 'text-white'
                                            : 'text-gray-900'
                                    }`}
                                >
                                    ₹{total.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                    <Button
                        onClick={() => setShowTablePopup(true)}
                        className="text-white rounded-md py-2 mt-4 h-[40px] flex items-center justify-center w-full bg-[#4977ec] hover:bg-[#3b62c2]"
                        btnText={
                            ordering ? (
                                <div className="size-5 fill-white">
                                    {icons.loading}
                                </div>
                            ) : (
                                'Choose Table'
                            )
                        }
                    />
                    <Button
                        className={`rounded-md py-2 mt-4 h-[40px] flex items-center justify-center w-full border-[0.01rem] border-transparent ${
                            isDarkMode
                                ? 'bg-gray-700 text-white hover:bg-gray-600 hover:border-gray-500'
                                : 'bg-gray-100 text-black hover:bg-gray-200 hover:border-black'
                        }`}
                        btnText="Continue Shopping"
                        onClick={() => navigate('/')}
                    />
                </div>
            </div>

            {showTablePopup && (
                <SelectTablePopup
                    onConfirm={(tableNumber) => {
                        setShowTablePopup(false);
                        if (tableNumber !== null) {
                            placeOrder(tableNumber);
                        }
                    }}
                    onCancel={() => {
                        setShowTablePopup(false);
                        navigate('/cart');
                    }}
                />
            )}
        </div>
    ) : (
        <EmptyCart />
    );
}

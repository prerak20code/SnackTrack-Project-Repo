import { useState, useEffect } from 'react';
import { Button, EmptyCart } from '../Components';
import { useNavigate } from 'react-router-dom';
import { icons } from '../Assets/icons';

export default function CartPage() {
    const [loading, setLoading] = useState(true);
    const [ordering, setOrdering] = useState(false);
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([
        // {
        //     id: 1,
        //     name: 'Veg Sandwich',
        //     price: 30,
        //     quantity: 1,
        //     type: 'snack',
        // },
        // {
        //     id: 2,
        //     name: 'Cold Coffee',
        //     price: 50,
        //     quantity: 1,
        //     type: 'packaged',
        //     variant: 'Medium',
        //     variants: [
        //         { name: 'Small', price: 40 },
        //         { name: 'Medium', price: 50 },
        //         { name: 'Large', price: 60 },
        //     ],
        // },
    ]);

    useEffect(() => {
        setCartItems(JSON.parse(localStorage.getItem('cartItems')) || []);
        setLoading(false);
    }, []);

    const subtotal = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );
    const tax = subtotal * 0.05; // 5% tax
    const total = subtotal + tax;

    function updateQuantity(itemId, newQuantity) {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            )
        );
    }

    function removeFromCart(itemId) {
        setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    }

    function placeOrder() {}

    const cartItemElements = cartItems.map((item) => (
        <div
            key={item.id}
            className="w-full flex flex-col sm:flex-row items-center justify-between border-b border-gray-200 py-4"
        >
            <div className="w-full flex items-center space-x-4">
                {/* image */}
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">Image</span>
                </div>

                {/* info */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900">
                        {item.name} {item.variant && `(${item.variant})`}
                    </h3>
                    <p className="text-sm text-gray-500">
                        ₹{item.price.toFixed(2)}
                    </p>
                </div>
            </div>

            {/* price & quantity */}
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                        className="px-3 py-1 text-gray-500 hover:bg-gray-100"
                        onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity === 1}
                    >
                        -
                    </button>
                    <span className="px-3 py-1 text-gray-900">
                        {item.quantity}
                    </span>
                    <button
                        className="px-3 py-1 text-gray-500 hover:bg-gray-100"
                        onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                        }
                    >
                        +
                    </button>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                    ₹{(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => removeFromCart(item.id)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                    </svg>
                </button>
            </div>
        </div>
    ));

    return (
        <div>
            {loading ? (
                <div>loading...</div>
            ) : cartItems.length > 0 ? (
                <div className="bg-gray-100 max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">
                        Your Cart
                    </h1>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Product List */}
                        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                Cart Items
                            </h2>
                            {cartItemElements}
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                Order Summary
                            </h2>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <p className="text-gray-600">Subtotal</p>
                                    <p className="text-gray-900">
                                        ₹{subtotal.toFixed(2)}
                                    </p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-gray-600">Tax (5%)</p>
                                    <p className="text-gray-900">
                                        ₹{tax.toFixed(2)}
                                    </p>
                                </div>
                                <div className="border-t border-gray-200 pt-4">
                                    <div className="flex justify-between">
                                        <p className="text-lg font-semibold text-gray-900">
                                            Total
                                        </p>
                                        <p className="text-lg font-semibold text-gray-900">
                                            ₹{total.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <Button
                                onClick={placeOrder}
                                className="text-white rounded-md py-2 mt-4 h-[40px] flex items-center justify-center w-full bg-[#4977ec] hover:bg-[#3b62c2]"
                                btnText={
                                    ordering ? (
                                        <div className="size-5 fill-[#4977ec] dark:text-[#a2bdff]">
                                            {icons.loading}
                                        </div>
                                    ) : (
                                        'Place Order'
                                    )
                                }
                            />
                            <Button
                                className="text-black rounded-md py-2 mt-4 h-[40px] flex items-center justify-center w-full bg-gray-100 border-[0.01rem] border-transparent hover:border-black hover:bg-gray-200"
                                btnText="Continue Shopping"
                                onClick={() => navigate('/')}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <EmptyCart />
            )}
        </div>
    );
}

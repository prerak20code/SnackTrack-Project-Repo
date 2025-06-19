import { Button, InputField1 } from '..';
import { usePopupContext, useSnackContext } from '../../Contexts';
import { icons } from '../../Assets/icons';
import { useNavigate } from 'react-router-dom';
import { contractorService } from '../../Services';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useDarkMode } from '../../Contexts/DarkMode';

export default function RemoveItemPopup() {
    const [loading, setLoading] = useState(false);
    const { setShowPopup, popupInfo } = usePopupContext();
    const { setItems } = useSnackContext();
    const navigate = useNavigate();
    const [check, setCheck] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { isDarkMode } = useDarkMode();

    async function removeItem(e) {
        e.preventDefault();
        if (!check || !password) {
            toast.error('Please confirm deletion and enter password');
            return;
        }
        try {
            setLoading(true);
            setDisabled(true);

            const response = await contractorService.removeItem(
                popupInfo.target._id,
                password
            );

            // Check for the correct success message
            if (response && response.message === 'item deleted successfully') {
                setItems((prev) =>
                    prev.filter((item) => item._id !== popupInfo.target._id)
                );
                toast.success('Item removed successfully 👍');
                setShowPopup(false);
            } else {
                toast.error(response?.message || 'Failed to remove item');
            }
        } catch (error) {
            console.error('Error removing item:', error);
            toast.error('Something went wrong');
            if (error.response?.status === 500) {
                navigate('/server-error');
            }
        } finally {
            setLoading(false);
            setDisabled(false);
        }
    }

    function onMouseOver() {
        if (!check || !password) setDisabled(true);
        else setDisabled(false);
    }

    return (
        <div
            className={`relative w-[350px] sm:w-[450px] transition-all duration-300 rounded-xl overflow-hidden p-5 flex flex-col items-center justify-center gap-4 ${
                isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'
            }`}
        >
            <Button
                btnText={
                    <div
                        className={`size-[20px] ${
                            isDarkMode ? 'stroke-white' : 'stroke-black'
                        }`}
                    >
                        {icons.cross}
                    </div>
                }
                title="Close"
                onClick={() => setShowPopup(false)}
                className="absolute top-2 right-2"
            />

            <form onSubmit={removeItem} className="flex flex-col gap-3 w-full">
                <p className="text-2xl font-bold text-center">Remove Item</p>
                <p className="text-[15px] text-center">
                    <span className="font-medium">Category: </span>
                    {popupInfo.target.category}
                </p>

                <div className="w-full relative -top-4">
                    <InputField1
                        field={{
                            type: showPassword ? 'text' : 'password',
                            name: 'password',
                            label: 'Password',
                            required: true,
                            placeholder: 'Enter password to confirm delete',
                        }}
                        inputs={{ password }}
                        setShowPassword={setShowPassword}
                        showPassword={showPassword}
                        handleChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 mb-6">
                    <input
                        type="checkbox"
                        checked={check}
                        onChange={(e) => setCheck(e.target.checked)}
                        className={`size-4 rounded border-2 transition-all duration-200
                            ${
                                isDarkMode
                                    ? 'border-gray-600 checked:bg-purple-500'
                                    : 'border-gray-300 checked:bg-purple-500'
                            }`}
                    />
                    <span
                        className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                    >
                        are you sure you want to remove this item ?
                    </span>
                </div>

                <Button
                    type="submit"
                    btnText={
                        loading ? (
                            <div className="size-5 fill-white animate-spin">
                                {icons.loading}
                            </div>
                        ) : (
                            'Remove Item'
                        )
                    }
                    disabled={disabled || !check || !password}
                    className={`w-full py-3 px-4 rounded-lg font-medium text-white 
                        transition-all duration-200 transform
                        ${
                            disabled || !check || !password
                                ? 'bg-red-400 cursor-not-allowed opacity-70'
                                : 'bg-red-500 hover:bg-red-600 active:scale-[0.98] hover:shadow-lg'
                        }`}
                />
            </form>
        </div>
    );
}

import { Button, InputField } from '..';
import { usePopupContext, useSnackContext } from '../../Contexts';
import { icons } from '../../Assets/icons';
import { useNavigate } from 'react-router-dom';
import { contractorService } from '../../Services';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useDarkMode } from '../../Contexts/DarkMode';

export default function RemoveSnackPopup() {
    const [loading, setLoading] = useState(false);
    const { setShowPopup, popupInfo } = usePopupContext();
    const { setSnacks } = useSnackContext();
    const navigate = useNavigate();
    const [check, setCheck] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [password, setPassword] = useState('');
    const { isDarkMode } = useDarkMode();

    const [showPassword, setShowPassword] = useState(false);

    async function removeSnack(e) {
        e.preventDefault();

        if (!check || !password) {
            toast.error('Please confirm deletion and enter password');
            return;
        }

        try {
            setLoading(true);
            setDisabled(true);

            const response = await contractorService.removeSnack(
                popupInfo.target._id,
                password
            );

            console.log('Server response:', response); // Debug log

            // Check if the message indicates success
            if (response && response.message === 'snack deleted successfully') {
                // Update local state immediately
                setSnacks((prev) =>
                    prev.filter((snack) => snack._id !== popupInfo.target._id)
                );
                toast.success('Snack removed successfully 👍');
                setShowPopup(false);
            } else {
                console.log('Deletion failed:', response); // Debug log
                toast.error(response?.message || 'Failed to remove snack');
            }
        } catch (error) {
            console.error('Error removing snack:', error);
            toast.error('Something went wrong');
            if (error.response?.status === 500) {
                navigate('/server-error');
            }
        } finally {
            setLoading(false);
            setDisabled(false);
        }
    }

    return (
        <form
            onSubmit={removeSnack}
            className={`w-[90%] max-w-[450px] p-6 rounded-2xl shadow-xl transform 
                transition-all duration-300 ease-in-out
                ${
                    isDarkMode
                        ? 'bg-gray-800 text-white shadow-gray-900/30'
                        : 'bg-white text-gray-800 shadow-gray-300/30'
                }`}
        >
            <h2 className="text-xl font-bold text-center mb-4">Remove Snack</h2>

            <p
                className={`text-sm text-center mb-6 
                ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
            >
                Are you sure you want to remove{' '}
                <span className="font-semibold">{popupInfo.target.name}</span>?
            </p>

            <div className="relative w-full mb-4">
                <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password to confirm"
                    className={`w-full text-sm px-4 py-3 rounded-lg transition-all duration-200
                        focus:ring-2 focus:outline-none
                        ${
                            isDarkMode
                                ? 'bg-gray-700 border-gray-600 focus:ring-purple-500/30'
                                : 'bg-gray-50 border-gray-200 focus:ring-purple-500/20'
                        }`}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 
                        transition-colors duration-200 hover:text-purple-500
                        ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                >
                    <div className="size-5">
                        {showPassword ? icons.eyeOff : icons.eye}
                    </div>
                </button>
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
                    I understand this action cannot be undone
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
                        'Remove Snack'
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
    );
}

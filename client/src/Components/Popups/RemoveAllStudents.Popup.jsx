import { Button, InputField1 } from '..';
import {
    usePopupContext,
    useStudentContext,
    useUserContext,
} from '../../Contexts';
import { icons } from '../../Assets/icons';
import { useNavigate } from 'react-router-dom';
import { contractorService } from '../../Services';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useDarkMode } from '../../Contexts/DarkMode';

export default function RemoveAllStudentsPopup() {
    const [loading, setLoading] = useState(false);
    const { setShowPopup } = usePopupContext();
    const { setStudents } = useStudentContext();
    const navigate = useNavigate();
    const { user } = useUserContext();
    const [check, setCheck] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { isDarkMode } = useDarkMode();

    async function removeStudents(e) {
        e.preventDefault();
        if (!check || !password) {
            toast.error('Please confirm deletion and enter password');
            return;
        }
        setLoading(true);
        setDisabled(true);
        try {
            const res = await contractorService.removeAllStudents(password);
            if (res && res.message === 'all students removed successfully') {
                setStudents([]);
                toast.success('All students removed successfully');
                setShowPopup(false);
            } else {
                toast.error(res?.message || 'Failed to remove students');
            }
        } catch (err) {
            toast.error('Something went wrong');
            navigate('/server-error');
        } finally {
            setDisabled(false);
            setLoading(false);
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

            <form
                className="flex flex-col gap-3 w-full"
                onSubmit={removeStudents}
            >
                <p className="text-2xl font-bold text-center">
                    Remove All Students
                </p>
                <p className="text-[15px] text-center font-medium">
                    {user.hostelType}
                    {user.hostelNumber} - {user.hostelName}
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
                <div className="w-full flex flex-row-reverse gap-3 mt-2 items-start">
                    <label
                        htmlFor="delete-confirm"
                        className={`text-sm cursor-pointer relative -top-2 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}
                    >
                        are you sure you want to remove all student accounts ?
                    </label>
                    <input
                        type="checkbox"
                        checked={check}
                        id="delete student"
                        className="cursor-pointer"
                        onChange={(e) => setCheck(e.target.checked)}
                    />
                </div>
                <Button
                    type="submit"
                    btnText={
                        loading ? (
                            <div className="size-5 fill-white animate-spin">
                                {icons.loading}
                            </div>
                        ) : (
                            'Delete'
                        )
                    }
                    onMouseOver={onMouseOver}
                    disabled={disabled || !check || !password}
                    className="text-white relative -top-2 rounded-md w-full py-2 px-3 bg-red-700 hover:bg-red-800 disabled:bg-red-400 disabled:cursor-not-allowed"
                />
            </form>
        </div>
    );
}

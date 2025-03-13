import { Button } from '..';
import { usePopupContext, useContractorContext } from '../../Contexts';
import { icons } from '../../Assets/icons';
import { useNavigate } from 'react-router-dom';
import { contractorService } from '../../Services';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function RemoveAllStudentsPopup() {
    const [loading, setLoading] = useState(false);
    const { setShowPopup } = usePopupContext();
    const { setStudents } = useContractorContext();
    const navigate = useNavigate();
    const [check, setCheck] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    async function removeStudents() {
        setLoading(true);
        setDisabled(true);
        try {
            const res = await contractorService.removeAllStudents(password);
            if (res && res.message === 'all students removed successfully') {
                setStudents([]);
                toast.success('All students removed successfully');
            } else toast.error(res?.message);
        } catch (err) {
            navigate('/server-error');
        } finally {
            setDisabled(false);
            setLoading(false);
            setShowPopup(false);
        }
    }

    function onMouseOver() {
        if (!check || !password) setDisabled(true);
        else setDisabled(false);
    }

    return (
        <div className="relative w-[350px] sm:w-[450px] transition-all duration-300 bg-white rounded-xl overflow-hidden text-black p-6 flex flex-col items-center justify-center gap-4">
            <Button
                btnText={
                    <div className="size-[20px] stroke-black">
                        {icons.cross}
                    </div>
                }
                title="Close"
                onClick={() => setShowPopup(false)}
                className="absolute top-2 right-2"
            />

            <div className="flex flex-col gap-3">
                <p className="text-2xl font-bold text-center">
                    Remove All Student Accounts
                </p>
                <p className="text-[15px] text-center font-medium">
                    HOSTEL TYPE - NUMBER
                </p>

                <div className="w-full flex flex-row-reverse gap-3 mt-2 items-start">
                    <label
                        htmlFor="delete student"
                        className="text-sm cursor-pointer text-gray-700 relative -top-2"
                    >
                        are you sure you want to remove all student accounts ?
                        although you can register them again in the future.
                    </label>
                    <input
                        type="checkbox"
                        checked={check}
                        id="delete student"
                        className="cursor-pointer"
                        onChange={(e) => setCheck(e.target.checked)}
                    />
                </div>

                <div className="w-full relative -top-4">
                    <div className="bg-white z-[1] ml-2 px-2 w-fit relative top-3 font-medium">
                        <label htmlFor="password">
                            <span className="text-red-500">* </span>
                            Password :
                        </label>
                    </div>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            name="password"
                            id="password"
                            placeholder="Enter password to confirm delete"
                            className="shadow-md shadow-[#f7f7f7] px-2 py-3 rounded-md indent-2 w-full border-[0.01rem] border-gray-500 bg-transparent placeholder:text-[15px]"
                        />
                        <div
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="size-[20px] absolute right-0 top-[50%] transform translate-y-[-50%] mr-4 cursor-pointer fill-[#474747]"
                        >
                            {showPassword ? icons.eyeOff : icons.eye}
                        </div>
                    </div>
                </div>
                <Button
                    btnText={
                        loading ? (
                            <div className="flex items-center justify-center w-full">
                                <div className="size-5 fill-red-700 dark:text-[#e95555]">
                                    {icons.loading}
                                </div>
                            </div>
                        ) : (
                            'Delete'
                        )
                    }
                    onClick={removeStudents}
                    onMouseOver={onMouseOver}
                    disabled={disabled}
                    className="text-white relative -top-2 rounded-md w-full py-2 px-3 bg-red-700 hover:bg-red-800"
                />
            </div>
        </div>
    );
}

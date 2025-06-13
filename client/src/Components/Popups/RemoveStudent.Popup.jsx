import { Button, InputField } from '..';
import { usePopupContext, useStudentContext } from '../../Contexts';
import { icons } from '../../Assets/icons';
import { useNavigate } from 'react-router-dom';
import { contractorService } from '../../Services';
import { getRollNo } from '../../Utils';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useDarkMode } from '../../Contexts/DarkMode';

export default function RemoveStudentPopup() {
    const [loading, setLoading] = useState(false);
    const { setShowPopup } = usePopupContext();
    const { setStudents, targetStudent } = useStudentContext();
    const navigate = useNavigate();
    const [check, setCheck] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { isDarkMode } = useDarkMode();

    async function removeStudent() {
        setLoading(true);
        setDisabled(true);
        try {
            const res = await contractorService.removeStudent(
                targetStudent._id,
                password
            );
            if (res && res.message === 'account deleted successfully') {
                setStudents((prev) =>
                    prev.filter((student) => student._id !== targetStudent._id)
                );
                toast.success('Account Deleted Successfully 😕');
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

            <div className="flex flex-col gap-3">
                <p className="text-2xl font-bold text-center">
                    Remove Student Account
                </p>
                <p className="text-[15px] text-center">
                    <span className="font-medium">Roll No: </span>
                    {getRollNo(targetStudent.userName)}
                </p>

                <div className="w-full flex flex-row-reverse gap-3 mt-2 items-start">
                    <label
                        htmlFor="delete-confirm"
                        className={`text-sm cursor-pointer relative -top-2 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}
                    >
                        are you sure you want to remove this student ? although
                        you can register them again in the future.
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
                    <InputField
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
                <Button
                    btnText="Delete"
                    onClick={handleDelete}
                    onMouseOver={onMouseOver}
                    disabled={disabled}
                    className="text-white relative -top-2 rounded-md w-full py-2 px-3 bg-red-700 hover:bg-red-800"
                />
            </div>
        </div>
    );
}

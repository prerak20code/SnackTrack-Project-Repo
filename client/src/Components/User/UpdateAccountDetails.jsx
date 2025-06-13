import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../Contexts';
import { getRollNo, verifyExpression } from '../../Utils';
import { contractorService } from '../../Services';
import { Button, InputField } from '..';
import toast from 'react-hot-toast';
import { useDarkMode } from '../../Contexts/DarkMode';

import { icons } from '../../Assets/icons';

export default function UpdateAccountDetails() {
    const { user, setUser } = useUserContext();
    const { isDarkMode } = useDarkMode();

    const initialInputs = {
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        password: '',
    };
    const [inputs, setInputs] = useState(initialInputs);
    const [error, setError] = useState({});
    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    function handleChange(e) {
        const { name, value } = e.target;
        setInputs((prev) => ({ ...prev, [name]: value }));
    }

    function handleBlur(e) {
        const { name, value } = e.target;
        if (value && name !== 'password') {
            verifyExpression(name, value, setError);
        }
    }

    function onMouseOver() {
        if (
            Object.values(inputs).some((value) => !value) ||
            Object.entries(error).some(
                ([key, value]) => value && key !== 'password'
            ) ||
            !Object.entries(inputs).some(
                ([key, value]) =>
                    value !== initialInputs[key] && key !== 'password'
            )
        ) {
            setDisabled(true);
        } else {
            setDisabled(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setDisabled(true);
        setError({});
        try {
            let res = null;
            if (user.role === 'contractor') {
                res = await contractorService.updateAccountDetails(inputs);
            }
            if (res && res.message === 'account details updated successfully') {
                setUser((prev) => ({
                    ...prev,
                    fullName: inputs.fullName,
                    phoneNumber: inputs.phoneNumber,
                    email: inputs.email,
                }));
                setInputs((prev) => ({ ...prev, password: '' }));
                toast.success('Account details updated successfully');
            } else {
                setError((prev) => ({ ...prev, password: res.message }));
            }
        } catch (err) {
            navigate('/server-error');
        } finally {
            setDisabled(false);
            setLoading(false);
            setShowPassword(false);
        }
    }

    const inputFields = [
        {
            name: 'email',
            type: 'text',
            placeholder: 'Enter your email',
            label: 'Email',
            required: true,
        },
        {
            name: 'fullName',
            type: 'text',
            placeholder: 'Enter your full name',
            label: 'First name',
            required: true,
        },
        {
            name: 'phoneNumber',
            type: 'text',
            placeholder: 'Enter your phone number',
            label: 'Phone Number',
            required: true,
        },
        {
            name: 'password',
            type: showPassword ? 'text' : 'password',
            placeholder: 'Enter your password',
            label: 'Password',
            required: true,
        },
    ];

    const inputElements = inputFields.map((field) => (
        <div className="w-full" key={field.name}>
            <InputField
                field={field}
                handleBlur={handleBlur}
                handleChange={handleChange}
                inputs={inputs}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
            />
            {error[field.name] && (
                <div className="text-red-500 text-xs font-medium">
                    {error[field.name]}
                </div>
            )}
        </div>
    ));

    return (
        <div className="w-full p-2">
            {user.role !== 'student' ? (
                <div
                    className={`rounded-xl drop-shadow-md flex flex-col sm:flex-row py-6 px-8 sm:gap-14 ${
                        isDarkMode ? 'bg-gray-800' : 'bg-white'
                    }`}
                >
                    <div className="w-full py-4">
                        <h3
                            className={`text-2xl font-bold ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}
                        >
                            Update Personal Information
                        </h3>
                        <p
                            className={`mt-2 ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}
                        >
                            Update your personal details here. Please note that
                            changes cannot be undone.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="w-full max-w-[600px] relative -top-2"
                    >
                        <div className="flex flex-col gap-2">
                            {inputElements}
                        </div>
                        <div className="flex gap-4 mt-6">
                            <Button
                                onMouseOver={onMouseOver}
                                btnText="Cancel"
                                onClick={() => {
                                    setInputs(initialInputs);
                                    setError({});
                                }}
                                disabled={loading}
                                className={`text-white rounded-md h-[40px] text-lg w-full ${
                                    loading
                                        ? isDarkMode
                                            ? 'bg-gray-700 cursor-not-allowed'
                                            : 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-[#4977ec] hover:bg-[#3b62c2]'
                                }`}
                            />
                            <Button
                                btnText={
                                    loading ? (
                                        <div className="flex items-center justify-center w-full">
                                            <div
                                                className={`size-5 ${
                                                    isDarkMode
                                                        ? 'fill-[#a2bdff]'
                                                        : 'fill-[#4977ec]'
                                                }`}
                                            >
                                                {icons.loading}
                                            </div>
                                        </div>
                                    ) : (
                                        'Update'
                                    )
                                }
                                disabled={disabled}
                                type="submit"
                                onMouseOver={onMouseOver}
                                className={`text-white rounded-md h-[40px] text-lg w-full ${
                                    disabled
                                        ? isDarkMode
                                            ? 'bg-gray-700 cursor-not-allowed'
                                            : 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-[#4977ec] hover:bg-[#3b62c2]'
                                }`}
                            />
                        </div>
                    </form>
                </div>
            ) : (
                <div
                    className={`rounded-xl drop-shadow-md flex flex-col sm:flex-row py-6 px-8 sm:gap-14 ${
                        isDarkMode ? 'bg-gray-800' : 'bg-white'
                    }`}
                >
                    <div className="w-full py-4">
                        <h3
                            className={`text-2xl font-bold ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}
                        >
                            Personal Information
                        </h3>
                        <p
                            className={`mt-2 ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}
                        >
                            Your personal details are displayed here. Please
                            note that to make any changes here you have to go to
                            the POC from where you were registered.
                        </p>
                    </div>

                    <div className="w-full max-w-[600px]">
                        <div
                            className={`shadow-md p-3 rounded-md w-full border-[0.01rem] flex flex-col gap-4 ${
                                isDarkMode
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-white border-gray-500 text-gray-900'
                            }`}
                        >
                            {/* Info fields */}
                            <div>
                                <span
                                    className={`font-semibold text-lg ${
                                        isDarkMode
                                            ? 'text-gray-200'
                                            : 'text-gray-900'
                                    }`}
                                >
                                    Hostel:{' '}
                                </span>
                                <span
                                    className={
                                        isDarkMode
                                            ? 'text-gray-300'
                                            : 'text-gray-700'
                                    }
                                >
                                    {user.hostelName} @
                                    {user.hostelType + user.hostelNumber}
                                </span>
                            </div>
                            <div>
                                <span
                                    className={`font-semibold text-lg ${
                                        isDarkMode
                                            ? 'text-gray-200'
                                            : 'text-gray-900'
                                    }`}
                                >
                                    Full Name:{' '}
                                </span>
                                <span
                                    className={
                                        isDarkMode
                                            ? 'text-gray-300'
                                            : 'text-gray-700'
                                    }
                                >
                                    {user.fullName}
                                </span>
                            </div>
                            <div>
                                <span
                                    className={`font-semibold text-lg ${
                                        isDarkMode
                                            ? 'text-gray-200'
                                            : 'text-gray-900'
                                    }`}
                                >
                                    Roll No:{' '}
                                </span>
                                <span
                                    className={
                                        isDarkMode
                                            ? 'text-gray-300'
                                            : 'text-gray-700'
                                    }
                                >
                                    {getRollNo(user.userName)}
                                </span>
                            </div>
                            <div>
                                <span
                                    className={`font-semibold text-lg ${
                                        isDarkMode
                                            ? 'text-gray-200'
                                            : 'text-gray-900'
                                    }`}
                                >
                                    Email:{' '}
                                </span>
                                <span
                                    className={
                                        isDarkMode
                                            ? 'text-gray-300'
                                            : 'text-gray-700'
                                    }
                                >
                                    {user.email}
                                </span>
                            </div>
                            <div>
                                <span
                                    className={`font-semibold text-lg ${
                                        isDarkMode
                                            ? 'text-gray-200'
                                            : 'text-gray-900'
                                    }`}
                                >
                                    Phone Number:{' '}
                                </span>
                                <span
                                    className={
                                        isDarkMode
                                            ? 'text-gray-300'
                                            : 'text-gray-700'
                                    }
                                >
                                    {user.phoneNumber}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

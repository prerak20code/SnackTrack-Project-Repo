import { LOGO } from '../Constants/constants';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useUserContext } from '../Contexts';
import { studentService, contractorService, adminService } from '../Services';
import { Button, InputField } from '../Components';
import { icons } from '../Assets/icons';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const [inputs, setInputs] = useState({ loginInput: '', password: '' });
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { setUser } = useUserContext();
    const navigate = useNavigate();

    function handleChange(e) {
        const { value, name } = e.target;
        setInputs((prev) => ({ ...prev, [name]: value }));
    }

    function onMouseOver() {
        if (!inputs.loginInput || !inputs.password) setDisabled(true);
        else setDisabled(false);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setDisabled(true);
        setError('');
        try {
            let res;
            if (role === 'contractor') {
                res = await contractorService.login({
                    emailOrPhoneNo: inputs.loginInput,
                    password: inputs.password,
                });
            } else if (role === 'admin') {
                res = await adminService.login({
                    emailOrPhoneNo: inputs.loginInput,
                    password: inputs.password,
                });
            } else {
                res = await studentService.login({
                    userName: inputs.loginInput,
                    password: inputs.password,
                });
            }
            if (res && !res.message) {
                setUser(res);
                toast.success('Logged in Successfully 😉');
                navigate('/');
            } else {
                setUser(null);
                setError(res.message);
            }
        } catch (err) {
            navigate('/server-error');
        } finally {
            setDisabled(false);
            setLoading(false);
        }
    }

    const roles = ['student', 'contractor', 'admin'];

    const inputFields = [
        {
            type: 'text',
            name: 'loginInput',
            label: role === 'student' ? 'Username' : 'Email',
            value: inputs.loginInput,
            placeholder:
                role === 'student'
                    ? 'Enter your username, ex: GH8-123'
                    : 'Enter your email',
            required: true,
            show: role,
        },
        {
            type: showPassword ? 'text' : 'password',
            name: 'password',
            label: 'Password',
            value: inputs.password,
            placeholder: 'Enter password',
            required: true,
            show: true,
        },
    ];

    const inputElements = inputFields.map(
        (field) =>
            field.show && (
                <InputField
                    key={field.name}
                    field={field}
                    handleChange={handleChange}
                    error={error}
                    inputs={inputs}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                />
            )
    );

    return (
        <div className="text-black flex flex-col items-center justify-center gap-5 fixed z-[100] bg-white inset-0">
            <Link
                to={'/'}
                className="w-fit flex items-center justify-center hover:brightness-95"
            >
                <div className="overflow-hidden rounded-full size-[90px] drop-shadow-md">
                    <img
                        src={LOGO}
                        alt="peer connect logo"
                        className="object-cover size-full"
                    />
                </div>
            </Link>
            <div className="w-fit">
                <p className="text-center px-3 text-[28px] font-medium">
                    Login to Your Account
                </p>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                    className="h-[0.05rem] relative -top-1 bg-[#333333]"
                />
            </div>
            <div className="mt-3 text-black w-[400px]">
                {error && (
                    <div className="text-red-500 w-full text-center mb-2">
                        {error}
                    </div>
                )}

                {/* ROLE SELECTION CHECKBOXES */}
                <div className="w-full">
                    <p className="font-medium mb-2">Are you a:</p>
                    <div className="flex gap-4">
                        {roles.map((option) => (
                            <label
                                key={option}
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                <input
                                    type="radio"
                                    name="role"
                                    value={option}
                                    checked={role === option}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="hidden"
                                />
                                <div
                                    className={`w-5 h-5 border-2 rounded-full flex items-center justify-center
                                ${role === option ? 'border-blue-500' : 'border-gray-400'}`}
                                >
                                    {role === option && (
                                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    )}
                                </div>
                                {option}
                            </label>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {inputElements}

                    <div>
                        <Button
                            className="text-white rounded-md py-2 mt-4 h-[45px] text-lg w-full flex items-center justify-center bg-[#4977ec] hover:bg-[#3b62c2]"
                            onMouseOver={onMouseOver}
                            type="submit"
                            btnText={
                                loading ? (
                                    <div className="size-5 fill-[#4977ec] dark:text-[#a2bdff]">
                                        {icons.loading}
                                    </div>
                                ) : (
                                    'Login'
                                )
                            }
                            disabled={disabled}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}

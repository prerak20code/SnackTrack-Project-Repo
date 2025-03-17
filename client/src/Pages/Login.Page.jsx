import { LOGO } from '../Constants/constants';
import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useUserContext } from '../Contexts';
import {
    studentService,
    contractorService,
    adminService,
    userService,
} from '../Services';
import { Button, Filter, InputField } from '../Components';
import { icons } from '../Assets/icons';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [inputs, setInputs] = useState({ loginInput: '', password: '' });
    const role = searchParams.get('role') || '';
    const hostel = searchParams.get('hostel') || '';
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { setUser } = useUserContext();
    const navigate = useNavigate();
    const [hostels, setHostels] = useState([
        { value: '', label: 'Select Hostel' },
    ]);

    // Clear query parameters on initial load
    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        if (params.has('role') || params.has('hostel')) {
            params.delete('role');
            params.delete('hostel');
            setSearchParams(params);
        }
    }, []); // Empty dependency array ensures this runs only once on mount

    function handleChange(e) {
        const { value, name } = e.target;
        setInputs((prev) => ({ ...prev, [name]: value }));
    }

    function onMouseOver() {
        if (
            !inputs.loginInput ||
            !inputs.password ||
            (role === 'student' && !hostel) ||
            !role
        ) {
            setDisabled(true);
        } else setDisabled(false);
    }

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        (async function getCanteens() {
            try {
                const res = await userService.getCanteens(signal);
                if (res && !res.message) {
                    setHostels((prev) => [
                        ...prev,
                        ...res.map(
                            ({ hostelType, hostelNumber, hostelName }) => ({
                                value: hostelType + hostelNumber,
                                label:
                                    hostelType +
                                    hostelNumber +
                                    ' - ' +
                                    hostelName,
                            })
                        ),
                    ]);
                }
            } catch (err) {
                navigate('/server-error');
            }
        })();

        return () => controller.abort();
    }, []);

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
                    userName: `${hostel}-${inputs.loginInput}`,
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

    const roles = [
        { value: '', label: 'Select Role' },
        { value: 'student', label: 'Student' },
        { value: 'contractor', label: 'Contractor' },
        { value: 'admin', label: 'Admin' },
    ];

    const inputFields = [
        {
            type: role === 'student' ? 'number' : 'email',
            name: 'loginInput',
            label: role === 'student' ? 'Roll No' : 'Email',
            value: inputs.loginInput,
            placeholder:
                role === 'student' ? 'Enter your Roll no' : 'Enter your email',
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
                    inputs={inputs}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                />
            )
    );

    return (
        <div className="text-black flex flex-col items-center justify-center gap-5 overflow-y-scroll fixed z-[100] bg-white inset-0">
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
            <div className="text-black max-w-[500px] min-w-[300px] mt-4 flex flex-col items-center">
                {error && (
                    <div className="text-red-500 relative -top-2 w-full text-center mb-6">
                        {error}
                    </div>
                )}

                <Filter
                    options={roles}
                    defaultOption=""
                    className="mb-6 w-full"
                    queryParamName="role"
                />

                <form
                    onSubmit={handleSubmit}
                    className="w-full flex flex-col gap-4"
                >
                    {role === 'student' && (
                        <div className="w-full flex justify-center">
                            <Filter
                                options={hostels}
                                defaultOption=""
                                className="mb-0 w-full"
                                queryParamName="hostel"
                            />
                        </div>
                    )}

                    <div className="w-full flex flex-col gap-2">
                        {inputElements}
                    </div>

                    <div>
                        <Button
                            className="text-white rounded-md py-2 mt-2 h-[40px] text-lg w-full flex items-center justify-center bg-[#4977ec] hover:bg-[#3b62c2]"
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

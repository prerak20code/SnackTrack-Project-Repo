import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserContext, usePopupContext } from '../../Context';
import { authService } from '../../Services';
import { Button } from '..';
import { icons } from '../../Assets/icons';
import toast from 'react-hot-toast';

export default function Login() {
    const [inputs, setInputs] = useState({ loginInput: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { setUser } = useUserContext();
    const { setShowPopup, showPopup } = usePopupContext();
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
            const res = await authService.login(inputs, setLoading);
            if (res && !res.message) {
                setUser(res);
                toast.success('Logges in Successfully 😉');
                if (showPopup) setShowPopup(false);
                else navigate('/');
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

    const inputFields = [
        {
            type: 'text',
            name: 'loginInput',
            label: 'Username or Email',
            value: inputs.loginInput,
            placeholder: 'Enter username or email',
            required: true,
        },
        {
            type: showPassword ? 'text' : 'password',
            name: 'password',
            label: 'Password',
            value: inputs.password,
            placeholder: 'Enter password',
            required: true,
        },
    ];

    const inputElements = inputFields.map((field) => (
        <div key={field.name} className="w-full">
            <div className="bg-white z-[1] ml-3 px-2 w-fit relative top-3 font-medium">
                <label htmlFor={field.name}>
                    {field.label}
                    {field.required && <span className="text-red-500">*</span>}
                </label>
            </div>
            <div className="relative">
                <input
                    type={field.type}
                    name={field.name}
                    id={field.name}
                    value={inputs[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="shadow-md shadow-[#efefef] px-2 py-4 rounded-md indent-2 w-full border-[0.01rem] border-[#aeaeae] bg-transparent placeholder:text-[#a0a0a0]"
                />
                {field.name === 'password' && (
                    <div
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="size-[20px] absolute right-0 top-[50%] transform translate-y-[-50%] mr-4 cursor-pointer fill-[#474747]"
                    >
                        {showPassword ? icons.eyeOff : icons.eye}
                    </div>
                )}
            </div>
        </div>
    ));

    return (
        <div className="text-black w-[400px] h-full">
            {error && (
                <div className="text-red-500 w-full text-center mb-2">
                    {error}
                </div>
            )}

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
                    <p className="w-full text-center text-[16px] mt-2">
                        don't have an Account ?{' '}
                        <Link
                            to={'/register'}
                            className="text-[#355ab6] hover:underline"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
}

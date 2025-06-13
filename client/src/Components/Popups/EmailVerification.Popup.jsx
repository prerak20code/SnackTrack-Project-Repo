import { useState, useRef, useEffect } from 'react';
import { Button } from '..';
import { icons } from '../../Assets/icons';
import { usePopupContext } from '../../Contexts';
import { useNavigate } from 'react-router-dom';
import { contractorService } from '../../Services';
import { useDarkMode } from '../../Contexts/DarkMode';

import toast from 'react-hot-toast';

export default function EmailVerificationPopup() {
    const { popupInfo, setShowPopup } = usePopupContext();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [resendingMail, setResendingMail] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef([]); // Refs for each input box
    const [timeLeft, setTimeLeft] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const { isDarkMode } = useDarkMode();

    const handleChange = (index, value) => {
        const newCode = [...code];
        newCode[index] = value.replace(/\D/g, ''); // Allow only numbers
        setCode(newCode);

        // Auto-focus to the next input
        if (value && index < 5) inputRefs.current[index + 1].focus();

        // Enable/disable the Verify button
        setDisabled(newCode.some((digit) => !digit));
    };
    // Handle backspace key
    const handleKeyDown = (i, e) => {
        if (e.key === 'Backspace' && !code[i] && i > 0) {
            inputRefs.current[i - 1].focus();
        }
    };

    const verifyEmail = async () => {
        setLoading(true);
        setDisabled(true);
        try {
            const res = await contractorService.completeRegistration({
                ...popupInfo.target,
                code: code.join(''),
            });
            if (res && !res.message) {
                setShowPopup(false);
                toast.success('Canteen Registered Successfully');
                navigate('/login');
            } else toast.error(res?.message);
        } catch (err) {
            console.log(err);
            navigate('/server-error');
        } finally {
            setLoading(false);
            setDisabled(false);
        }
    };

    async function resendCode() {
        try {
            setResendingMail(true);
            const res = await contractorService.resendEmailVerification(
                popupInfo.target.email
            );
            if (res && res.message === 'Verification code resent') {
                toast.success(res.message);
                setTimeLeft(60); // Reset timer
                setCanResend(false); // Disable resend button
                setCode(['', '', '', '', '', '']);
            }
        } catch (err) {
            navigate('/server-error');
        } finally {
            setResendingMail(false);
        }
    }

    // Timer
    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else setCanResend(true);
    }, [timeLeft]);

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
                <p
                    className={`text-2xl font-bold text-center ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}
                >
                    Verify Email
                </p>
                <p
                    className={`text-[15px] text-center ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}
                >
                    Enter the 6-digit code sent to your email
                </p>

                {/* Input Boxes */}
                <div className="flex items-center justify-center gap-2">
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) =>
                                handleChange(index, e.target.value)
                            }
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            ref={(el) => (inputRefs.current[index] = el)}
                            className={`size-10 text-2xl text-center border-2 rounded-lg focus:border-[#4977ec] focus:outline-none ${
                                isDarkMode
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-white border-gray-300 text-black'
                            }`}
                            autoFocus={index === 0}
                        />
                    ))}
                </div>

                {/* Timer and Resend Button */}
                <div className="text-center">
                    {timeLeft > 0 ? (
                        <p
                            className={`text-sm ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}
                        >
                            Resend code in {timeLeft} seconds
                        </p>
                    ) : (
                        <Button
                            btnText={
                                resendingMail ? <div>...</div> : 'Resend Code'
                            }
                            onClick={resendCode}
                            disabled={!canResend}
                            className={`text-sm ${
                                canResend
                                    ? 'text-[#4977ec] hover:underline'
                                    : isDarkMode
                                      ? 'text-gray-500'
                                      : 'text-gray-400'
                            }`}
                        />
                    )}
                </div>

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
                            'Verify'
                        )
                    }
                    onClick={verifyEmail}
                    disabled={disabled}
                    className={`text-white rounded-md py-2 h-[40px] flex items-center justify-center text-lg w-full ${
                        disabled
                            ? isDarkMode
                                ? 'bg-gray-700 cursor-not-allowed'
                                : 'bg-gray-400 cursor-not-allowed'
                            : 'bg-[#4977ec] hover:bg-[#3b62c2]'
                    }`}
                />
            </div>
        </div>
    );
}

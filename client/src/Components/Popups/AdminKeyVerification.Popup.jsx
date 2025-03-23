import { useState } from 'react';
import { Button } from '..';
import { icons } from '../../Assets/icons';
import { usePopupContext, useUserContext } from '../../Contexts';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../Services';
import toast from 'react-hot-toast';

export default function AdminKeyVerificationPopup() {
    const { setShowPopup } = usePopupContext();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [key, setKey] = useState('');
    const { setAdminVerified } = useUserContext();

    const verifyKey = async () => {
        setLoading(true);
        try {
            const res = await adminService.verifyAdminKey(key);
            if (res && res.message === 'Correct key') {
                navigate('/admin');
                setAdminVerified(true);
            } else toast.error(res?.message);
        } catch (err) {
            navigate('/server-error');
        } finally {
            setLoading(false);
            setShowPopup(false);
        }
    };

    return (
        <div className="relative w-[350px] sm:w-[450px] transition-all duration-300 bg-white rounded-xl overflow-hidden text-black p-5 flex flex-col items-center justify-center gap-4">
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

            <div>
                <p className="text-2xl font-bold text-center mb-4">
                    Verify Admin Key
                </p>
                <p className="text-[15px] text-gray-600 text-center mb-6">
                    Enter the Admin Secret key to navigate to control panel
                </p>

                <div className="flex items-center justify-center mb-6">
                    <input
                        type="password"
                        value={key}
                        autoFocus
                        onChange={(e) => setKey(e.target.value)}
                        className="w-full text-xl  text-center border-b-2 border-gray-800 focus:border-[#4977ec] mx-10 focus:outline-none"
                    />
                </div>

                <Button
                    btnText={
                        loading ? (
                            <div className="flex items-center justify-center w-full">
                                <div className="size-5 fill-[#4977ec] dark:text-[#a2bdff]">
                                    {icons.loading}
                                </div>
                            </div>
                        ) : (
                            'Verify'
                        )
                    }
                    onClick={verifyKey}
                    disabled={!key}
                    className="text-white rounded-md py-2 h-[40px] flex items-center justify-center text-lg w-full bg-[#4977ec] hover:bg-[#3b62c2]"
                />
            </div>
        </div>
    );
}

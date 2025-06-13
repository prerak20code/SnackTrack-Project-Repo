import { Button } from '..';
import { userService } from '../../Services';
import { icons } from '../../Assets/icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../Contexts';
import { useDarkMode } from '../../Contexts/DarkMode';

export default function Logout() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useUserContext();
    const { isDarkMode } = useDarkMode();

    async function logout() {
        setLoading(true);
        try {
            const res = await userService.logout();
            if (res && res.message === 'user loggedout successfully') {
                setUser(null);
                toast.success('Logged out Successfully 🙂');
            }
        } catch (err) {
            navigate('/server-error');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button
            onClick={logout}
            disabled={loading}
            btnText={
                loading ? (
                    <div className="flex items-center justify-center w-full">
                        <div
                            className={`size-5 ${
                                isDarkMode ? 'fill-[#a2bdff]' : 'fill-[#4977ec]'
                            }`}
                        >
                            {icons.loading}
                        </div>
                    </div>
                ) : (
                    'Logout'
                )
            }
            title="Logout"
            className={`text-white rounded-md py-[5px] w-[80px] h-[35px] ${
                loading
                    ? isDarkMode
                        ? 'bg-gray-700 cursor-not-allowed'
                        : 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#4977ec] hover:bg-[#3b62c2]'
            }`}
        />
    );
}

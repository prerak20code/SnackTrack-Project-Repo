import { Link, useNavigate } from 'react-router-dom';
import { Button, Logout, Searchbar } from '..';
import {
    useUserContext,
    useSideBarContext,
    usePopupContext,
} from '../../Contexts';
import { useDarkMode } from '../../Contexts/DarkMode';
import { LOGO } from '../../Constants/constants';
import { icons } from '../../Assets/icons';
import { useState } from 'react';

export default function Header() {
    const { user } = useUserContext();
    const { setShowSideBar } = useSideBarContext();
    const navigate = useNavigate();
    const { setShowPopup, setPopupInfo } = usePopupContext();
    const [notifications, setNotifications] = useState([]);
    const { isDarkMode, setIsDarkMode } = useDarkMode();

    return (
        <header
            className={`drop-shadow-sm fixed top-0 z-[10] w-full ${
                isDarkMode
                    ? 'bg-gray-900 text-white'
                    : 'bg-[#f9f9f9] text-black'
            } h-[60px] px-4 font-medium flex items-center justify-between gap-4`}
        >
            {/* Left Section: Sidebar, Search/Logo */}
            <div className="flex items-center justify-center gap-4 md:flex-initial">
                <Button
                    btnText={
                        <div
                            className={`size-[20px] ${
                                isDarkMode
                                    ? 'fill-white group-hover:fill-[#4977ec]'
                                    : 'fill-[#434343] group-hover:fill-[#4977ec]'
                            }`}
                        >
                            {icons.hamburgur}
                        </div>
                    }
                    title="Show Sidebar"
                    onClick={() => setShowSideBar((prev) => !prev)}
                    className={`${
                        isDarkMode ? 'bg-gray-800' : 'bg-[#ffffff]'
                    } p-[9px] group rounded-full drop-shadow-sm w-fit shrink-0`}
                />

                {/* Mobile Search */}
                <div className="block md:hidden flex-1">
                    <Searchbar mobile={true} />
                </div>

                {/* Desktop Logo */}
                <div className="hidden md:block">
                    <Link
                        to="/"
                        className="flex items-center justify-center gap-3 text-nowrap font-medium text-xl"
                    >
                        <div
                            className={`overflow-hidden rounded-full size-[38px] drop-shadow-sm hover:scale-110 transition-all duration-300 ${
                                isDarkMode ? 'bg-gray-800' : 'bg-white'
                            }`}
                        >
                            <img
                                src={LOGO}
                                alt="Snack Track Logo"
                                className={`object-cover size-full hover:brightness-95 ${
                                    isDarkMode ? 'filter brightness-90' : ''
                                }`}
                            />
                        </div>
                        <div className="hover:scale-110 transition-all duration-300">
                            SnackTrack
                        </div>
                    </Link>
                </div>
            </div>

            {/* Center: Desktop Search */}
            <div className="hidden md:block flex-1 max-w-[550px]">
                <Searchbar mobile={false} />
            </div>

            {/* Right: Actions */}
            {user.role === 'student' ? (
                <div className="flex gap-4 items-center">
                    {/* Dark Mode Toggle */}
                    <Button
                        btnText={
                            <div
                                className={`size-[20px] ${
                                    isDarkMode
                                        ? 'fill-white group-hover:fill-[#4977ec]'
                                        : 'fill-[#434343] group-hover:fill-[#4977ec]'
                                }`}
                            >
                                {isDarkMode ? icons.sun : icons.moon}
                            </div>
                        }
                        title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={`${
                            isDarkMode ? 'bg-gray-800' : 'bg-[#ffffff]'
                        } p-[9px] group rounded-full drop-shadow-sm w-fit`}
                    />

                    {/* View Cart */}
                    <Button
                        btnText={
                            <div
                                className={`size-[20px] ${
                                    isDarkMode
                                        ? 'fill-white group-hover:fill-[#4977ec]'
                                        : 'fill-[#434343] group-hover:fill-[#4977ec]'
                                }`}
                            >
                                {icons.cart}
                            </div>
                        }
                        title="View Cart"
                        onClick={() => navigate('/cart')}
                        className={`${
                            isDarkMode ? 'bg-gray-800' : 'bg-[#ffffff]'
                        } p-[9px] group rounded-full drop-shadow-sm w-fit`}
                    />

                    {/* Notifications */}
                    <Button
                        btnText={
                            <div
                                className={`size-[20px] ${
                                    isDarkMode
                                        ? 'fill-white group-hover:fill-[#4977ec]'
                                        : 'fill-[#434343] group-hover:fill-[#4977ec]'
                                }`}
                            >
                                {icons.bell}
                            </div>
                        }
                        title="Notifications"
                        onClick={() => {
                            setShowPopup(true);
                            setPopupInfo({ type: 'notifications' });
                        }}
                        className={`${
                            isDarkMode ? 'bg-gray-800' : 'bg-[#ffffff]'
                        } p-[9px] group rounded-full drop-shadow-sm w-fit`}
                    />

                    {/* Logout */}
                    <div className="hidden sm:block">
                        <Logout />
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center gap-4">
                    <div className="flex gap-4 items-center">
                        {/* Dark Mode Toggle */}
                        <Button
                            btnText={
                                <div
                                    className={`size-[20px] ${
                                        isDarkMode
                                            ? 'fill-white group-hover:fill-[#4977ec]'
                                            : 'fill-[#434343] group-hover:fill-[#4977ec]'
                                    }`}
                                >
                                    {isDarkMode ? icons.sun : icons.moon}
                                </div>
                            }
                            title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className={`${
                                isDarkMode ? 'bg-gray-800' : 'bg-[#ffffff]'
                            } p-[9px] group rounded-full drop-shadow-sm w-fit`}
                        />

                        {/* Add Student Button */}
                        <Button
                            onClick={() => navigate('/register-student')}
                            btnText={
                                <div className="flex items-center justify-center gap-2">
                                    <div className="size-[20px] fill-white">
                                        {icons.plus}
                                    </div>
                                    <span>Add Student</span>
                                </div>
                            }
                            title="Add Student"
                            className="text-white rounded-md w-fit text-nowrap px-3 h-[35px] bg-[#4977ec] hover:bg-[#3b62c2]"
                        />
                    </div>

                    {/* Logout */}
                    <div className="hidden md:block">
                        <Logout />
                    </div>
                </div>
            )}
        </header>
    );
}

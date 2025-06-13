import { NavLink } from 'react-router-dom';
import { useSideBarContext, useUserContext } from '../../Contexts';
import { icons } from '../../Assets/icons';
import { Button, Logout } from '..';
import { AnimatePresence, motion } from 'framer-motion';
import { useRef } from 'react';
import { useDarkMode } from '../../Contexts/DarkMode';

export default function Sidebar() {
    const { user } = useUserContext();
    const { showSideBar, setShowSideBar } = useSideBarContext();
    const { isDarkMode } = useDarkMode();
    const items = [
        { path: '/', name: 'Home', icon: icons.home, show: true },
        {
            path: '/my-orders',
            name: 'My Orders',
            icon: icons.clock,
            show: user.role === 'student',
        },
        {
            path: '/my-bills',
            name: 'My Bills',
            icon: icons.rupee,
            show: user.role === 'student',
        },
        {
            path: '/today-orders',
            name: "Today's Orders",
            icon: icons.clock,
            show: user.role === 'contractor',
        },
        {
            path: '/statistics',
            name: 'Statistics',
            icon: icons.growth,
            show: user.role === 'contractor',
        },
        {
            path: '/bills',
            name: 'Monthly Revenue',
            icon: icons.rupee,
            show: user.role === 'contractor',
        },
        {
            path: '/students',
            name: 'Students',
            icon: icons.user,
            show: user.role === 'contractor',
        },
    ];

    const systemItems = [
        { path: '/support', name: 'Support', icon: icons.support },
        { path: '/about-us', name: 'About Us', icon: icons.search },
        { path: '/contact-us', name: 'Contact Us', icon: icons.contact },
        { path: '/settings', name: 'Settings', icon: icons.settings },
    ];

    const itemElements = items.map(
        (item) =>
            item.show && (
                <NavLink
                    key={item.name}
                    className={({ isActive }) =>
                        `${isActive && (isDarkMode ? 'bg-gray-800' : 'backdrop-brightness-90')} 
                        w-full py-2 px-[10px] rounded-md 
                        ${isDarkMode ? 'hover:bg-gray-800' : 'hover:backdrop-brightness-90'}`
                    }
                    to={item.path}
                >
                    <div className="flex items-center justify-start gap-4">
                        <div
                            className={`size-[19px] ${isDarkMode ? 'fill-gray-300' : 'fill-[#2a2a2a]'}`}
                        >
                            {item.icon}
                        </div>
                        <div>{item.name}</div>
                    </div>
                </NavLink>
            )
    );

    const systemItemElements = systemItems.map((item) => (
        <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
                `${isActive && (isDarkMode ? 'bg-gray-800' : 'backdrop-brightness-90')} 
                w-full py-2 px-[10px] rounded-md 
                ${isDarkMode ? 'hover:bg-gray-800' : 'hover:backdrop-brightness-90'}`
            }
        >
            <div className="flex items-center justify-start gap-4">
                <div
                    className={`size-[19px] ${isDarkMode ? 'fill-gray-300' : 'fill-[#202020]'}`}
                >
                    {item.icon}
                </div>
                <div>{item.name}</div>
            </div>
        </NavLink>
    ));

    const sideBarRef = useRef();

    function closeSideBar(e) {
        if (e.target === sideBarRef.current) {
            setShowSideBar(false);
        }
    }

    const sideBarVariants = {
        beginning: {
            x: '-100vw',
        },
        end: {
            x: 0,
            transition: {
                type: 'tween',
                duration: 0.3,
            },
        },
        exit: {
            x: '-100vw',
            transition: {
                type: 'tween',
                duration: 1,
            },
        },
    };

    const backdropVariants = {
        visible: {
            backdropFilter: 'brightness(0.65)',
            transition: {
                duration: 0.5,
            },
        },
        hidden: {
            backdropFilter: 'brightness(1)',
            transition: {
                duration: 0.2,
            },
        },
    };

    return (
        <AnimatePresence>
            {showSideBar && (
                <motion.div
                    ref={sideBarRef}
                    onClick={closeSideBar}
                    className="fixed inset-0 z-[100] h-screen"
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                >
                    <motion.aside
                        variants={sideBarVariants}
                        initial="beginning"
                        animate="end"
                        exit="exit"
                        className="h-full w-[265px] flex justify-start"
                    >
                        <div
                            className={`w-full px-3 ${
                                isDarkMode
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-[#f9f9f9] text-black'
                            } drop-shadow-sm flex flex-col items-start justify-start h-full`}
                        >
                            <div className="h-[60px] gap-5 px-1 w-full flex items-center justify-between">
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
                                    onClick={() =>
                                        setShowSideBar((prev) => !prev)
                                    }
                                    title="Close Sidebar"
                                    className={`${
                                        isDarkMode
                                            ? 'bg-gray-800'
                                            : 'bg-[#ffffff]'
                                    } p-[10px] group rounded-full drop-shadow-sm w-fit`}
                                />

                                <div className="flex gap-4 items-center">
                                    <div
                                        className={`block ${user.role === 'student' ? 'sm:hidden' : 'md:hidden'}`}
                                    >
                                        <Logout />
                                    </div>
                                    {/* avatar */}
                                    <div className="size-[40px] rounded-full overflow-hidden drop-shadow-sm hover:brightness-90">
                                        <img
                                            src={user.avatar}
                                            alt="user avatar"
                                            className="size-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>

                            <hr
                                className={`w-full ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}
                            />

                            <div
                                className={`overflow-y-scroll text-[17px] w-full h-[calc(100%-60px)] py-3 flex flex-col items-start justify-between ${
                                    isDarkMode ? 'text-white' : 'text-black'
                                }`}
                            >
                                <div className="w-full flex flex-col gap-1 mb-1 items-start justify-start">
                                    {itemElements}
                                </div>
                                <div className="w-full flex flex-col gap-1 items-start justify-start">
                                    <hr
                                        className={`w-full ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}
                                    />
                                    {systemItemElements}
                                </div>
                            </div>
                        </div>
                    </motion.aside>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

import { NavLink, Link } from 'react-router-dom';
import { useSideBarContext, useUserContext } from '../../Contexts';
import { icons } from '../../Assets/icons';
import { Button } from '..';
import { AnimatePresence, motion } from 'framer-motion';
import { useRef } from 'react';

export default function Sidebar() {
    const { user } = useUserContext();
    const { showSideBar, setShowSideBar } = useSideBarContext();
    const items = [
        { path: '/', name: 'Home', icon: icons.home },
        { path: '/history', name: 'Order History', icon: icons.clock },
    ];

    const systemItems = [
        { path: '/support', name: 'Support', icon: icons.support },
        { path: '/about-us', name: 'About Us', icon: icons.search },
        { path: '/contact-us', name: 'Contact Us', icon: icons.contact },
        { path: '/settings', name: 'Settings', icon: icons.settings },
    ];

    const itemElements = items.map((item) => (
        <NavLink
            key={item.name}
            className={({ isActive }) =>
                `${isActive && 'backdrop-brightness-90'} ${!item.show && 'hidden'} w-full py-2 px-[10px] rounded-md hover:backdrop-brightness-90`
            }
            to={item.path}
        >
            <div className="flex items-center justify-start gap-4">
                <div className="size-[19px] fill-[#2a2a2a]">{item.icon}</div>
                <div>{item.name}</div>
            </div>
        </NavLink>
    ));

    const systemItemElements = systemItems.map((item) => (
        <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
                `${isActive && 'backdrop-brightness-90'} ${!item.show && 'hidden'} w-full py-2 px-[10px] rounded-md hover:backdrop-brightness-90`
            }
        >
            <div className="flex items-center justify-start gap-4">
                <div className="size-[19px] fill-[#202020]">{item.icon}</div>
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
                duration: 0.2,
            },
        },
        exit: {
            x: '-100vw',
            transition: {
                type: 'tween',
                duration: 0.2,
            },
        },
    };

    const backdropVariants = {
        visible: {
            backdropFilter: 'brightness(0.65)',
            transition: {
                duration: 0.2,
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
                    className="fixed inset-0 z-[1000]"
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
                        <div className="w-full px-3 bg-[#f6f6f6] drop-shadow-md flex flex-col items-start justify-start h-full">
                            <div className="h-[60px] gap-5 w-full flex items-center justify-between">
                                {/* hamburgur menu btn */}
                                <Button
                                    btnText={
                                        <div className="size-[20px] fill-[#434343] group-hover:fill-[#4977ec]">
                                            {icons.hamburgur}
                                        </div>
                                    }
                                    onClick={() =>
                                        setShowSideBar((prev) => !prev)
                                    }
                                    title="Close Sidebar"
                                    className="bg-[#ffffff] p-[10px] group rounded-full drop-shadow-md w-fit"
                                />

                                {/* avatar */}
                                <div className="w-full h-full py-3 flex items-center justify-end gap-4">
                                    <Link
                                        to={`/channel/${user?.user_id}`}
                                        className="hover:scale-110 transition-all duration-300"
                                    >
                                        <div className="size-[35px] rounded-full overflow-hidden drop-shadow-md hover:brightness-90">
                                            <img
                                                src={user?.user_avatar}
                                                alt="user avatar"
                                                className="size-full object-cover"
                                            />
                                        </div>
                                    </Link>
                                </div>
                            </div>

                            <hr className="w-full" />

                            <div className="overflow-y-scroll text-[17px] text-black w-full h-[calc(100%-60px)] py-3 flex flex-col items-start justify-between">
                                <div className="w-full flex flex-col gap-1 items-start justify-start">
                                    {itemElements}
                                </div>
                                <div className="w-full flex flex-col gap-1 items-start justify-start">
                                    <hr className="w-full" />
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

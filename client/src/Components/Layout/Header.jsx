import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Button } from '..';
import {
    useUserContext,
    useSideBarContext,
    useSearchContext,
} from '../../Contexts';
import { LOGO } from '../../Constants/constants';
import { useState } from 'react';
import { icons } from '../../Assets/icons';
import { motion } from 'framer-motion';

export default function Header() {
    const { user } = useUserContext();
    const { setShowSideBar } = useSideBarContext();
    const navigate = useNavigate();
    const { search, setSearch } = useSearchContext();
    const [showSearchBar, setShowSearchBar] = useState(false);
    const links = [
        { path: '/', name: 'Home' },
        { path: '/about-us', name: 'About Us' },
        { path: '/support', name: 'Support' },
        { path: '/contact-us', name: 'Contact Us' },
    ];
    const linkElements = links.map((link) => (
        <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
                `${isActive ? 'text-[#4977ec]' : 'text-black'} w-full`
            }
        >
            <div className="w-full text-center">{link.name}</div>
        </NavLink>
    ));

    return (
        <header className="drop-shadow-md fixed top-0 z-[1] w-full bg-[#f6f6f6] text-black h-[60px] px-3 font-medium flex items-center justify-between gap-4">
            <div className="flex items-center justify-center gap-4">
                {/* hamburgur menu btn */}
                <Button
                    btnText={
                        <div className="size-[20px] fill-[#434343] group-hover:fill-[#4977ec]">
                            {icons.hamburgur}
                        </div>
                    }
                    title="Show Sidebar"
                    onClick={() => setShowSideBar((prev) => !prev)}
                    className="bg-[#ffffff] p-[10px] group rounded-full drop-shadow-md w-fit"
                />

                {/* logo */}
                <Link
                    to={'/'}
                    className="flex items-center justify-center gap-3 text-nowrap font-medium text-xl"
                >
                    <div className="overflow-hidden rounded-full size-[40px] drop-shadow-md hover:scale-110 transition-all duration-300">
                        <img
                            src={LOGO}
                            alt="Snack Track Logo"
                            className="object-cover size-full hover:brightness-95"
                        />
                    </div>
                    <div className="hover:scale-110 transition-all duration-300">
                        SnackTrack
                    </div>
                </Link>
            </div>

            {/* links */}
            <div className="hidden lg:flex items-center justify-evenly transition-all ease-in-out w-[50%] max-w-[600px] px-8">
                <motion.div
                    initial={{ x: 0 }}
                    // animate={{ x: showSearchBar ? '-100%' : '0%' }}
                    transition={{ duration: 0.3 }}
                    className="flex w-full"
                >
                    {linkElements}
                </motion.div>
            </div>
            {/* search bar */}
            {showSearchBar && (
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ duration: 0.3 }}
                    className="relative group drop-shadow-md w-[35%]"
                >
                    <input
                        type="text"
                        placeholder="Search here"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                        }}
                        className="w-full bg-white border-[#d5d5d5] border-[0.01rem] indent-8 rounded-full p-2 text-black text-[16px] font-normal placeholder:text-[#525252] outline-none focus:border-[0.1rem] focus:border-[#4977ec]"
                    />
                    <div className="size-[20px] fill-[#434343] group-focus-within:fill-[#4977ec] absolute top-3 left-3">
                        {icons.search}
                    </div>

                    <div className="flex items-center justify-center gap-2 absolute right-1 top-[50%] translate-y-[-50%]">
                        <Button
                            btnText={
                                <div className="size-[20px] group-hover:stroke-[#4977ec] stroke-[#434343]">
                                    {icons.cross}
                                </div>
                            }
                            title="Close"
                            onClick={() => {
                                setShowSearchBar(false);
                            }}
                            className="bg-[#ffffff] p-[6px] group rounded-full drop-shadow-md hover:drop-shadow-md w-fit"
                        />
                    </div>
                </motion.div>
            )}

            <div className="flex items-center justify-center gap-4">
                {/* search btn */}
                {!showSearchBar && (
                    <Button
                        btnText={
                            <div className="size-[20px] group-hover:fill-[#4977ec] fill-[#434343]">
                                {icons.search}
                            </div>
                        }
                        title="Search"
                        onClick={() => {
                            setShowSearchBar((prev) => !prev);
                        }}
                        className="bg-[#ffffff] p-[10px] group rounded-full drop-shadow-md hover:drop-shadow-md w-fit"
                    />
                )}

                {/* order btn */}
                {user.role === 'student' && (
                    <NavLink
                        to={'/order'}
                        className={({ isActive }) => `${isActive && 'hidden'}`}
                    >
                        <Button
                            btnText={
                                <div>
                                    <div className="size-[20px] group-hover:fill-[#4977ec] fill-[#434343]">
                                        {icons.plus}
                                    </div>
                                    <p>Order</p>
                                </div>
                            }
                            title="Order"
                            className="bg-[#ffffff] p-[10px] group rounded-full drop-shadow-md hover:drop-shadow-md w-fit"
                        />
                    </NavLink>
                )}

                {/* login/register btn */}
                {user && user.role !== 'student' && (
                    <div className="flex items-center justify-center gap-4">
                        <Button
                            onClick={() => navigate('/register')}
                            btnText={
                                <div className="flex items-center justify-center gap-2">
                                    <div className="size-[20px] fill-white">
                                        {icons.plus}
                                    </div>
                                    <span>
                                        {user.role === 'contractor'
                                            ? 'Add Student'
                                            : 'Add Contractor'}
                                    </span>
                                </div>
                            }
                            title={
                                user.role === 'contractor'
                                    ? 'Add Student'
                                    : 'Add Contractor'
                            }
                            className="text-white rounded-md py-[5px] w-[140px] h-[35px] bg-[#4977ec] hover:bg-[#3b62c2]"
                        />
                    </div>
                )}
            </div>
        </header>
    );
}

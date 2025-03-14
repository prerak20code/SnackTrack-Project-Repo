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

export default function Searchbar() {
    const { user } = useUserContext();
    const navigate = useNavigate();
    const { search, setSearch } = useSearchContext();
    const options = [
        { path: '/?search=snacks', name: 'Snacks', icon: icons.snack },
        { path: '/?search=packaged', name: 'Packaged', icon: icons.soda },
    ];
    const optionElements = options.map((link) => (
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
        <header className="border fixed top-[60px] z-[10] w-full bg-[#f6f6f6] text-black h-[60px] px-4 font-medium flex items-center justify-between gap-4">
            {/* search bar */}
            <div className="group drop-shadow-md">
                <input
                    type="text"
                    placeholder="Search here"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white border-transparent border-[0.1rem] indent-8 rounded-full p-2 text-black text-[16px] font-normal placeholder:text-[#525252] outline-none focus:border-[#4977ec]"
                />
                <div className="size-[18px] fill-gray-800 group-focus-within:fill-[#4977ec] absolute top-[50%] translate-y-[-50%] left-3">
                    {icons.search}
                </div>
                <div
                    onClick={() => setSearch('')}
                    className="hover:bg-gray-200 rounded-full absolute right-2 p-[5px] cursor-pointer top-[50%] translate-y-[-50%]"
                >
                    <div className="size-[18px] stroke-gray-800">
                        {icons.cross}
                    </div>
                </div>
            </div>

            {user.role !== 'admin' ? (
                <div className="flex items-center justify-center gap-3">
                    <Button
                        btnText={
                            <div className="size-[20px] group-hover:fill-[#4977ec] fill-[#434343]">
                                {icons.cart}
                            </div>
                        }
                        title="View Cart"
                        onClick={() => navigate('/cart')}
                        className="bg-[#ffffff] p-[9px] group rounded-full drop-shadow-md hover:drop-shadow-md w-fit"
                    />
                </div>
            ) : (
                <div className="flex items-center justify-center gap-3">
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
                        className="text-white rounded-md py-[5px] w-fit px-2 h-[35px] bg-[#4977ec] hover:bg-[#3b62c2]"
                    />
                </div>
            )}
        </header>
    );
}

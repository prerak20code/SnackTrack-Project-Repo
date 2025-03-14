import { Link, useNavigate } from 'react-router-dom';
import { Button, Logout } from '..';
import {
    useUserContext,
    useSideBarContext,
    useSearchContext,
} from '../../Contexts';
import { LOGO } from '../../Constants/constants';
import { icons } from '../../Assets/icons';

export default function Header() {
    const { user } = useUserContext();
    const { setShowSideBar } = useSideBarContext();
    const navigate = useNavigate();
    const { search, setSearch } = useSearchContext();

    return (
        <header className="drop-shadow-sm fixed top-0 z-[10] w-full bg-[#f9f9f9] text-black h-[60px] px-4 font-medium flex items-center justify-between gap-8">
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
                    className="bg-[#ffffff] p-[9px] group rounded-full drop-shadow-sm w-fit"
                />

                {/* logo */}
                <Link
                    to={'/'}
                    className="flex items-center justify-center gap-3 text-nowrap font-medium text-xl"
                >
                    <div className="overflow-hidden rounded-full size-[38px] drop-shadow-sm hover:scale-110 transition-all duration-300">
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

            {/* search bar */}
            <div className="w-full max-w-[500px] hidden sm:block group drop-shadow-sm">
                <input
                    type="text"
                    placeholder="Search here"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white border-transparent border-[0.1rem] indent-8 rounded-full p-[5px] text-black text-[16px] font-normal placeholder:text-[#525252] outline-none focus:border-[#4977ec]"
                />
                <div className="size-[16px] fill-gray-800 group-focus-within:fill-[#4977ec] absolute top-[50%] translate-y-[-50%] left-3">
                    {icons.search}
                </div>
                <div
                    onClick={() => setSearch('')}
                    className="hover:bg-gray-100 rounded-full absolute right-2 p-[5px] cursor-pointer top-[50%] translate-y-[-50%]"
                >
                    <div className="size-[18px] stroke-gray-800">
                        {icons.cross}
                    </div>
                </div>
            </div>

            <div className="flex gap-4 items-center">
                {user.role === 'student' ? (
                    <div className="flex items-center justify-center gap-4">
                        <Button
                            btnText={
                                <div className="size-[20px] group-hover:fill-[#4977ec] fill-[#434343]">
                                    {icons.cart}
                                </div>
                            }
                            title="View Cart"
                            onClick={() => navigate('/cart')}
                            className="bg-[#ffffff] p-[9px] group rounded-full drop-shadow-sm w-fit"
                        />
                        <Button
                            btnText={
                                <div className="size-[20px] group-hover:fill-[#4977ec] fill-[#434343]">
                                    {icons.bell}
                                </div>
                            }
                            title="Notifications"
                            onClick={() => {}}
                            className="bg-[#ffffff] p-[9px] group rounded-full drop-shadow-sm w-fit"
                        />
                    </div>
                ) : (
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
                            className="text-white rounded-md w-fit text-nowrap px-3 h-[35px] bg-[#4977ec] hover:bg-[#3b62c2]"
                        />
                    </div>
                )}
                <div
                    className={`hidden ${user.role === 'student' ? 'sm:block' : 'md:block'}`}
                >
                    <Logout />
                </div>
            </div>
        </header>
    );
}

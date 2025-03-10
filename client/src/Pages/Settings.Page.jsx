import { Outlet, NavLink } from 'react-router-dom';
import { Button } from '../Components';
import { usePopupContext, useUserContext } from '../Contexts';
import { icons } from '../Assets/icons';

export default function SettingsPage() {
    const { user } = useUserContext();
    const { setShowPopup, setPopupInfo } = usePopupContext();

    const tabOptions = [
        { name: 'Personal Information', path: '' },
        { name: 'Change Password', path: 'password' },
    ];

    const tabElements = tabOptions.map((option) => (
        <NavLink
            end
            key={option.name}
            to={option.path}
            className={({ isActive }) =>
                `${isActive ? 'border-b-[#4977ec] bg-[#4977ec] text-white' : 'border-b-black bg-[#f9f9f9] text-black'} drop-shadow-md hover:backdrop-brightness-90 rounded-t-md p-[3px] border-b-[0.1rem] w-full text-center text-lg font-medium`
            }
        >
            <div>{option.name}</div>
        </NavLink>
    ));

    return (
        <div className="w-full h-full overflow-scroll">
            <div className="w-full">
                {/* avatar */}
                <div className="relative -top-8 flex gap-2 items-center justify-start">
                    <div className="relative">
                        <div className="rounded-full  overflow-hidden size-[140px] border-[0.5rem] border-white ">
                            <img
                                alt="user avatar"
                                src={user.user_avatar}
                                className="size-full object-cover drop-shadow-md"
                            />
                        </div>

                        <div className="">
                            <Button
                                btnText={
                                    <div className="size-[35px] fill-[#202020]">
                                        {icons.upload}
                                    </div>
                                }
                                onClick={() => {
                                    setShowPopup(true);
                                    setPopupInfo({ type: 'updateAvatar' });
                                }}
                                className="drop-shadow-md absolute top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] rounded-md p-1 bg-[#b5b4b4] border-[0.01rem] border-[#bbbbbb] bg-opacity-80 stroke-black fill-[#4d4d4d]"
                            />
                        </div>
                    </div>

                    {/* user info*/}
                    <div className="flex flex-col items-start justify-center gap-1">
                        <div className="text-3xl font-medium">
                            {user.user_firstName} {user.user_lastName}
                        </div>
                        <div className="text-xl text-[#151515]">
                            @{user.user_name}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-evenly w-full gap-6">
                {tabElements}
            </div>

            <hr className="mt-4 mb-2" />

            <Outlet />
        </div>
    );
}

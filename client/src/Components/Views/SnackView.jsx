import { useNavigate } from 'react-router-dom';
import { Button } from '..';
import { icons } from '../../Assets/icons';
import { LOGO } from '../../Constants/constants';

export default function SnackView({ snack, reference, children }) {
    const { _id, image, name, price, info, createdAt, isAvailable } = snack;
    const navigate = useNavigate();

    return (
        <div
            ref={reference}
            onClick={() => {}}
            className="min-w-[200px] flex flex-col items-start justify-center gap-6 relative cursor-pointer w-full p-4 bg-white drop-shadow-lg rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-105"
        >
            {/* Image */}
            <div className="h-[200px] w-full rounded-xl overflow-hidden drop-shadow-md">
                <img
                    alt="snack image"
                    src={image || LOGO}
                    className="h-full w-full object-cover"
                />
            </div>

            <div className="flex flex-col gap-3 w-full">
                {/* Availability and Price */}
                <div className="flex items-start justify-between gap-4 w-full">
                    {/* Availability */}
                    <div className="hover:cursor-text flex items-center justify-center gap-2 bg-white drop-shadow-md rounded-full w-fit px-3 py-1">
                        <div
                            className={`size-[9px] ${isAvailable ? 'fill-green-500' : 'fill-red-500'}`}
                        >
                            {icons.dot}
                        </div>
                        <span
                            className={`font-semibold ${isAvailable ? 'text-green-500' : 'text-red-500'}`}
                        >
                            {isAvailable ? 'Available' : 'Not Available'}
                        </span>
                    </div>

                    {/* Price */}
                    <p className="hover:cursor-text font-bold flex items-center justify-center bg-white drop-shadow-md rounded-full w-fit px-3 py-1">
                        Rs. {price}
                    </p>
                </div>

                <div className="flex flex-col gap-1 w-full">
                    {/* Name */}
                    <p className="w-fit hover:cursor-text text-[24px] font-bold text-gray-900 text-ellipsis line-clamp-1">
                        {name}
                    </p>

                    {/* Info */}
                    {!info && (
                        <p className="hover:cursor-text text-[14px] text-gray-600 text-ellipsis line-clamp-2">
                            {info} Lorem ipsum dolor sit amet consectetur
                            adipisicing elit. Magnam deleniti unde assumenda,
                            consequuntur sit ducimus aspernatur dignissimos
                            dolor non! Ea nisi asperiores necessitatibus atque
                            fugit aliquam quae quas? Quo, eius.
                        </p>
                    )}
                </div>

                {/* Buttons */}
                <div className="w-full flex items-center justify-end gap-3 text-white mt-1">
                    <Button
                        btnText={
                            <div className="flex items-center justify-center gap-2">
                                <span>Add to Cart</span>
                                <div className="size-[20px] fill-white">
                                    {icons.plus}
                                </div>
                            </div>
                        }
                        onClick={() => {}}
                        className="rounded-lg px-[10px] py-[6px] bg-[#4977ec] hover:bg-[#3b62c2]"
                    />
                    <Button
                        btnText={
                            <div className="flex items-center justify-center gap-2">
                                <span>Order</span>
                                <div className="size-[20px] fill-white">
                                    {icons.rightArrow}
                                </div>
                            </div>
                        }
                        onClick={() => {}}
                        className="rounded-lg px-[10px] py-[6px] bg-[#4977ec] hover:bg-[#3b62c2]"
                    />
                </div>
            </div>

            {children}
        </div>
    );
}

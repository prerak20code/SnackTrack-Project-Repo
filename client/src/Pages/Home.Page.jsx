import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Snacks, PackagedItems } from '../Components';
import { icons } from '../Assets/icons';

export default function HomePage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const filter = searchParams.get('filter') || 'snacks'; // Default to 'snacks'
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null); 

    const options = [
        { value: 'snacks', label: 'Snacks', icon: icons.snack },
        { value: 'packaged', label: 'Packaged', icon: icons.soda },
    ];

    const handleOptionClick = (value) => {
        setSearchParams({ filter: value });
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isDropdownOpen]);

    return (
        <div>
            {/* Custom Dropdown Filter */}
            <div className="flex justify-end mb-6">
                <div className="relative inline-block w-48" ref={dropdownRef}>
                    {/* Dropdown Button */}
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full flex items-center cursor-pointer justify-between bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 rounded-lg shadow-sm text-lg text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#4977ec] focus:border-[#4977ec] transition-all duration-200"
                    >
                        <div className="flex items-center gap-[10px]">
                            {options.find((opt) => opt.value === filter)
                                ?.icon && (
                                <div className="size-[16px] fill-gray-700">
                                    {
                                        options.find(
                                            (opt) => opt.value === filter
                                        )?.icon
                                    }
                                </div>
                            )}
                            <span>
                                {
                                    options.find((opt) => opt.value === filter)
                                        ?.label
                                }
                            </span>
                        </div>
                        <div
                            className={`size-[15px] fill-gray-700 transition-all duration-300 ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                        >
                            {icons.arrowDown}
                        </div>
                    </button>

                    {/* Dropdown Options */}
                    {isDropdownOpen && (
                        <div className="absolute z-10 mt-2 w-full cursor-pointer bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                            {options.map((option) => (
                                <div
                                    key={option.value}
                                    onClick={() =>
                                        handleOptionClick(option.value)
                                    }
                                    className="flex items-center gap-[10px] px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                                >
                                    <div className="size-[16px] fill-gray-700">
                                        {option.icon}
                                    </div>
                                    <span>{option.label}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Render Based on Filter */}
            <div className="px-8 pb-8">
                {filter === 'snacks' ? <Snacks /> : <PackagedItems />}
            </div>
        </div>
    );
}

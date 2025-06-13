import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { icons } from '../../Assets/icons';
import { useDarkMode } from '../../Contexts/DarkMode';

export default function Filter({
    options,
    defaultOption,
    queryParamName = 'filter',
}) {
    const [searchParams, setSearchParams] = useSearchParams();
    const filter = searchParams.get(queryParamName) || defaultOption;
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { isDarkMode } = useDarkMode();

    const handleOptionClick = (value) => {
        const params = new URLSearchParams(searchParams);
        if (value === defaultOption) {
            params.delete(queryParamName); // Remove query param if default option is selected
        } else {
            params.set(queryParamName, value); // Set query param for valid selections
        }
        setSearchParams(params);
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            window.addEventListener('mousedown', handleClickOutside);
            window.addEventListener('touchstart', handleClickOutside);
        }

        return () => {
            window.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isDropdownOpen]);

    return (
        <div className="w-fit">
            <div className="relative inline-block w-full" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`w-full flex items-center cursor-pointer justify-between gap-2 px-3 py-2 rounded-lg shadow-sm text-lg leading-tight focus:outline-none focus:ring-2 focus:ring-[#4977ec] transition-all duration-200 ${
                        isDarkMode
                            ? 'bg-gray-800 border border-gray-700 hover:border-gray-600 text-white'
                            : 'bg-white border border-gray-300 hover:border-gray-400 text-gray-700'
                    }`}
                >
                    <div className="flex items-center gap-[10px]">
                        {options.find((opt) => opt.value === filter)?.icon && (
                            <div
                                className={`size-[16px] ${
                                    isDarkMode ? 'fill-white' : 'fill-gray-900'
                                }`}
                            >
                                {
                                    options.find((opt) => opt.value === filter)
                                        ?.icon
                                }
                            </div>
                        )}
                        <span>
                            {options.find((opt) => opt.value === filter)?.label}
                        </span>
                    </div>
                    <div
                        className={`size-[14px] transition-all duration-300 ${
                            isDarkMode ? 'fill-white' : 'fill-gray-800'
                        } ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                    >
                        {icons.arrowDown}
                    </div>
                </button>

                {isDropdownOpen && (
                    <div
                        className={`absolute z-10 mt-2 w-full cursor-pointer rounded-lg shadow-lg overflow-hidden ${
                            isDarkMode
                                ? 'bg-gray-800 border border-gray-700'
                                : 'bg-white border border-gray-300'
                        }`}
                    >
                        {options.map(
                            (option) =>
                                option.value !== filter && (
                                    <div
                                        key={option.value}
                                        onClick={() =>
                                            handleOptionClick(option.value)
                                        }
                                        className={`flex items-center gap-[10px] px-3 py-2 cursor-pointer transition-colors duration-200 ${
                                            isDarkMode
                                                ? 'hover:bg-gray-700 text-white'
                                                : 'hover:bg-gray-100 text-gray-900'
                                        }`}
                                    >
                                        {option.icon && (
                                            <div
                                                className={`size-[16px] ${
                                                    isDarkMode
                                                        ? 'fill-white'
                                                        : 'fill-gray-900'
                                                }`}
                                            >
                                                {option.icon}
                                            </div>
                                        )}
                                        <span>{option.label}</span>
                                    </div>
                                )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

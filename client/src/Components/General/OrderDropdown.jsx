import { useState, useEffect, useRef } from 'react';
import { icons } from '../../Assets/icons';
import { useDarkMode } from '../../Contexts/DarkMode';

export default function OrderDropdown({
    options,
    defaultOption = '',
    onChange,
}) {
    const [selectedValue, setSelectedValue] = useState(defaultOption);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { isDarkMode } = useDarkMode();

    // Sync external defaultOption with internal state
    useEffect(() => {
        setSelectedValue(defaultOption);
    }, [defaultOption]);

    const handleOptionClick = (value) => {
        if (value === selectedValue) return;

        setSelectedValue(value);
        if (typeof onChange === 'function') {
            onChange(value);
        } else {
            console.warn('onChange prop is not a function:', onChange);
        }
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
        <div className="w-full mb-0">
            <div className="relative inline-block w-full" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`w-full font-medium flex items-center gap-2 cursor-pointer justify-between px-2 py-1 rounded-md text-[14px] leading-tight focus:outline-none focus:ring-2 focus:ring-[#4977ec] transition-all duration-200 ${
                        isDarkMode
                            ? 'bg-gray-700/50 border-[0.01rem] border-gray-600 hover:border-gray-500 text-white'
                            : 'bg-[#e0e0e010] border-[0.01rem] border-gray-500 hover:border-gray-400 text-gray-700'
                    }`}
                >
                    {options.find((opt) => opt.value === selectedValue)
                        ?.label ||
                        options[0]?.label ||
                        'Select'}
                    <div
                        className={`size-[10px] transition-all duration-300 ${
                            isDarkMode ? 'fill-white' : 'fill-gray-800'
                        } ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                    >
                        {icons.arrowDown}
                    </div>
                </button>

                {isDropdownOpen && (
                    <div
                        className={`text-[14px] absolute z-10 mt-2 w-full cursor-pointer rounded-md shadow-sm overflow-hidden max-h-[200px] overflow-y-auto ${
                            isDarkMode
                                ? 'bg-gray-800 border border-gray-700'
                                : 'bg-white border border-gray-300'
                        }`}
                    >
                        {options.map((option) => (
                            <div
                                key={option.value}
                                onClick={() => handleOptionClick(option.value)}
                                className={`px-2 py-1 transition-colors duration-200 ${
                                    option.value === selectedValue
                                        ? isDarkMode
                                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                            : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                        : isDarkMode
                                          ? 'text-white hover:bg-gray-700'
                                          : 'text-gray-900 hover:bg-gray-100'
                                }`}
                            >
                                {option.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

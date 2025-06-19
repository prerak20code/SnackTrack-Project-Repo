import React, { useState, useEffect } from 'react';
import { Button } from '..';
import { icons } from '../../Assets/icons';
import { useDarkMode } from '../../Contexts/DarkMode';

export default function SelectTablePopup({ onConfirm, onCancel }) {
    const [selectedTable, setSelectedTable] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const { isDarkMode } = useDarkMode();

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleConfirm = () => {
        if (!selectedTable) {
            alert('Please select a table');
            return;
        }
        onConfirm(selectedTable);
    };

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            if (onCancel) onCancel(); // ✅ Proper cancel action
        }, 250);
    };

    const tableOptions = [
        ...Array.from({ length: 5 }, (_, i) => `T${i + 1}`),
        'At the Counter',
        'Guest Room',
    ];

    return (
        <>
            <style jsx>{`
                @keyframes backdropFadeIn {
                    from {
                        opacity: 0;
                        backdrop-filter: blur(0px);
                    }
                    to {
                        opacity: 1;
                        backdrop-filter: blur(8px);
                    }
                }

                @keyframes backdropFadeOut {
                    from {
                        opacity: 1;
                        backdrop-filter: blur(8px);
                    }
                    to {
                        opacity: 0;
                        backdrop-filter: blur(0px);
                    }
                }

                @keyframes modalSlideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                @keyframes modalSlideDown {
                    from {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                    to {
                        opacity: 0;
                        transform: translateY(20px) scale(0.95);
                    }
                }

                @keyframes iconPop {
                    0% {
                        transform: scale(0) rotate(-180deg);
                    }
                    80% {
                        transform: scale(1.1) rotate(0deg);
                    }
                    100% {
                        transform: scale(1) rotate(0deg);
                    }
                }

                @keyframes contentStagger {
                    from {
                        opacity: 0;
                        transform: translateY(15px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes buttonHover {
                    0% {
                        transform: translateY(0);
                    }
                    100% {
                        transform: translateY(-2px);
                    }
                }

                .backdrop-enter {
                    animation: backdropFadeIn 0.25s ease-out;
                }

                .backdrop-exit {
                    animation: backdropFadeOut 0.25s ease-out;
                }

                .modal-enter {
                    animation: modalSlideUp 0.3s
                        cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                .modal-exit {
                    animation: modalSlideDown 0.25s ease-in;
                }

                .icon-pop {
                    animation: iconPop 0.6s
                        cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.1s both;
                }

                .content-1 {
                    animation: contentStagger 0.4s ease-out 0.2s both;
                }
                .content-2 {
                    animation: contentStagger 0.4s ease-out 0.3s both;
                }
                .content-3 {
                    animation: contentStagger 0.4s ease-out 0.4s both;
                }

                .custom-select {
                    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
                    background-position: right 12px center;
                    background-repeat: no-repeat;
                    background-size: 16px;
                    padding-right: 40px;
                }

                .button-hover:hover {
                    animation: buttonHover 0.2s ease-out forwards;
                }

                .glass-effect {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    box-shadow:
                        0 20px 25px -5px rgba(0, 0, 0, 0.1),
                        0 10px 10px -5px rgba(0, 0, 0, 0.04),
                        inset 0 1px 0 rgba(255, 255, 255, 0.4);
                }
            `}</style>

            <div
                className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
                    isVisible ? 'backdrop-enter' : 'backdrop-exit'
                }`}
                style={{
                    background: isDarkMode
                        ? 'rgba(0, 0, 0, 0.5)'
                        : 'rgba(0, 0, 0, 0.1)',
                    backdropFilter: isVisible ? 'blur(8px)' : 'blur(0px)',
                }}
            >
                <div
                    className={`relative w-full max-w-md rounded-2xl overflow-hidden ${
                        isVisible ? 'modal-enter' : 'modal-exit'
                    } ${
                        isDarkMode
                            ? 'bg-gray-800 border border-gray-700'
                            : 'glass-effect'
                    }`}
                >
                    <div className="relative px-6 pt-6">
                        <Button
                            btnText={
                                <svg
                                    className={`w-5 h-5 ${
                                        isDarkMode
                                            ? 'text-white'
                                            : 'text-gray-600'
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            }
                            onClick={handleClose}
                            className={`absolute top-4 right-4 p-2 rounded-full transition-colors duration-200 ${
                                isDarkMode
                                    ? 'hover:bg-gray-700'
                                    : 'hover:bg-gray-100'
                            }`}
                        />
                    </div>

                    <div className="px-6 pb-6">
                        <div className="icon-pop w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <svg
                                className="w-8 h-8 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2.5}
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                />
                            </svg>
                        </div>

                        <div className="text-center mb-6 content-1">
                            <h2
                                className={`text-2xl font-bold mb-2 ${
                                    isDarkMode ? 'text-white' : 'text-gray-900'
                                }`}
                            >
                                Select Your Table
                            </h2>
                            <p
                                className={
                                    isDarkMode
                                        ? 'text-gray-300'
                                        : 'text-gray-600'
                                }
                            >
                                Choose a table for your dining experience
                            </p>
                        </div>

                        <div className="mb-6 content-2">
                            <label
                                className={`block text-sm font-semibold mb-3 ${
                                    isDarkMode
                                        ? 'text-gray-200'
                                        : 'text-gray-700'
                                }`}
                            >
                                Available Tables
                            </label>
                            <select
                                value={selectedTable}
                                onChange={(e) =>
                                    setSelectedTable(e.target.value)
                                }
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 custom-select appearance-none font-medium ${
                                    isDarkMode
                                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                        : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
                                }`}
                            >
                                <option
                                    value=""
                                    disabled
                                    className={
                                        isDarkMode ? 'bg-gray-700' : 'bg-white'
                                    }
                                >
                                    Choose a table...
                                </option>
                                {tableOptions.map((table) => (
                                    <option
                                        key={table}
                                        value={table}
                                        className={
                                            isDarkMode
                                                ? 'bg-gray-700'
                                                : 'bg-white'
                                        }
                                    >
                                        {table}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-3 content-3">
                            <Button
                                btnText="Place Order"
                                onClick={handleConfirm}
                                disabled={!selectedTable}
                                className={`flex-1 px-6 py-3 font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl button-hover ${
                                    selectedTable
                                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
                                        : isDarkMode
                                          ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

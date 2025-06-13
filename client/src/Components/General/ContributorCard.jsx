import React from 'react';
import { useDarkMode } from '../../Contexts/DarkMode';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { icons } from '../../Assets/icons';
import PropTypes from 'prop-types';

export default function ContributorCard({ contributor }) {
    const { isDarkMode } = useDarkMode();
    const { name, role, bio, image, socials } = contributor;

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12 }}
            className={`relative backdrop-blur-lg border shadow-xl rounded-2xl overflow-hidden p-6 flex flex-col items-center gap-4 max-w-sm ${
                isDarkMode
                    ? 'bg-gray-800/20 border-gray-700/40'
                    : 'bg-white/20 border-white/40'
            }`}
        >
            <div
                className={`w-32 h-32 overflow-hidden rounded-full border-4 shadow-md ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-300'
                }`}
            >
                <img
                    src={image}
                    alt={`${name} profile`}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="text-center">
                <h3
                    className={`text-2xl font-bold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}
                >
                    {name}
                </h3>
                <p className="text-blue-600 font-semibold text-sm">{role}</p>
                <p
                    className={`text-sm mt-2 line-clamp-3 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}
                >
                    {bio}
                </p>
            </div>

            <div className="flex gap-4 mt-4">
                {Object.entries(socials).map(([platform, url]) =>
                    url ? (
                        <Link key={platform} to={url} target="_blank">
                            <motion.div
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                className={`p-2 rounded-full shadow-md transition ${
                                    isDarkMode
                                        ? 'bg-gray-700 hover:bg-gray-600'
                                        : 'bg-gray-200 hover:bg-gray-300'
                                }`}
                            >
                                <div
                                    className={`size-5 ${
                                        isDarkMode ? 'fill-white' : ''
                                    }`}
                                >
                                    {icons[platform]}
                                </div>
                            </motion.div>
                        </Link>
                    ) : null
                )}
            </div>

            <div className="absolute inset-0 rounded-2xl bg-white/5 blur-lg opacity-50 pointer-events-none" />
        </motion.div>
    );
}

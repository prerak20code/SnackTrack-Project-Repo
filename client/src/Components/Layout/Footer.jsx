import { Link } from 'react-router-dom';
import { icons } from '../../Assets/icons';
import { Button } from '..';
import { useState } from 'react';
import { CONTRIBUTORS, LOGO } from '../../Constants/constants';
import toast from 'react-hot-toast';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';
import { useDarkMode } from '../../Contexts/DarkMode';
const socialIcons = {
    github: <FaGithub />,
    linkedin: <FaLinkedin />,
    twitter: <FaTwitter />,
    instagram: <FaInstagram />,
};
export default function Footer() {
    const [feedback, setFeedback] = useState({ content: '', email: '' });
    const { isDarkMode } = useDarkMode(); // Add this line

    // Social media icons
    const socials = {
        github: 'https://github.com/',
        linkedin: 'https://linkedin.com/in/',
        twitter: 'https://twitter.com/',
        instagram: 'https://instagram.com/',
    };

    const socialElements = Object.entries(socials).map(([platform, url]) => (
        <a key={platform} href={url} target="_blank" rel="noopener noreferrer">
            <div
                className={`p-[6px] rounded-full drop-shadow-sm transition-colors duration-300 w-fit
            ${
                isDarkMode
                    ? 'bg-gray-800 hover:bg-gray-700 text-white'
                    : 'bg-white hover:bg-[#d4d4d4] text-black'
            }`}
            >
                <div className="size-[16px]">{socialIcons[platform]}</div>
            </div>
        </a>
    ));

    // Footer links
    const links = [
        { path: '/', name: 'Home' },
        { path: '/support', name: 'Support' },
        { path: '/about-us', name: 'About Us' },
        { path: '/contact-us', name: 'Contact Us' },
    ];

    const linkElements = links.map((link) => (
        <p key={link.name} className="text-center">
            <Link
                to={link.path}
                className="hover:text-[#4977ec] text-[15px] hover:underline transition-colors duration-300"
            >
                {link.name}
            </Link>
        </p>
    ));

    function handleChange(e) {
        const { name, value } = e.target;
        setFeedback((prev) => ({ ...prev, [name]: value }));
    }

    // Submit feedback
    function submitFeedback(e) {
        e.preventDefault();
        setFeedback('');
        toast.success('Feedback Submitted Successfully 🤗');
    }

    return (
        <footer
            className={`mt-auto w-full p-6 ${
                isDarkMode
                    ? 'bg-gray-900 text-white'
                    : 'bg-[#f9f9f9] text-black'
            }`}
        >
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-12">
                {/* Logo and Tagline */}
                <div className="flex flex-col gap-4">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="size-[50px] rounded-full overflow-hidden drop-shadow-sm">
                            <img
                                src={LOGO}
                                alt="Snack Track Logo"
                                className="object-cover size-full"
                            />
                        </div>
                        <div
                            className={`font-semibold text-xl ${isDarkMode ? 'text-white' : 'text-black'}`}
                        >
                            Snack Track
                        </div>
                    </Link>
                    <p
                        className={`text-sm max-w-[250px] ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                    >
                        Generalized, Transparent & Secure.
                    </p>
                </div>

                {/* Quick Links */}
                <div className="flex flex-col gap-4">
                    <p
                        className={`text-center font-semibold text-[18px] underline underline-offset-2 ${isDarkMode ? 'text-white' : 'text-black'}`}
                    >
                        Quick Links
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {linkElements}
                    </div>
                </div>

                {/* Feedback Form */}
                <form
                    onSubmit={submitFeedback}
                    className="flex flex-col gap-4 max-w-[350px] w-full"
                >
                    <p
                        className={`text-center font-semibold text-[18px] underline underline-offset-2 ${isDarkMode ? 'text-white' : 'text-black'}`}
                    >
                        Provide Feedback
                    </p>
                    <div className="flex flex-col items-center w-full gap-2">
                        <div>
                            <input
                                type="text"
                                name="content"
                                placeholder="Your Feedback..."
                                value={feedback.content}
                                onChange={handleChange}
                                className={`flex-1 shadow-sm border rounded-lg px-3 h-[32px] text-sm focus:outline-none ${
                                    isDarkMode
                                        ? 'bg-gray-800 border-gray-700 text-white focus:border-[#4977ec]'
                                        : 'bg-white border-gray-300 text-black focus:border-[#4977ec]'
                                }`}
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={feedback.email}
                                onChange={handleChange}
                                className={`flex-1 shadow-sm border rounded-lg px-3 h-[32px] text-sm focus:outline-none ${
                                    isDarkMode
                                        ? 'bg-gray-800 border-gray-700 text-white focus:border-[#4977ec]'
                                        : 'bg-white border-gray-300 text-black focus:border-[#4977ec]'
                                }`}
                            />
                        </div>
                        <Button
                            btnText="Submit"
                            type="submit"
                            className="bg-[#4977ec] hover:bg-[#3b62c2] text-white px-3 w-fit h-[32px] rounded-md transition-colors duration-300"
                        />
                    </div>
                </form>
            </div>

            {/* Divider */}
            <hr
                className={`my-6 ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}
            />

            {/* Copyright and Social Links */}
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <p
                    className={`text-sm text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                >
                    &copy; 2024 Snack Track. All rights reserved.
                </p>
                <div className="flex items-center gap-4">{socialElements}</div>
            </div>
        </footer>
    );
}

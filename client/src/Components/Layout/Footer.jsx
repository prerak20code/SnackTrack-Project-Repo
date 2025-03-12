import { Link } from 'react-router-dom';
import { icons } from '../../Assets/icons';
import { Button } from '..';
import { useState } from 'react';
import { CONTRIBUTORS, LOGO } from '../../Constants/constants';
import toast from 'react-hot-toast';

export default function Footer() {
    const [feedback, setFeedback] = useState('');

    // Social media icons
    const socialElements = Object.entries(CONTRIBUTORS[0].socials).map(
        ([platform, url]) => (
            <Link key={platform} to={url} target="_blank">
                <div className="bg-[#eaeaea] p-2 rounded-full drop-shadow-md hover:bg-[#d4d4d4] transition-colors duration-300 w-fit">
                    <div className="size-[18px] sm:size-[20px] lg:size-[22px]">
                        {icons[platform]}
                    </div>
                </div>
            </Link>
        )
    );

    // Footer links
    const links = [
        { path: '/', name: 'Home' },
        { path: '/support', name: 'Support' },
        { path: '/about-us', name: 'About Us' },
        { path: '/order', name: 'Order Now' },
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

    // Submit feedback
    function submitFeedback(e) {
        e.preventDefault();
        setFeedback('');
        toast.success('Feedback Submitted Successfully 🤗');
    }

    return (
        <footer className="px-6 py-8 bg-[#f6f6f6]">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12">
                {/* Logo and Tagline */}
                <div className="flex flex-col gap-4">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="size-[50px] rounded-full overflow-hidden drop-shadow-md">
                            <img
                                src={LOGO}
                                alt="Snack Track Logo"
                                className="object-cover size-full"
                            />
                        </div>
                        <div className="text-black font-semibold text-xl">
                            Snack Track
                        </div>
                    </Link>
                    <p className="text-gray-600 text-sm max-w-[250px]">
                        Generalized, Transparent & Secure.
                    </p>
                </div>

                {/* Quick Links */}
                <div className="flex flex-col gap-4">
                    <p className="text-black font-semibold text-lg underline underline-offset-4">
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
                    <p className="text-black font-semibold text-lg underline underline-offset-4">
                        Provide Feedback
                    </p>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Your feedback..."
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-[#4977ec] focus:outline-none"
                        />
                        <Button
                            btnText="Submit"
                            type="submit"
                            className="bg-[#4977ec] hover:bg-[#3b62c2] text-white px-4 py-2 rounded-lg transition-colors duration-300"
                        />
                    </div>
                </form>
            </div>

            {/* Divider */}
            <hr className="my-6 border-gray-300" />

            {/* Copyright and Social Links */}
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-gray-600 text-sm text-center">
                    &copy; 2024 Snack Track. All rights reserved.
                </p>
                <div className="flex items-center gap-4">{socialElements}</div>
            </div>
        </footer>
    );
}

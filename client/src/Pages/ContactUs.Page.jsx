import { Link } from 'react-router-dom';
import { Button } from '../Components';
import { useState } from 'react';
import { icons } from '../Assets/icons';
import { EMAIL, CONTACTNUMBER } from '../Constants/constants';
import { useDarkMode } from '../Contexts/DarkMode';

import toast from 'react-hot-toast';

export default function ContactUsPage() {
    const [inputs, setInputs] = useState({ email: '', feedback: '' });
    const { isDarkMode } = useDarkMode();

    function handleChange(e) {
        const { name, value } = e.target;
        setInputs((prev) => ({ ...prev, [name]: value }));
    }

    function submitFeedback(e) {
        e.preventDefault();
        setInputs({ feedback: '', email: '' });
        toast.success('Feedback Submitted Successfully 🤗');
    }

    function copyEmail() {
        window.navigator.clipboard.writeText(EMAIL);
        toast.success('Email Copied to Clipboard 🤗');
    }

    return (
        <div
            className={`w-full min-h-screen ${
                isDarkMode ? 'bg-gray-900' : 'bg-white'
            }`}
        >
            {/* Hero Section */}
            <section
                className={`w-full shadow-md rounded-xl py-10 px-8 md:px-16 ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}
            >
                <h1
                    className={`text-4xl font-bold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}
                >
                    Contact Us
                </h1>
                <p
                    className={`mt-4 text-lg max-w-3xl ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                >
                    We're here to help! Whether you need support, have feedback,
                    or suggestions, feel free to reach out.
                </p>
            </section>

            {/* Grid Layout */}
            <div className="w-full px-8 md:px-16 py-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Contact Info Cards */}
                <div className="flex flex-col gap-8">
                    <div
                        className={`shadow-md p-6 rounded-xl ${
                            isDarkMode ? 'bg-gray-800' : 'bg-white'
                        }`}
                    >
                        <h2
                            className={`text-2xl font-bold mb-3 ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}
                        >
                            👥 Technical Support
                        </h2>
                        <p
                            className={
                                isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }
                        >
                            Need help with{' '}
                            <Link
                                to="/"
                                className="text-[#4977ec] font-semibold hover:underline"
                            >
                                Snack Track
                            </Link>{' '}
                            or facing technical issues? Visit our{' '}
                            <Link
                                to="/support"
                                className="text-[#4977ec] font-semibold hover:underline"
                            >
                                Support Page
                            </Link>{' '}
                            for troubleshooting tips and direct assistance.
                        </p>
                    </div>

                    {/* FAQs */}
                    <div
                        className={`shadow-md p-6 rounded-xl ${
                            isDarkMode ? 'bg-gray-800' : 'bg-white'
                        }`}
                    >
                        <h2
                            className={`text-2xl font-bold mb-3 ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}
                        >
                            📚 Frequently Asked Questions
                        </h2>
                        <p
                            className={
                                isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }
                        >
                            Have a question? Check out our{' '}
                            <Link
                                to="/faqs"
                                className="text-[#4977ec] font-semibold hover:underline"
                            >
                                FAQ page
                            </Link>{' '}
                            for quick answers.
                        </p>
                    </div>

                    {/* Contact Information */}
                    <div
                        className={`shadow-md p-6 rounded-xl ${
                            isDarkMode ? 'bg-gray-800' : 'bg-white'
                        }`}
                    >
                        <h2
                            className={`text-2xl font-bold mb-3 ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}
                        >
                            {' '}
                            Contact Information
                        </h2>
                        <div className="flex flex-col gap-4">
                            {/* Email */}
                            <div className="flex items-center gap-4">
                                <div
                                    className={`p-2 rounded-full ${
                                        isDarkMode
                                            ? 'bg-gray-700'
                                            : 'bg-gray-100'
                                    }`}
                                >
                                    <div
                                        className={`size-5 ${
                                            isDarkMode
                                                ? 'fill-white'
                                                : 'fill-black'
                                        }`}
                                    >
                                        {icons.email}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <p
                                        className={
                                            isDarkMode
                                                ? 'text-gray-300'
                                                : 'text-gray-700'
                                        }
                                    >
                                        {EMAIL}
                                    </p>
                                    <button
                                        onClick={copyEmail}
                                        className={`p-1 rounded-full group ${
                                            isDarkMode
                                                ? 'hover:bg-gray-700'
                                                : 'hover:bg-gray-100'
                                        }`}
                                    >
                                        <div className="size-5 fill-[#4977ec] group-hover:fill-[#3b62c2]">
                                            {icons.clipboard}
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-center gap-4">
                                <div
                                    className={`p-2 rounded-full ${
                                        isDarkMode
                                            ? 'bg-gray-700'
                                            : 'bg-gray-100'
                                    }`}
                                >
                                    <div
                                        className={`size-5 ${
                                            isDarkMode
                                                ? 'fill-white'
                                                : 'fill-black'
                                        }`}
                                    >
                                        {' '}
                                        {icons.contact}
                                    </div>
                                </div>
                                <p
                                    className={
                                        isDarkMode
                                            ? 'text-gray-300'
                                            : 'text-gray-700'
                                    }
                                >
                                    {CONTACTNUMBER}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section - Feedback Form */}
                <div>
                    <div
                        className={`shadow-md p-6 rounded-xl ${
                            isDarkMode ? 'bg-gray-800' : 'bg-white'
                        }`}
                    >
                        <h2
                            className={`text-2xl font-bold mb-3 ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}
                        >
                            🌟 Feedback & Suggestions
                        </h2>
                        <p
                            className={
                                isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }
                        >
                            Have ideas on how we can improve? We'd love to hear
                            from you! Share your thoughts to help make{' '}
                            <Link
                                to="/"
                                className="text-[#4977ec] font-semibold hover:underline"
                            >
                                Snack Track
                            </Link>{' '}
                            even better.
                        </p>
                    </div>

                    {/* Feedback Form */}
                    <form
                        onSubmit={submitFeedback}
                        className={`mt-6 px-6 py-5 pt-2 rounded-xl shadow-md ${
                            isDarkMode ? 'bg-gray-800' : 'bg-white'
                        }`}
                    >
                        {/* Email Input */}
                        <div className="mb-1">
                            <div
                                className={`z-[1] ml-2 px-2 w-fit relative top-3 font-medium ${
                                    isDarkMode
                                        ? 'bg-gray-800 text-gray-300'
                                        : 'bg-white text-gray-900'
                                }`}
                            >
                                <label htmlFor="email">
                                    <span className="text-red-500">*</span>{' '}
                                    Email
                                </label>
                            </div>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={inputs.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className={`shadow-md py-3 rounded-md indent-3 w-full border-[0.01rem] transition-colors ${
                                    isDarkMode
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400'
                                        : 'bg-white border-gray-500 text-black placeholder:text-gray-500'
                                }`}
                                required
                            />
                            <p
                                className={`text-sm mt-1 ${
                                    isDarkMode
                                        ? 'text-gray-400'
                                        : 'text-gray-500'
                                }`}
                            >
                                {' '}
                                This email will be sent along with your
                                feedback.
                            </p>
                        </div>

                        {/* Feedback Input */}
                        <div className="mb-4">
                            <div
                                className={`z-[1] ml-2 px-2 w-fit relative top-3 font-medium ${
                                    isDarkMode
                                        ? 'bg-gray-800 text-gray-300'
                                        : 'bg-white text-gray-900'
                                }`}
                            >
                                <label htmlFor="feedback">
                                    <span className="text-red-500">*</span>{' '}
                                    Feedback / Suggestion
                                </label>
                            </div>
                            <textarea
                                name="feedback"
                                id="feedback"
                                value={inputs.feedback}
                                onChange={handleChange}
                                placeholder="Let us know how we're doing!"
                                className={`shadow-md py-3 rounded-md indent-3 w-full border-[0.01rem] transition-colors ${
                                    isDarkMode
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400'
                                        : 'bg-white border-gray-500 text-black placeholder:text-gray-500'
                                }`}
                                rows="4"
                                required
                            />
                        </div>

                        <Button
                            btnText="Submit"
                            type="submit"
                            className="w-full bg-[#4977ec] hover:bg-[#3b62c2] text-white py-2 rounded-md"
                        />
                    </form>
                </div>
            </div>
        </div>
    );
}

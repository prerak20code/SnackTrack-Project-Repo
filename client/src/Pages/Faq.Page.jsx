import { useState } from 'react';
import { icons } from '../Assets/icons';
import { useDarkMode } from '../Contexts/DarkMode';

export default function FAQpage() {
    const [expanded, setExpanded] = useState(null);
    const { isDarkMode } = useDarkMode();

    const toggleExpand = (index) => {
        setExpanded(expanded === index ? null : index);
    };

    const faqs = [
        {
            question: 'What is the purpose of this website?',
            answer: "This website provides transparency on the hostel canteen's menu, pricing, and food availability. Students can check daily menus, place orders, and give feedback.",
        },
        {
            question: 'How can I view the daily menu?',
            answer: "The daily menu is updated every morning on the homepage. You can also check it under the 'Menu' section.",
        },
        {
            question: 'Are vegetarian and vegan options available?',
            answer: 'Yes! The canteen offers vegetarian, vegan, and Jain food options. You can filter the menu based on your dietary needs.',
        },
        {
            question: 'How do I report a food quality issue?',
            answer: "Use the 'Feedback' section to report any issues. Your complaint will be reviewed by the canteen management team.",
        },
        {
            question: 'Can I pre-order my meals?',
            answer: 'Yes! You can pre-order meals through the website and pick them up at your preferred time.',
        },
        {
            question: 'How do I check my meal balance?',
            answer: "Check your meal balance under the 'My Account' section in 'Meal Credits'.",
        },
        {
            question: 'Are there any special discounts for students?',
            answer: 'Yes! Occasionally, we offer discounts and meal packages. Check the homepage for updates.',
        },
        {
            question: 'How often is the menu updated?',
            answer: 'The menu is updated daily based on availability and seasonal ingredients.',
        },
        {
            question: 'What payment methods are accepted?',
            answer: 'We accept UPI, credit/debit cards, and hostel meal credits.',
        },
        {
            question: 'Who can I contact for additional queries?',
            answer: "Visit the 'Contact Us' page or reach out to hostel management.",
        },
    ];

    return (
        <div
            className={`w-full flex flex-col items-center justify-center p-4 rounded-xl min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-[#f9f9f9] to-[#f2f2f2]'}`}
        >
            {/* Page Header */}
            <h1
                className={`text-4xl font-bold text-center mb-2 ${isDarkMode ? 'text-[#4977ec]' : 'text-gray-900'}`}
            >
                Frequently Asked Questions
            </h1>

            <p
                className={`text-lg text-center mt-2 max-w-2xl mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
            >
                Find answers to the most commonly asked questions about our
                services.
            </p>

            {/* FAQ List */}
            <div className="w-full max-w-3xl mt-4 space-y-4">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className={`backdrop-blur-lg border shadow-lg p-5 rounded-lg cursor-pointer transition-transform hover:scale-[1.02] ${
                            isDarkMode
                                ? 'bg-gray-800/70 border-gray-700'
                                : 'bg-white/50 border-gray-200'
                        }`}
                        onClick={() => toggleExpand(index)}
                    >
                        <div className="flex items-center justify-between">
                            <h2
                                className={`text-lg font-semibold ${
                                    isDarkMode ? 'text-white' : 'text-gray-900'
                                }`}
                            >
                                {faq.question}
                            </h2>
                            <div
                                className={`p-2 rounded-full transition ${
                                    isDarkMode
                                        ? 'bg-gray-700 hover:bg-gray-600'
                                        : 'bg-gray-200 hover:bg-gray-300'
                                }`}
                                style={{
                                    transform:
                                        expanded === index
                                            ? 'rotate(-45deg)'
                                            : 'rotate(0deg)',
                                    transition: 'transform 0.1s',
                                }}
                            >
                                <div
                                    className={`size-[16px] ${
                                        isDarkMode ? 'fill-white' : ''
                                    }`}
                                >
                                    {icons.plus}
                                </div>
                            </div>
                        </div>
                        {expanded === index && (
                            <div
                                className={`mt-2 overflow-hidden transition-all duration-200 ${
                                    isDarkMode
                                        ? 'text-gray-300'
                                        : 'text-gray-600'
                                }`}
                            >
                                {faq.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

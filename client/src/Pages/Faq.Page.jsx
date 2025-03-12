import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { icons } from '../Assets/icons';

export default function FAQpage() {
    const [expanded, setExpanded] = useState(null);

    const toggleExpand = (index) => {
        setExpanded(expanded === index ? null : index);
    };

    const faqs = [
        {
            question: 'What is the purpose of this website?',
            answer: "This website is designed to provide complete transparency regarding the hostel canteen's menu, pricing, and food availability. Students can check daily menus, place orders, and give feedback directly.",
        },
        {
            question: 'How can I view the daily menu?',
            answer: "The daily menu is updated every morning on the homepage. You can also find it under the 'Menu' section.",
        },
        {
            question: 'Are there vegetarian and vegan options available?',
            answer: 'Yes! Our canteen provides vegetarian, vegan, and Jain food options. You can filter the menu based on your dietary preferences.',
        },
        {
            question: 'How do I report a food quality issue?',
            answer: "If you face any issues with food quality, you can use the 'Feedback' section to report it. Your complaint will be reviewed by the canteen management team.",
        },
        {
            question: 'Can I pre-order my meals?',
            answer: 'Yes! You can pre-order your meals through the website and pick them up at the canteen at your preferred time.',
        },
        {
            question: 'How do I check my meal balance?',
            answer: "You can check your meal balance in the 'My Account' section under 'Meal Credits'.",
        },
        {
            question: 'Are there any special discounts for students?',
            answer: 'Yes! We occasionally offer discounts and meal packages for students. Stay tuned for announcements on the homepage.',
        },
        {
            question: 'How often is the menu updated?',
            answer: 'The menu is updated daily based on availability and seasonal ingredients.',
        },
        {
            question: 'What payment methods are accepted?',
            answer: 'We accept digital payments including UPI, credit/debit cards, and hostel meal credits.',
        },
        {
            question: 'Who can I contact for additional queries?',
            answer: "For any further queries, you can visit the 'Contact Us' page or reach out to the hostel management.",
        },
    ];

    return (
        <div className="w-full flex items-start justify-center">
            <div className="w-[90%] px-6">
                <h1 className="text-3xl font-bold text-center mb-6">
                    Frequently Asked Questions
                </h1>
                <hr className="w-full my-4" />
                <div className="space-y-6">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white p-6 rounded-lg shadow-md cursor-pointer"
                            onClick={() => toggleExpand(index)}
                        >
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {faq.question}
                                </h2>
                                <motion.div
                                    animate={{
                                        rotate: expanded === index ? 45 : 0,
                                    }}
                                    transition={{ duration: 0.2 }}
                                    className="flex items-center justify-center"
                                >
                                    <div className="bg-[#eaeaea] p-2 rounded-full w-fit drop-shadow-md hover:brightness-90">
                                        <div className="size-[16px]">
                                            {icons.plus}
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            <AnimatePresence initial={false}>
                                {expanded === index && (
                                    <motion.div
                                        className="overflow-hidden"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{
                                            opacity: { duration: 0.2 },
                                            height: { duration: 0.2 },
                                        }}
                                    >
                                        <p className="mt-2 text-gray-600">
                                            {faq.answer}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

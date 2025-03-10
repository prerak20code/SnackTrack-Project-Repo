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
            question: 'What is this blog about?',
            answer: 'This blog is a collection of articles on various topics, including technology, lifestyle, and personal growth. We aim to provide valuable insights and tips to our readers.',
        },
        {
            question: 'How often do you post new content?',
            answer: 'New blog posts are published once a week. We strive to maintain a consistent posting schedule to keep our readers engaged.',
        },
    ];

    return (
        <div className="w-full flex items-start justify-center">
            <div className="w-[90%] px-6">
                <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
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
                                    transition={{ duration: 0.3 }}
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
                                            height: { duration: 0.3 },
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

import { useState, useEffect, useRef } from 'react';
import { icons } from '../../Assets/icons';
import { useSearchContext } from '../../Contexts';
import { useLocation } from 'react-router-dom';

export default function Searchbar() {
    const { search, setSearch } = useSearchContext();
    const [placeholder, setPlaceholder] = useState('');
    const [isTyping, setIsTyping] = useState(true);
    const typingIntervalRef = useRef(null);
    const location = useLocation();

    // List of random snack names for the typing effect
    const snackNames = [
        'Search "Chips"',
        'Search "Chocolate"',
        'Search "Poha"',
        'Search "Popcorn"',
        'Search "Burger"',
        'Search "Samosa"',
        'Search "Tikki"',
    ];

    // Clear search when location changes
    useEffect(() => setSearch(''), [location]);

    // Function to simulate typing effect with smooth transitions
    const startTypingEffect = () => {
        let currentIndex = 0;
        let currentText = '';
        let isDeleting = false;

        const type = () => {
            const currentSnack = snackNames[currentIndex];

            if (isDeleting) {
                // Delete characters one by one
                currentText = currentSnack.substring(0, currentText.length - 1);
            } else {
                // Add characters one by one
                currentText = currentSnack.substring(0, currentText.length + 1);
            }

            // Update the placeholder
            setPlaceholder(currentText);

            // Check if the current snack name is fully typed or deleted
            if (!isDeleting && currentText === currentSnack) {
                // Pause before deleting
                setTimeout(() => (isDeleting = true), 1000);
            } else if (isDeleting && currentText === '') {
                // Move to the next snack name
                isDeleting = false;
                currentIndex = (currentIndex + 1) % snackNames.length;
            }

            // Schedule the next character typing/deletion
            const delay = isDeleting ? 50 : 100; // Faster deletion for smoother effect
            typingIntervalRef.current = setTimeout(type, delay);
        };

        // Start typing
        type();
    };

    // Start the typing effect when the component mounts
    useEffect(() => {
        if (isTyping) startTypingEffect();

        // Cleanup the timeout when the component unmounts
        return () => {
            if (typingIntervalRef.current) {
                clearTimeout(typingIntervalRef.current);
            }
        };
    }, [isTyping]);

    // Stop the typing effect when the input is focused
    const handleFocus = () => {
        setIsTyping(false);
        if (typingIntervalRef.current) {
            clearTimeout(typingIntervalRef.current);
        }
        setPlaceholder(''); // Clear the placeholder
    };

    // Restart the typing effect when the input loses focus
    const handleBlur = () => {
        if (!search) {
            setIsTyping(true);
            startTypingEffect();
        }
    };

    return (
        <div className="w-full max-w-[500px] hidden sm:block group drop-shadow-sm relative">
            <input
                type="text"
                placeholder={placeholder || ''}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="w-full bg-white border-transparent border-[0.1rem] indent-8 rounded-full p-[5px] text-black text-[16px] font-normal placeholder:text-[#525252] outline-none focus:border-[#4977ec] transition-all duration-200"
            />
            <div className="size-[16px] fill-gray-800 group-focus-within:fill-[#4977ec] absolute top-[50%] translate-y-[-50%] left-3">
                {icons.search}
            </div>
            {search && (
                <div
                    onClick={() => {
                        setSearch('');
                        setTimeout(() => {
                            setIsTyping(true);
                        }, 1000);
                    }}
                    className="hover:bg-gray-100 rounded-full absolute right-2 p-[5px] cursor-pointer top-[50%] translate-y-[-50%]"
                >
                    <div className="size-[18px] stroke-gray-800">
                        {icons.cross}
                    </div>
                </div>
            )}
        </div>
    );
}

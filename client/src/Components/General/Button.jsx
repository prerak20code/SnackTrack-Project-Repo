import { useDarkMode } from '../../Contexts/DarkMode';

export default function Button({
    disabled = false,
    className = '',
    btnText,
    type = 'button',
    ...props
}) {
    const { isDarkMode } = useDarkMode();

    return (
        <button
            type={type}
            disabled={disabled}
            {...props}
            className={`hover:scale-110 transition-all duration-300 disabled:cursor-not-allowed cursor-pointer ${
                isDarkMode ? 'disabled:opacity-50' : 'disabled:opacity-70'
            } ${className}`}
        >
            {btnText}
        </button>
    );
}

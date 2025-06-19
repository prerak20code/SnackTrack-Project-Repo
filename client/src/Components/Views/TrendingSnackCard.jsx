import { useDarkMode } from '../../Contexts/DarkMode';

export default function TrendingSnackCard({ snack, index }) {
    const { isDarkMode } = useDarkMode();

    return (
        <div
            className={`flex flex-col items-center rounded-2xl p-3 min-w-[120px] sm:min-w-[150px] md:min-w-[180px] snap-start 
                transition-transform duration-300 hover:scale-[1.05] hover:shadow-xl
                ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}
            `}
        >
            {/* Rank Badge */}
            <div className="self-start text-xs font-bold mb-1 text-yellow-500">
                🔥 #{index + 1}
            </div>

            {/* Snack Image */}
            <div className="h-[70px] w-[70px] sm:h-[90px] sm:w-[90px] md:h-[110px] md:w-[110px] rounded-full overflow-hidden shadow-md mb-2">
                <img
                    src={snack.image}
                    alt={snack.name}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                />
            </div>

            {/* Snack Name */}
            <div className="text-xs sm:text-sm md:text-base font-semibold text-center truncate w-full">
                {snack.name}
            </div>
        </div>
    );
}

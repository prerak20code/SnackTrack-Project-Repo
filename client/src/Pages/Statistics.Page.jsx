import StatisticsChart from './StatisticsChart';
import { useUserContext } from '../Contexts';
import { useDarkMode } from '../Contexts/DarkMode';

const StatisticsPage = () => {
    const { user } = useUserContext();
    const { isDarkMode } = useDarkMode();

    return (
        <div
            className={`max-w-5xl mx-auto p-6 ${
                isDarkMode ? 'bg-gray-900' : 'bg-white'
            }`}
        >
            <h1
                className={`text-3xl font-bold text-center mb-6 ${
                    isDarkMode ? 'text-[#4977ec]' : 'text-orange-600'
                }`}
            >
                Sales Statistics
            </h1>
            <StatisticsChart canteenId={user.canteenId} />
        </div>
    );
};

export default StatisticsPage;

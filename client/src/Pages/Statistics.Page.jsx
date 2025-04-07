import StatisticsChart from './StatisticsChart';
import { useUserContext } from '../Contexts';

const StatisticsPage = () => {
    const { user } = useUserContext();

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-orange-600 text-center mb-6">
                Sales Statistics
            </h1>
            <StatisticsChart canteenId={user.canteenId} />
        </div>
    );
};

export default StatisticsPage;

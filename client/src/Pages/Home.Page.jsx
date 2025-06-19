import { useNavigate, useSearchParams } from 'react-router-dom';
import { Snacks, PackagedItems, Filter } from '../Components';
import { icons } from '../Assets/icons';
import { useEffect, useState } from 'react';
import { useSnackContext } from '../Contexts';
import { snackService } from '../Services';
import { useDarkMode } from '../Contexts/DarkMode';
import TrendingSnackCard from '../Components/Views/TrendingSnackCard';
import { useAuth } from '../Contexts/AuthContext';

export default function HomePage() {
    const [searchParams] = useSearchParams();
    const filter = searchParams.get('filter') || 'snacks';
    const { setSnacks, setItems } = useSnackContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [topSnacks, setTopSnacks] = useState([]);
    const { isDarkMode } = useDarkMode();
    const { user, loading: authLoading } = useAuth();

    const options = [
        { value: 'snacks', label: 'Snacks', icon: icons.snack },
        { value: 'packaged', label: 'Packaged', icon: icons.soda },
    ];

    useEffect(() => {
        setLoading(true);

        const controller = new AbortController();
        const signal = controller.signal;

        (async function getSnacks() {
            try {
                const [snacks, items, cartItems, topSnackItems] =
                    await Promise.all([
                        snackService.getSnacks(signal),
                        snackService.getPackagedFoodItems(signal),
                        JSON.parse(localStorage.getItem('cartItems')) || [],
                        snackService.getTopSnacks(signal),
                    ]);

                // Set normal snacks
                if (snacks && !snacks.message) {
                    setSnacks(
                        snacks.map((snack) => ({
                            ...snack,
                            quantity:
                                cartItems.find((i) => i._id === snack._id)
                                    ?.quantity || 0,
                        }))
                    );
                }

                // Set packaged food
                if (items && !items.message) {
                    setItems(
                        items.map((item) => ({
                            ...item,
                            variants: item.variants.map((v) => ({
                                ...v,
                                quantity:
                                    cartItems.find(
                                        ({ _id, price }) =>
                                            _id === item._id &&
                                            v.price === price
                                    )?.quantity || 0,
                            })),
                        }))
                    );
                }

                // Set top snacks
                if (topSnackItems && Array.isArray(topSnackItems)) {
                    setTopSnacks(topSnackItems);
                }
            } catch (err) {
                console.error(err);
                navigate('/server-error');
            } finally {
                setLoading(false);
            }
        })();

        return () => {
            controller.abort();
            setSnacks([]);
            setItems([]);
        };
    }, []);

    return (
        <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="w-full flex justify-end mb-6">
                <Filter options={options} defaultOption={filter} />
            </div>

            {filter === 'snacks' &&
                topSnacks.length > 0 &&
                !authLoading &&
                user?.role === 'student' && (
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <h2
                                    className={`text-xl sm:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                                >
                                    🔥 Trending Snacks
                                </h2>
                                <div
                                    className={`px-3 py-1 rounded-full text-xs font-medium animate-pulse
                    ${isDarkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-600'}`}
                                >
                                    HOT
                                </div>
                            </div>
                            <div
                                className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                            >
                                Updated hourly
                            </div>
                        </div>

                        {/* Mobile Layout */}
                        <div className="block sm:hidden">
                            {topSnacks.length > 0 && (
                                <div
                                    className={`relative overflow-hidden rounded-2xl h-28 mb-4 cursor-pointer group
                bg-gradient-to-r ${
                    isDarkMode
                        ? 'from-purple-900 via-blue-900 to-indigo-900'
                        : 'from-purple-500 via-pink-500 to-red-500'
                }`}
                                >
                                    <div className="absolute top-2 right-3 flex items-center gap-2">
                                        <div className="text-xl animate-bounce">
                                            👑
                                        </div>
                                        <div className="text-white font-bold text-xs bg-black/30 px-2 py-1 rounded-full">
                                            #1 BESTSELLER
                                        </div>
                                    </div>

                                    <div className="relative h-full flex items-center p-3">
                                        <div className="flex items-center gap-3 w-full">
                                            <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg ring-2 ring-white/30 flex-shrink-0">
                                                <img
                                                    src={topSnacks[0].image}
                                                    alt={topSnacks[0].name}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 text-white">
                                                <h3 className="font-bold text-base mb-1 line-clamp-1">
                                                    {topSnacks[0].name}
                                                </h3>
                                                {topSnacks[0].price && (
                                                    <span className="text-yellow-200 font-semibold text-sm">
                                                        ₹{topSnacks[0].price}
                                                    </span>
                                                )}
                                                <div className="flex items-center gap-2 text-xs text-white/80 mt-1">
                                                    <span className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></span>
                                                    Most ordered
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Compact Grid for others
                        <div className="grid grid-cols-2 gap-3">
                            {topSnacks.slice(1, 3).map((snack, index) => (
                                <div
                                    key={snack._id}
                                    className={`relative p-3 rounded-xl cursor-pointer hover:scale-[1.02] transition-transform
                        ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'}`}
                                >
                                    <div
                                        className={`text-xs mb-2 font-semibold
                            ${index === 0 ? 'text-orange-500' : index === 1 ? 'text-blue-500' : 'text-gray-500'}`}
                                    >
                                        #{index + 2} {index < 2 && '🔥'}
                                    </div>

                                    <div className="w-full aspect-square rounded-lg overflow-hidden mb-2">
                                        <img
                                            src={snack.image}
                                            alt={snack.name}
                                            className="h-full w-full object-cover hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>

                                    <h4
                                        className={`font-medium text-xs line-clamp-2 mb-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                                    >
                                        {snack.name}
                                    </h4>

                                    {snack.price && (
                                        <p
                                            className={`text-xs font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}
                                        >
                                            ₹{snack.price}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div> */}
                        </div>

                        {/* Desktop/Tablet Layout */}
                        <div className="hidden sm:block">
                            {/* Top 3 Featured */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                {topSnacks.slice(0, 3).map((snack, index) => {
                                    const getRankConfig = (rank) => {
                                        return {
                                            gradient:
                                                'from-blue-400 to-blue-600',
                                            bgGradient:
                                                'from-blue-50 to-blue-100',
                                            title: 'TRENDING',
                                        };
                                    };

                                    const getRankEmoji = (rank) => {
                                        if (rank === 0) return '👑';
                                        if (rank === 1) return '🥈';
                                        if (rank === 2) return '🥉';
                                        return '🔥';
                                    };

                                    const config = getRankConfig(index);

                                    return (
                                        <div
                                            key={snack._id}
                                            className="relative group cursor-pointer transform transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2"
                                        >
                                            {/* Glow effect */}
                                            <div
                                                className={`absolute -inset-1 bg-gradient-to-r ${config.gradient} rounded-3xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500`}
                                            ></div>

                                            <div
                                                className={`relative h-60 p-6 rounded-3xl transition-all duration-500 group-hover:shadow-2xl backdrop-blur-sm
                                ${
                                    isDarkMode
                                        ? `bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-600/50 ${config.darkBgGradient}`
                                        : `bg-gradient-to-br from-white/90 to-gray-50/90 border border-gray-200/50 shadow-xl ${config.bgGradient}`
                                }`}
                                            >
                                                {/* Rank badge */}
                                                <div
                                                    className={`absolute -top-3 -left-3 w-10 h-10 rounded-full flex items-center justify-center
                                    bg-gradient-to-r ${config.gradient} shadow-2xl text-white font-bold text-xs
                                    transform rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500`}
                                                >
                                                    <div className="text-center">
                                                        <div className="text-[18px] leading-none">
                                                            #{index + 1}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Floating emoji */}
                                                <div className="absolute top-3 right-3 text-2xl animate-bounce group-hover:animate-pulse">
                                                    {getRankEmoji(index)}
                                                </div>

                                                {/* Sparkle effect */}
                                                <div className="absolute top-6 right-8 text-sm animate-pulse opacity-60">
                                                    {config.sparkle}
                                                </div>

                                                <div className="flex items-center gap-6 h-full">
                                                    {/* Image with enhanced styling */}
                                                    <div className="relative flex-shrink-0">
                                                        <div
                                                            className={`w-32 h-32 rounded-full overflow-hidden shadow-2xl ring-4 ring-offset-4 transition-all duration-500
                                            ${isDarkMode ? 'ring-gray-500/50 ring-offset-gray-800' : 'ring-gray-300/50 ring-offset-white'}
                                            group-hover:ring-8 group-hover:shadow-3xl`}
                                                        >
                                                            <img
                                                                src={
                                                                    snack.image
                                                                }
                                                                alt={snack.name}
                                                                className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                                                            />
                                                        </div>

                                                        {/* Pulsing ring effect */}
                                                        {/* <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${config.gradient} opacity-20 animate-ping group-hover:animate-pulse`}></div> */}
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 flex flex-col justify-center gap-3">
                                                        {/* Title badge */}
                                                        <div
                                                            className={`text-[10px] font-black tracking-wider px-2 py-1 rounded-full self-start
                                            bg-gradient-to-r ${config.gradient} text-white shadow-lg animate-pulse`}
                                                        >
                                                            {config.title}
                                                        </div>

                                                        <div className="space-y-2">
                                                            <h3
                                                                className={`font-bold text-lg leading-tight line-clamp-2 transition-colors duration-300
                                                ${isDarkMode ? 'text-white group-hover:text-yellow-200' : 'text-gray-800 group-hover:text-gray-900'}`}
                                                            >
                                                                {snack.name}
                                                            </h3>

                                                            {snack.price && (
                                                                <div className="flex items-center gap-2">
                                                                    <p
                                                                        className={`text-2xl font-black bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}
                                                                    >
                                                                        ₹
                                                                        {
                                                                            snack.price
                                                                        }
                                                                    </p>
                                                                    <div className="text-xs text-green-500 animate-pulse">
                                                                        ●
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Status badges */}
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className={`text-xs py-2 px-3 rounded-full font-semibold transition-all duration-300
                                                bg-gradient-to-r ${config.gradient} text-white shadow-lg
                                                group-hover:shadow-xl group-hover:scale-105`}
                                                            >
                                                                🔥 Hot selling
                                                            </div>

                                                            <div className="flex items-center gap-1 text-xs">
                                                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                                <span
                                                                    className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} font-medium`}
                                                                >
                                                                    In stock
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Decorative elements */}
                                                <div className="absolute bottom-2 left-2 w-8 h-8 bg-gradient-to-r from-transparent to-white/10 rounded-full blur-sm"></div>
                                                <div className="absolute top-1/2 right-2 w-4 h-4 bg-gradient-to-r from-transparent to-white/5 rounded-full blur-sm"></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Horizontal Scrollable List */}
                            {topSnacks.length > 3 && (
                                <div className="overflow-x-auto no-scrollbar">
                                    <div className="flex gap-4 pb-2">
                                        {topSnacks
                                            .slice(3)
                                            .map((snack, index) => (
                                                <div
                                                    key={snack._id}
                                                    className="min-w-[180px] w-[180px] relative group cursor-pointer"
                                                >
                                                    <div
                                                        className={`h-36 p-3 rounded-xl transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-lg
                                    ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'}`}
                                                    >
                                                        <div
                                                            className={`text-xs mb-2 font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}
                                                        >
                                                            #{index + 4} 🔥
                                                        </div>

                                                        <div className="flex items-center gap-3">
                                                            <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm flex-shrink-0">
                                                                <img
                                                                    src={
                                                                        snack.image
                                                                    }
                                                                    alt={
                                                                        snack.name
                                                                    }
                                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                                />
                                                            </div>

                                                            <div className="flex-1 min-w-0">
                                                                <h4
                                                                    className={`font-medium text-xs line-clamp-2 mb-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                                                                >
                                                                    {snack.name}
                                                                </h4>

                                                                {snack.price && (
                                                                    <p
                                                                        className={`text-xs font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}
                                                                    >
                                                                        ₹
                                                                        {
                                                                            snack.price
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div
                                                            className={`text-xs mt-2 flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                                                        >
                                                            <span className="w-1 h-1 bg-red-500 rounded-full animate-pulse"></span>
                                                            Trending
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Stats Bar */}
                        <div
                            className={`mt-6 p-3 rounded-xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}
                        >
                            <div className="flex justify-between items-center text-sm">
                                <div
                                    className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                                >
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    Live rankings based on orders
                                </div>
                                <div
                                    className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                                >
                                    trending items
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            <div className="sm:px-4 pb-8">
                {loading ? (
                    <div
                        className={`w-full text-center ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}
                    >
                        loading...
                    </div>
                ) : filter === 'snacks' ? (
                    <Snacks />
                ) : (
                    <PackagedItems />
                )}
            </div>
        </div>
    );
}

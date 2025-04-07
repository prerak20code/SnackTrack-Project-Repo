import { useEffect, useState } from 'react';
import { orderService } from '../Services';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    BarChart,
    Bar,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import { motion } from 'framer-motion';

const COLORS = [
    '#FF5733',
    '#FFBD33',
    '#33FF57',
    '#3385FF',
    '#8D33FF',
    '#FF33A1',
    '#33FFF2',
];

const StatisticsChart = ({ canteenId }) => {
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);

    const year = month.split('-')[0];
    const selectedMonth = month.split('-')[1];

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const data = await orderService.getCanteenStatistics(
                    canteenId,
                    year,
                    selectedMonth
                );
                setStats(data);
                // console.log('Fetched statistics:', data);
            } catch (error) {
                console.error('Error loading stats', error);
            }
            setLoading(false);
        };
        if (canteenId) fetchStats();
    }, [canteenId, year, selectedMonth]);

    return (
        <div>
            <div className="flex justify-center mb-6 ">
                <input
                    type="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="border px-4 py-2 rounded-lg"
                />
            </div>

            {loading ? (
                <p className="text-center text-orange-500">Loading...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Line Chart: Revenue Trend */}
                    <ChartBox title="📈 Revenue Trend">
                        <LineChart
                            data={stats.revenueTrend}
                            width={300}
                            height={250}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line dataKey="revenue" stroke="#FF5733" />
                        </LineChart>
                    </ChartBox>

                    {/* Pie Chart: Revenue by Item */}
                    <ChartBox title="🥪 Revenue by Snacks">
                        <PieChart width={300} height={250}>
                            <Pie
                                data={stats.revenueByItem}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label={({ name, percent }) =>
                                    `${name}: ${(percent * 100).toFixed(1)}%`
                                }
                            >
                                {stats.revenueByItem?.map((_, i) => (
                                    <Cell
                                        key={i}
                                        fill={COLORS[i % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ChartBox>

                    {/* Pie Chart: Revenue by Item Type
                    <ChartBox title="Revenue by Item Type">
                        <PieChart width={300} height={250}>
                            <Pie
                                data={stats.revenueByItemType}
                                dataKey="value"
                                nameKey="type"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label={({ type, percent }) =>
                                    `${type}: ${(percent * 100).toFixed(1)}%`
                                }
                            >
                                {stats.revenueByItemType?.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>

                    </ChartBox> */}

                    {/* Bar Chart: Top Selling Items */}
                    <ChartBox title="🏆 Top Selling Snacks">
                        <BarChart
                            data={stats.topSellingItems}
                            width={300}
                            height={250}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="quantity" fill="#3385FF" />
                        </BarChart>
                    </ChartBox>

                    {/* Line Chart: Daily Order Counts */}
                    <ChartBox title="📅 Daily Order Counts">
                        <LineChart
                            data={stats.dailyOrderCounts}
                            width={300}
                            height={250}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line dataKey="orderCount" stroke="#33FF57" />
                        </LineChart>
                    </ChartBox>

                    {/* Line Chart: Average Order Value
                    <ChartBox title="Average Order Value">
                        <LineChart
                            data={stats.averageOrderValue}
                            width={300}
                            height={250}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line dataKey="averageValue" stroke="#8D33FF" />
                        </LineChart>
                    </ChartBox> */}
                </div>
            )}
        </div>
    );
};

const ChartBox = ({ title, children }) => (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        whileHover={{ scale: 1.02 }}
        className="bg-white p-5 shadow-xl rounded-2xl border border-gray-100 hover:shadow-2xl transition-shadow"
    >
        <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
        <ResponsiveContainer width="100%" height={250}>
            {children}
        </ResponsiveContainer>
    </motion.div>
);

export default StatisticsChart;

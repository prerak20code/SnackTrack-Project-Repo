import { useEffect, useState } from 'react';
import { adminService } from '../Services';
import { useNavigate } from 'react-router-dom';
import { Button } from '../Components';

export default function AdminPage() {
    const [canteens, setCanteens] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        (async function getCanteens() {
            try {
                const res = await adminService.getCanteens(signal);
                if (res && !res.message) {
                    setCanteens(res);
                }
            } catch (err) {
                navigate('/server-error');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const canteenElements = canteens.map((canteen) => (
        <div
            key={canteen._id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
            {/* Hostel Details */}
            <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                    {canteen.hostelName}
                </h2>
                <p className="text-nowrap font-medium text-gray-800">
                    {canteen.hostelType} {canteen.hostelNumber}
                </p>
            </div>

            {/* Contractor Details */}
            <div className="flex items-center gap-4">
                <div>
                    <div className="size-14 rounded-full overflow-hidden">
                        <img
                            src={canteen.contractor.avatar}
                            alt={canteen.contractor.fullName}
                            className="size-full object-cover"
                        />
                    </div>
                </div>
                <div>
                    <p className="text-lg font-semibold text-gray-900">
                        {canteen.contractor.fullName}
                    </p>
                    <p className="text-sm text-gray-700">
                        <span className="font-medium">Email:</span>{' '}
                        {canteen.contractor.email}
                    </p>
                    <p className="text-sm  text-gray-700">
                        <span className="font-medium">Phone:</span>{' '}
                        {canteen.contractor.phoneNumber}
                    </p>
                </div>
            </div>
        </div>
    ));

    return loading ? (
        <div>loading...</div>
    ) : (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                <section className="w-full bg-white shadow-md mb-8 rounded-xl py-10 px-8 md:px-16">
                    <h1 className="text-4xl font-bold text-gray-900">
                        Admin Dashboard
                    </h1>
                    <p className="mt-4 text-lg text-gray-700 max-w-3xl">
                        Welcome to the Admin Dashboard. Here you can manage
                        canteens and contractors efficiently.
                    </p>
                </section>

                <div className="flex justify-center w-full mb-8">
                    <Button
                        className="w-fit bg-[#4977ec] text-white text-lg px-6 py-3 rounded-lg font-semibold hover:bg-[#3b62c2]"
                        btnText="Register New Canteen"
                        onClick={() => navigate('new-canteen')}
                    />
                </div>

                {/* Canteen Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {canteenElements}
                </div>
            </div>
        </div>
    );
}

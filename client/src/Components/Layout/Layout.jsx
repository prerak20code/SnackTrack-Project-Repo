import { Outlet } from 'react-router-dom';
import { Header, Footer, Sidebar, Popup } from '..';
import { Toaster } from 'react-hot-toast';
import { useDarkMode } from '../../Contexts/DarkMode';

export default function Layout({ renderTemplate = true }) {
    const { isDarkMode } = useDarkMode();

    return renderTemplate ? (
        <div
            className={`overflow-y-scroll h-full w-full ${
                isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'
            }`}
        >
            <Header />
            <hr
                className={`w-full ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}
            />
            <Sidebar />
            <main
                className={`mt-[60px] p-4 min-h-[calc(100%-60px)] w-full ${
                    isDarkMode ? 'bg-gray-900' : 'bg-[#f9f9f9]'
                }`}
            >
                <Outlet />
            </main>
            <hr
                className={`${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}
            />
            <Footer />
            <Popup />
            <Toaster
                toastOptions={{
                    style: {
                        background: isDarkMode ? '#1f2937' : '#fff',
                        color: isDarkMode ? '#fff' : '#000',
                    },
                }}
            />
        </div>
    ) : (
        <div
            className={`overflow-y-scroll h-full w-full ${
                isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'
            }`}
        >
            <Outlet />
            <Popup />
            <Toaster
                toastOptions={{
                    style: {
                        background: isDarkMode ? '#1f2937' : '#fff',
                        color: isDarkMode ? '#fff' : '#000',
                    },
                }}
            />
        </div>
    );
}

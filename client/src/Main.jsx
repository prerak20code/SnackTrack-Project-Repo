// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './Styles/index.css';

import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider,
} from 'react-router-dom';

import {
    HomePage,
    LoginPage,
    RegisterPage,
    SettingsPage,
    AdminPage,
    SupportPage,
    AboutUsPage,
    ContactUsPage,
    ServerErrorPage,
    NotFoundPage,
    Redirect,
    FAQpage,
    NewUserPage,
} from './Pages';

import {
    UserContextProvider,
    PopupContextProvider,
    SideBarContextProvider,
    SearchContextProvider,
    useUserContext,
} from './Contexts';

import {
    DeleteAccount,
    UpdateAccountDetails,
    UpdatePassword,
} from './Components';

function Wrapper() {
    return (
        <PopupContextProvider>
            <SideBarContextProvider>
                <SearchContextProvider>
                    <App />
                </SearchContextProvider>
            </SideBarContextProvider>
        </PopupContextProvider>
    );
}

function AppRouter() {
    const { user } = useUserContext();

    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<Wrapper />}>
                {user ? (
                    //  although no need of redirect because routes are defined only if logged in
                    <Route element={<Redirect />}>
                        <Route path="" element={<HomePage />} />
                        <Route path="settings" element={<SettingsPage />}>
                            <Route path="" element={<UpdateAccountDetails />} />
                            <Route
                                path="password"
                                element={<UpdatePassword />}
                            />
                            <Route
                                path="delete-account"
                                element={<DeleteAccount />}
                            />
                        </Route>
                        <Route path="register" element={<RegisterPage />} />
                        <Route path="admin" element={<AdminPage />} />
                        <Route path="support" element={<SupportPage />} />
                        <Route path="about-us" element={<AboutUsPage />} />
                        <Route path="contact-us" element={<ContactUsPage />} />
                        <Route path="faqs" element={<FAQpage />} />
                    </Route>
                ) : (
                    <Route path="" element={<NewUserPage />} />
                )}

                {/* public routes */}
                <Route path="login" element={<LoginPage />} />
                <Route path="server-error" element={<ServerErrorPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        )
    );
    return <RouterProvider router={router} />;
}

function Root() {
    return (
        <UserContextProvider>
            <AppRouter />
        </UserContextProvider>
    );
}

createRoot(document.getElementById('root')).render(
    // <StrictMode>
    <Root />
    // </StrictMode>,
);

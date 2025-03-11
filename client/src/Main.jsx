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
} from './Pages';

import {
    UserContextProvider,
    PopupContextProvider,
    SideBarContextProvider,
    SearchContextProvider,
} from './Contexts';

import {
    DeleteAccount,
    UpdateAccountDetails,
    UpdatePassword,
} from './Components';

function Wrapper() {
    return (
        <UserContextProvider>
            <PopupContextProvider>
                <SideBarContextProvider>
                    <SearchContextProvider>
                        <App />
                    </SearchContextProvider>
                </SideBarContextProvider>
            </PopupContextProvider>
        </UserContextProvider>
    );
}

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Wrapper />}>
            <Route path="" element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />

            <Route
                path="admin"
                element={
                    <Redirect path="/login">
                        <AdminPage />
                    </Redirect>
                }
            />

            <Route
                path="settings"
                element={
                    <Redirect path="/login">
                        <SettingsPage />
                    </Redirect>
                }
            >
                <Route path="" element={<UpdateAccountDetails />} />
                <Route path="password" element={<UpdatePassword />} />
                <Route path="delete-account" element={<DeleteAccount />} />
            </Route>

            {/* static pages */}
            <Route path="support" element={<SupportPage />} />
            <Route path="about-us" element={<AboutUsPage />} />
            <Route path="contact-us" element={<ContactUsPage />} />
            <Route path="faqs" element={<FAQpage />} />
            <Route path="server-error" element={<ServerErrorPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Route>
    )
);

createRoot(document.getElementById('root')).render(
    // <StrictMode>
    <RouterProvider router={router} />
    // </StrictMode>,
);

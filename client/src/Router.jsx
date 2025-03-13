import App from './App';

import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
} from 'react-router-dom';

import {
    HomePage,
    LoginPage,
    RegisterPage,
    SettingsPage,
    AdminPage,
    StudentsPage,
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
    DeleteAccount,
    UpdateAccountDetails,
    UpdatePassword,
} from './Components';

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />}>
            {/* private routes */}
            <Route
                path=""
                element={
                    <Redirect path="/new-user">
                        <HomePage />
                    </Redirect>
                }
            />

            <Route path="" element={<Redirect to="/login" />}>
                <Route path="register" element={<RegisterPage />} />
                <Route path="admin" element={<AdminPage />} />
                <Route path="students" element={<StudentsPage />} />
                <Route path="settings" element={<SettingsPage />}>
                    <Route path="" element={<UpdateAccountDetails />} />
                    <Route path="password" element={<UpdatePassword />} />
                    <Route path="delete-account" element={<DeleteAccount />} />
                </Route>
                <Route path="support" element={<SupportPage />} />
                <Route path="about-us" element={<AboutUsPage />} />
                <Route path="contact-us" element={<ContactUsPage />} />
                <Route path="faqs" element={<FAQpage />} />
            </Route>

            {/* public routes */}
            <Route path="login" element={<LoginPage />} />
            <Route path="new-user" element={<NewUserPage />} />
            <Route path="server-error" element={<ServerErrorPage />} />

            {/* other gibberish */}
            <Route path="*" element={<NotFoundPage />} />
        </Route>
    )
);

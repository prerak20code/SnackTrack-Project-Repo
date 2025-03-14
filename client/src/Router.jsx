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
    InventoryPage,
    TodayOrdersPage,
    StudentOrdersPage,
    CanteensPage,
    ContractorsPage,
    CartPage,
} from './Pages';

import { UpdateAccountDetails, UpdatePassword } from './Components';

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />}>
            {/* private routes */}
            <Route path="" element={<Redirect path="/new-user" />}>
                <Route path="" element={<HomePage />} />
            </Route>

            <Route element={<Redirect to="/login" />}>
                <Route path="register" element={<RegisterPage />} />
                <Route path="admin" element={<AdminPage />} />
                <Route path="students/:canteenId" element={<StudentsPage />} />
                <Route path="canteens" element={<CanteensPage />} />
                <Route path="contractors" element={<ContractorsPage />} />
                <Route path="inventory" element={<InventoryPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="today-orders" element={<TodayOrdersPage />} />
                <Route
                    path="orders/:studentId"
                    element={<StudentOrdersPage />}
                />
                <Route path="settings" element={<SettingsPage />}>
                    <Route path="" element={<UpdateAccountDetails />} />
                    <Route path="password" element={<UpdatePassword />} />
                    {/* <Route path="delete-account" element={<DeleteAccount />} /> */}
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

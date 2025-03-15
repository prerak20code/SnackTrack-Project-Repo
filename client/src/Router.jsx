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
    StudentsPage,
    SupportPage,
    AboutUsPage,
    ContactUsPage,
    ServerErrorPage,
    NotFoundPage,
    Redirect,
    OwnResourceRedirect,
    FAQpage,
    NewUserPage,
    TodayOrdersPage,
    StudentOrdersPage,
    CanteensPage,
    ContractorsPage,
    CartPage,
    BillsPage,
} from './Pages';

import { UpdateAccountDetails, UpdatePassword, Layout } from './Components';

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />}>
            {/* private routes */}

            <Route element={<Redirect />}>
                {/* accessable to all */}

                <Route element={<Layout />}>
                    <Route path="" element={<HomePage />} />
                    <Route path="settings" element={<SettingsPage />}>
                        <Route path="" element={<UpdateAccountDetails />} />
                        <Route path="password" element={<UpdatePassword />} />
                    </Route>
                    <Route path="support" element={<SupportPage />} />
                    <Route path="about-us" element={<AboutUsPage />} />
                    <Route path="contact-us" element={<ContactUsPage />} />
                    <Route path="faqs" element={<FAQpage />} />
                </Route>

                {/* accessable to admin and contractor */}

                <Route element={<Redirect who={['admin', 'contractor']} />}>
                    <Route element={<Layout renderTemplate={false} />}>
                        <Route path="register" element={<RegisterPage />} />
                    </Route>
                    <Route
                        path="students/:canteenId"
                        element={<OwnResourceRedirect />}
                    >
                        <Route element={<Layout />}>
                            <Route path="" element={<StudentsPage />} />
                        </Route>
                    </Route>
                </Route>

                {/* accessable to student and contractor */}

                <Route element={<Redirect who={['student', 'contractor']} />}>
                    <Route element={<Layout />}>
                        <Route path="bills" element={<BillsPage />} />
                    </Route>
                    <Route
                        path="orders/:studentId"
                        element={<OwnResourceRedirect />}
                    >
                        <Route element={<Layout />}>
                            <Route path="" element={<StudentOrdersPage />} />
                        </Route>
                    </Route>
                </Route>

                {/* accessable to admin only */}

                <Route element={<Redirect who={['admin']} />}>
                    <Route element={<Layout />}>
                        <Route path="canteens" element={<CanteensPage />} />
                        <Route
                            path="contractors"
                            element={<ContractorsPage />}
                        />
                    </Route>
                </Route>

                {/* accessable to contractor only */}

                <Route element={<Redirect who={['contractor']} />}>
                    <Route element={<Layout />}>
                        <Route
                            path="today-orders"
                            element={<TodayOrdersPage />}
                        />
                    </Route>
                </Route>

                {/* accessable to student */}

                <Route element={<Redirect who={['student']} />}>
                    <Route element={<Layout />}>
                        <Route path="cart" element={<CartPage />} />
                    </Route>
                </Route>
            </Route>

            {/* public routes */}

            <Route path="login" element={<LoginPage />} />
            <Route path="new-user" element={<NewUserPage />} />
            <Route path="server-error" element={<ServerErrorPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Route>
    )
);

// import { useRoutes } from 'react-router-dom';

// import {
//     HomePage,
//     LoginPage,
//     RegisterPage,
//     SettingsPage,
//     AdminPage,
//     SupportPage,
//     AboutUsPage,
//     ContactUsPage,
//     ServerErrorPage,
//     NotFoundPage,
//     FAQpage,
//     NewUserPage,
// } from './Pages';

// import {
//     DeleteAccount,
//     UpdateAccountDetails,
//     UpdatePassword,
// } from './Components';

// import { useUserContext } from './Contexts';

// export default function AppRouter() {
//     const { user } = useUserContext();

//     const routes = useRoutes([
//         { path: '/login', element: <LoginPage /> },
//         { path: '/server-error', element: <ServerErrorPage /> },

//         ...(user
//             ? [
//                   // Routes for logged-in users
//                   { path: '/', element: <HomePage /> },
//                   {
//                       path: '/settings',
//                       element: <SettingsPage />,
//                       children: [
//                           { path: '', element: <UpdateAccountDetails /> },
//                           { path: 'password', element: <UpdatePassword /> },
//                           {
//                               path: 'delete-account',
//                               element: <DeleteAccount />,
//                           },
//                       ],
//                   },
//                   { path: '/register', element: <RegisterPage /> },
//                   { path: '/admin', element: <AdminPage /> },
//                   { path: '/support', element: <SupportPage /> },
//                   { path: '/about-us', element: <AboutUsPage /> },
//                   { path: '/contact-us', element: <ContactUsPage /> },
//                   { path: '/faqs', element: <FAQpage /> },
//                   { path: '*', element: <NotFoundPage /> },
//               ]
//             : [
//                   // Routes for non-logged-in users
//                   { path: '*', element: <NewUserPage /> },
//               ]),
//     ]);

//     return useRoutes(routes);
// }

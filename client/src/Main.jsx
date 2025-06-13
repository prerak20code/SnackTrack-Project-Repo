import { createRoot } from 'react-dom/client';
import './Styles/index.css';
import React from 'react';

import { RouterProvider } from 'react-router-dom';
import { router } from './Router';

import {
    UserContextProvider,
    PopupContextProvider,
    SideBarContextProvider,
    SearchContextProvider,
    StudentContextProvider,
    SnackContextProvider,
} from './Contexts';
import { NotificationsProvider } from './Contexts/notifications.Context';
import { DarkModeProvider } from './Contexts/DarkMode';

function Root() {
    return (
        <NotificationsProvider>
            <DarkModeProvider>
                <UserContextProvider>
                    <SnackContextProvider>
                        <StudentContextProvider>
                            <PopupContextProvider>
                                <SideBarContextProvider>
                                    <SearchContextProvider>
                                        <RouterProvider router={router} />
                                    </SearchContextProvider>
                                </SideBarContextProvider>
                            </PopupContextProvider>
                        </StudentContextProvider>
                    </SnackContextProvider>
                </UserContextProvider>
            </DarkModeProvider>
        </NotificationsProvider>
    );
}

createRoot(document.getElementById('root')).render(
    // <StrictMode>
    <Root />
    // </StrictMode>,
);

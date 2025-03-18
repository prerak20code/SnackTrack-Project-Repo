import { createRoot } from 'react-dom/client';
import './Styles/index.css';

import { RouterProvider } from 'react-router-dom';
import { router } from './Router';

import {
    UserContextProvider,
    PopupContextProvider,
    SideBarContextProvider,
    SearchContextProvider,
    ContractorContextProvider,
    StudentContextProvider,
    SnackContextProvider,
    EmailContextProvider,
} from './Contexts';

function Root() {
    return (
        <UserContextProvider>
            <SnackContextProvider>
                <EmailContextProvider>
                    <StudentContextProvider>
                        <ContractorContextProvider>
                            <PopupContextProvider>
                                <SideBarContextProvider>
                                    <SearchContextProvider>
                                        <RouterProvider router={router} />
                                    </SearchContextProvider>
                                </SideBarContextProvider>
                            </PopupContextProvider>
                        </ContractorContextProvider>
                    </StudentContextProvider>
                </EmailContextProvider>
            </SnackContextProvider>
        </UserContextProvider>
    );
}

createRoot(document.getElementById('root')).render(
    // <StrictMode>
    <Root />
    // </StrictMode>,
);

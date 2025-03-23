import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [adminVerified, setAdminVerified] = useState(false);

    return (
        <UserContext.Provider
            value={{ user, setUser, setAdminVerified, adminVerified }}
        >
            {children}
        </UserContext.Provider>
    );
};

const useUserContext = () => useContext(UserContext);

export { useUserContext, UserContextProvider };

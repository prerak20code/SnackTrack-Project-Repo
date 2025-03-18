import { createContext, useContext, useState } from 'react';

const EmailContext = createContext();

const EmailContextProvider = ({ children }) => {
    const [verified, setVerified] = useState(false);
    const [sendingMail, setSendingMail] = useState(false);

    return (
        <EmailContext.Provider
            value={{ verified, setVerified, sendingMail, setSendingMail }}
        >
            {children}
        </EmailContext.Provider>
    );
};

const useEmailContext = () => useContext(EmailContext);

export { useEmailContext, EmailContextProvider };

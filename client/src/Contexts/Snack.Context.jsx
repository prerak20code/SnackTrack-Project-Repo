import { useContext, createContext, useState } from 'react';

const SnackContext = createContext();

const SnackContextProvider = ({ children }) => {
    const [snacks, setSnacks] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    return (
        <SnackContext.Provider
            value={{ snacks, setSnacks, items, setItems, loading, setLoading }}
        >
            {children}
        </SnackContext.Provider>
    );
};

const useSnackContext = () => useContext(SnackContext);

export { useSnackContext, SnackContextProvider };

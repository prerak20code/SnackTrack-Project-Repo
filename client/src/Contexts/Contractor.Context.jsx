import { createContext, useContext, useState } from 'react';

const ContractorContext = createContext();

const ContractorContextProvider = ({ children }) => {
    const [snacks, setSnacks] = useState([]);
    const [items, setItems] = useState([]);
    const [targetSnack, setTargetSnack] = useState({});
    const [targetItem, setTargetItem] = useState({});

    return (
        <ContractorContext.Provider
            value={{
                snacks,
                setSnacks,
                targetSnack,
                setTargetSnack,
                items,
                setItems,
                targetItem,
                setTargetItem,
            }}
        >
            {children}
        </ContractorContext.Provider>
    );
};

const useContractorContext = () => useContext(ContractorContext);

export { useContractorContext, ContractorContextProvider };

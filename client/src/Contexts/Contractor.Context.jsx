import { createContext, useContext, useState } from 'react';

const ContractorContext = createContext();

const ContractorContextProvider = ({ children }) => {
    const [contractors, setContractors] = useState([]);
    const [targetContractor, setTargetContractor] = useState({});

    return (
        <ContractorContext.Provider
            value={{
                contractors,
                setContractors,
                targetContractor,
                setTargetContractor,
            }}
        >
            {children}
        </ContractorContext.Provider>
    );
};

const useContractorContext = () => useContext(ContractorContext);

export { useContractorContext, ContractorContextProvider };

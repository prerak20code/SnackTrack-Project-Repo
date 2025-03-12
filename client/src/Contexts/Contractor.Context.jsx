import { createContext, useContext, useState } from 'react';

const ContractorContext = createContext();

const ContractorContextProvider = ({ children }) => {
    const [students, setStudents] = useState([]);
    const [targetStudent, setTargetStudent] = useState({});

    return (
        <ContractorContext.Provider
            value={{ students, setStudents, targetStudent, setTargetStudent }}
        >
            {children}
        </ContractorContext.Provider>
    );
};

const useContractorContext = () => useContext(ContractorContext);

export { useContractorContext, ContractorContextProvider };

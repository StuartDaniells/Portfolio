import React, { createContext } from 'react';
import AllData from '../Hooks/AllData';

type ContextType = ReturnType<typeof AllData>;

export const MyContext = createContext<ContextType | undefined>(undefined);

interface ContextProviderProps {
    children: React.ReactNode;
}

const ContextProvider = ({ children }: ContextProviderProps) => {
    const value = AllData();
    return (
        <MyContext.Provider value={value}>
            {children}
        </MyContext.Provider>
    );
};

export default ContextProvider;

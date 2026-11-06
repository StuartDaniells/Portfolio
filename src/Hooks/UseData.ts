import { useContext } from 'react';
import { MyContext } from '../Context/ContextProvider';

const UseData = () => {
    const context = useContext(MyContext);
    if (context === undefined) {
        throw new Error("useData must be used within a ContextProvider");
    }
    return context;
};

export default UseData;

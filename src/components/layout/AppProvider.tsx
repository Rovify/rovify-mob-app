import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CreateBottomSheet } from '../features/create/CreateBottomSheet';

interface AppContextType {
    showCreateSheet: () => void;
    hideCreateSheet: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
};

interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [isCreateSheetVisible, setIsCreateSheetVisible] = useState(false);

    const showCreateSheet = () => setIsCreateSheetVisible(true);
    const hideCreateSheet = () => setIsCreateSheetVisible(false);

    return (
        <AppContext.Provider value={{ showCreateSheet, hideCreateSheet }}>
            {children}
            <CreateBottomSheet
                isVisible={isCreateSheetVisible}
                onClose={hideCreateSheet}
            />
        </AppContext.Provider>
    );
};
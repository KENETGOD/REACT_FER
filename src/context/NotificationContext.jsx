import {createContext, useContext} from 'react';

export const NotificationContext = createContext(null);

export const useNotification = () => {
    return useContext(NotificationContext);
};
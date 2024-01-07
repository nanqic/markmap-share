import { createContext, useContext, useState } from 'react';
import Notification from './Notification';

const NotificationContext = createContext();

export const NotificationProvider = ({ duration, children }) => {
  const [notification, setNotification] = useState(null);

  const showNotification = ({type, msg}) => {
    setNotification({ type, msg });

    setTimeout(() => {
      setNotification(null);
    }, duration);
  };

  return (
    <NotificationContext.Provider value={showNotification}>
      {children}
      {notification && <Notification {...notification} />}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  return useContext(NotificationContext);
};

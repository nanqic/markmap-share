import { createContext, useContext, useState } from 'react';
import Notification from './Notification';

const NotificationContext = createContext();

export const NotificationProvider = ({ duration, children }) => {
  const [notification, setNotification] = useState(null);

  const showNotification = (title, text) => {
    setNotification({ title, text });

    setTimeout(() => {
      setNotification(null);
    }, duration);
  };

  return (
    <NotificationContext.Provider value={showNotification}>
      {children}
      {notification && <Notification title={notification.title} text={notification.text} />}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  return useContext(NotificationContext);
};

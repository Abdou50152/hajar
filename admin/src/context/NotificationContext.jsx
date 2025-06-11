import React, { createContext, useContext, useState, useCallback } from 'react';
import Notification from '../components/shared/Notification';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Show a notification with specified type
  const showNotification = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type, duration }]);
    return id;
  }, []);

  // Show a success notification
  const showSuccess = useCallback((message, duration = 3000) => {
    return showNotification(message, 'success', duration);
  }, [showNotification]);

  // Show an error notification
  const showError = useCallback((message, duration = 3000) => {
    return showNotification(message, 'error', duration);
  }, [showNotification]);

  // Show a warning notification
  const showWarning = useCallback((message, duration = 3000) => {
    return showNotification(message, 'warning', duration);
  }, [showNotification]);

  // Show an info notification
  const showInfo = useCallback((message, duration = 3000) => {
    return showNotification(message, 'info', duration);
  }, [showNotification]);

  // Hide a specific notification by ID
  const hideNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{
      showNotification,
      showSuccess,
      showError,
      showWarning,
      showInfo,
      hideNotification,
      clearAllNotifications
    }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-3 max-h-screen overflow-hidden pointer-events-none">
        {notifications.map((notification, index) => (
          <div key={notification.id} className="pointer-events-auto" style={{ zIndex: 9999 - index }}>
            <Notification
              message={notification.message}
              type={notification.type}
              duration={notification.duration}
              onClose={() => hideNotification(notification.id)}
            />
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export default NotificationContext;

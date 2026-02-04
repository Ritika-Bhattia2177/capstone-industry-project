import { useState, useEffect } from 'react';

let notificationQueue = [];
let listeners = [];

export const showNotification = (message, type = 'success') => {
  const notification = {
    id: Date.now(),
    message,
    type, // 'success', 'error', 'info', 'warning'
    timestamp: Date.now()
  };
  
  notificationQueue.push(notification);
  listeners.forEach(listener => listener(notificationQueue));
  
  // Auto remove after 4 seconds
  setTimeout(() => {
    notificationQueue = notificationQueue.filter(n => n.id !== notification.id);
    listeners.forEach(listener => listener(notificationQueue));
  }, 4000);
};

const NotificationContainer = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const listener = (queue) => {
      setNotifications([...queue]);
    };
    
    listeners.push(listener);
    
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  const getNotificationStyle = (type) => {
    const baseStyle = {
      padding: '12px 20px',
      borderRadius: '8px',
      marginBottom: '10px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '14px',
      fontWeight: '500',
      animation: 'slideIn 0.3s ease-out',
      minWidth: '300px',
      maxWidth: '500px'
    };

    switch (type) {
      case 'success':
        return { ...baseStyle, backgroundColor: '#d5f4e6', color: '#27ae60', border: '1px solid #27ae60' };
      case 'error':
        return { ...baseStyle, backgroundColor: '#fadbd8', color: '#e74c3c', border: '1px solid #e74c3c' };
      case 'warning':
        return { ...baseStyle, backgroundColor: '#fff3cd', color: '#f39c12', border: '1px solid #f39c12' };
      case 'info':
        return { ...baseStyle, backgroundColor: '#d6eaf8', color: '#3498db', border: '1px solid #3498db' };
      default:
        return baseStyle;
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✖';
      case 'warning': return '⚠';
      case 'info': return 'ℹ';
      default: return '•';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
      <div style={{
        position: 'fixed',
        top: '80px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end'
      }}>
        {notifications.map(notification => (
          <div key={notification.id} style={getNotificationStyle(notification.type)}>
            <span style={{ fontSize: '18px' }}>{getIcon(notification.type)}</span>
            <span>{notification.message}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default NotificationContainer;

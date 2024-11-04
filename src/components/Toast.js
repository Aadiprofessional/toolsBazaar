import React, { useEffect } from 'react';

const Toast = ({ message, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    // Clean up the timer when the component unmounts or the duration changes
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!message) return null; // Don't render anything if there's no message

  return (
    <div style={styles.toast}>
      <p style={styles.message}>{message}</p>
      <button style={styles.closeButton} onClick={onClose}>
        &times;
      </button>
    </div>
  );
};

const styles = {
  toast: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: '#333',
    color: '#fff',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '300px',
  },
  message: {
    margin: 0,
    flex: 1,
    paddingRight: '10px',
    fontSize: '14px',
  },
  closeButton: {
    backgroundColor: 'transparent',
    color: '#fff',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    padding: 0,
  },
};

export default Toast;

import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';

const FlashContext = createContext();

export const useFlash = () => {
  const context = useContext(FlashContext);
  if (!context) {
    throw new Error('useFlash must be used within a FlashProvider');
  }
  return context;
};

export function FlashProvider({ children }) {
  const [messages, setMessages] = useState([]);

  const showFlash = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random();
    setMessages(prev => [...prev, { id, message, type, duration }]);
    
    if (duration > 0) {
      setTimeout(() => {
        setMessages(prev => prev.filter(m => m.id !== id));
      }, duration);
    }
    
    return id;
  }, []);

  const removeFlash = useCallback((id) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  }, []);

  const success = useCallback((msg, duration) => showFlash(msg, 'success', duration), [showFlash]);
  const error = useCallback((msg, duration) => showFlash(msg, 'error', duration), [showFlash]);
  const warning = useCallback((msg, duration) => showFlash(msg, 'warning', duration), [showFlash]);
  const info = useCallback((msg, duration) => showFlash(msg, 'info', duration), [showFlash]);

  return (
    <FlashContext.Provider value={{ showFlash, removeFlash, success, error, warning, info }}>
      {children}
      <FlashContainer messages={messages} onRemove={removeFlash} />
    </FlashContext.Provider>
  );
}

function FlashContainer({ messages, onRemove }) {
  if (messages.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      maxWidth: '400px'
    }}>
      {messages.map(msg => (
        <FlashItem key={msg.id} {...msg} onRemove={() => onRemove(msg.id)} />
      ))}
    </div>
  );
}

function FlashItem({ message, type, onRemove }) {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onRemove, 300);
  };

  const colors = {
    success: { bg: '#d4edda', border: '#28a745', text: '#155724', icon: '✓' },
    error: { bg: '#f8d7da', border: '#dc3545', text: '#721c24', icon: '✕' },
    warning: { bg: '#fff3cd', border: '#ffc107', text: '#856404', icon: '⚠' },
    info: { bg: '#d1ecf1', border: '#17a2b8', text: '#0c5460', icon: 'ℹ' }
  };

  const style = colors[type] || colors.info;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '14px 18px',
        backgroundColor: style.bg,
        borderLeft: `4px solid ${style.border}`,
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        animation: isExiting ? 'slideOut 0.3s ease forwards' : 'slideIn 0.3s ease',
        color: style.text
      }}
    >
      <span style={{ 
        fontSize: '18px', 
        fontWeight: 'bold',
        lineHeight: '1'
      }}>
        {style.icon}
      </span>
      <span style={{ 
        flex: 1, 
        fontSize: '14px', 
        lineHeight: '1.4',
        fontWeight: '500'
      }}>
        {message}
      </span>
      <button
        onClick={handleClose}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '18px',
          cursor: 'pointer',
          color: style.text,
          opacity: 0.7,
          padding: 0,
          lineHeight: 1
        }}
      >
        ×
      </button>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default FlashProvider;

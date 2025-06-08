import React from 'react';

function Loading({ text = "Loading..." }) {
  return (
    <div style={{
      textAlign: 'center',
      margin: '48px auto',
      color: '#00bcd4',
      fontWeight: 600,
      fontSize: '1.3rem',
      letterSpacing: '1px'
    }}>
      <div className="spinner" style={{
        margin: '0 auto 18px auto',
        border: '4px solid #23272b',
        borderTop: '4px solid #00bcd4',
        borderRadius: '50%',
        width: 48,
        height: 48,
        animation: 'spin 1s linear infinite'
      }} />
      <div>{text}</div>
      <style>
        {`@keyframes spin { 100% { transform: rotate(360deg); } }`}
      </style>
    </div>
  );
}

export default Loading;
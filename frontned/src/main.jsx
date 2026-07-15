import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3200,
          className: 'bg-white text-text shadow-soft',
          style: {
            borderRadius: '18px',
            padding: '14px 16px',
            border: '1px solid rgba(254, 205, 211, 0.85)',
          },
        }}
      />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

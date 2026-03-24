import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress generic "Script error." which is often from third-party scripts
// like JotForm that don't have CORS headers but still work.
if (typeof window !== 'undefined') {
  const originalOnError = window.onerror;
  window.onerror = function(message, source, lineno, colno, error) {
    if (message === 'Script error.') {
      // console.warn('Suppressed third-party "Script error."');
      return true; // Suppress the error
    }
    if (originalOnError) {
      return originalOnError.apply(this, [message, source, lineno, colno, error]);
    }
    return false;
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

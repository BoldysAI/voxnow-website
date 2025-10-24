import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { DomainProvider } from './contexts/DomainContext';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DomainProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </DomainProvider>
  </StrictMode>
);
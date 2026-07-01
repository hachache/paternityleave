import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'framer-motion';
import { ErrorBoundary } from './components/ErrorBoundary';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <MotionConfig reducedMotion="user" transition={{ type: 'spring', stiffness: 260, damping: 26 }}>
        <App />
      </MotionConfig>
    </ErrorBoundary>
  </StrictMode>
);

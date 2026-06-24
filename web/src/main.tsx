import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import { App } from './App';
import { useUserStore } from './stores/userStore';

function AppWrapper() {
  const initialize = useUserStore((state) => state.initialize);
  
  useEffect(() => {
    initialize();
  }, [initialize]);

  return <App />;
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <AppWrapper />
    </StrictMode>
  );
} else {
  console.error('Root element not found');
}

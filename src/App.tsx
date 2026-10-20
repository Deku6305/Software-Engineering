import React, { useState, useEffect } from 'react';
import { VisitorApp } from './VisitorApp.tsx';
import { AdminApp } from './AdminApp.tsx';

export default function App() {
  // Determine initial route based on URL pathname
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname;
      if (p.startsWith('/admin')) return '/admin';
    }
    return '/';
  });

  // Keep state synchronized with browser navigation (Back / Forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      const p = window.location.pathname;
      setCurrentPath(p.startsWith('/admin') ? '/admin' : '/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Programmatic navigation helper
  const navigate = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path.startsWith('/admin') ? '/admin' : '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route to Admin App or Visitor App
  if (currentPath === '/admin') {
    return (
      <AdminApp
        onNavigateToVisitor={() => navigate('/')}
        onSimulateScanCode={(code) => {
          navigate('/');
          // Small timeout to allow visitor app to mount and trigger scan
          setTimeout(() => {
            const scannerTabBtn = document.querySelector('[data-tab="qrScanner"]') as HTMLButtonElement;
            if (scannerTabBtn) scannerTabBtn.click();
          }, 100);
        }}
      />
    );
  }

  return (
    <VisitorApp
      onNavigateToAdmin={() => navigate('/admin')}
    />
  );
}

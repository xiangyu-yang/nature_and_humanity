import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Sidebar, MobileNav } from './Nav';

export function Layout() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 min-w-0 pb-20 md:pb-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-6 md:py-8 animate-fade-in" key={location.pathname}>
          <Outlet />
        </div>
      </main>
      <MobileNav />
    </div>
  );
}

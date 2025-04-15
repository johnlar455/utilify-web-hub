
import React from 'react';
import Header from './Header';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className={`flex-grow ${isHomePage ? 'max-w-screen-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6' : 'container py-6'}`}>
        {children}
      </main>
      <footer className="bg-background border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Utilify Web Hub. All tools run locally in your browser.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

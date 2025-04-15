
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const Header: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  return (
    <header className="border-b">
      <div className="container py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
              Utilify
            </span>
          </Link>

          {pathSegments.length > 0 && (
            <nav className="flex items-center text-sm text-muted-foreground">
              <Link to="/" className="flex items-center hover:text-foreground transition-colors">
                <Home className="h-4 w-4 mr-1" />
                Home
              </Link>
              
              {pathSegments.map((segment, index) => {
                // Build the path for this breadcrumb
                const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
                
                // Format the segment name for display
                const displayName = segment
                  .split('-')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');
                
                return (
                  <React.Fragment key={path}>
                    <ChevronRight className="h-4 w-4 mx-1" />
                    <Link 
                      to={path}
                      className={cn(
                        "hover:text-foreground transition-colors",
                        index === pathSegments.length - 1 ? "font-medium text-foreground" : ""
                      )}
                    >
                      {displayName}
                    </Link>
                  </React.Fragment>
                );
              })}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

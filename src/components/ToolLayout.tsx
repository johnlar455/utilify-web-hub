
import React from 'react';
import { cn } from '@/lib/utils';

interface ToolLayoutProps {
  title: string;
  description: string;
  category: string;
  categoryColor: string;
  children: React.ReactNode;
  instructions?: React.ReactNode;
}

const ToolLayout: React.FC<ToolLayoutProps> = ({
  title,
  description,
  category,
  categoryColor,
  children,
  instructions
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className={cn(`text-${categoryColor} text-sm font-medium`)}>{category}</div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground max-w-3xl">{description}</p>
      </div>

      {instructions && (
        <div className="bg-muted/50 rounded-lg p-4 border">
          <h2 className="font-medium mb-2">How to use:</h2>
          {instructions}
        </div>
      )}

      <div className="bg-card rounded-lg border shadow-sm">
        {children}
      </div>
    </div>
  );
};

export default ToolLayout;

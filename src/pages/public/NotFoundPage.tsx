import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Hospital, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4 space-y-4">
      <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
        <Hospital className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">404</h1>
      <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Page Not Found</h2>
      <p className="text-xs text-slate-500 max-w-sm">
        The requested medical portal page does not exist or has been moved.
      </p>
      <Link to="/">
        <Button variant="primary" icon={<Home className="w-4 h-4" />}>
          Return to Hospital Homepage
        </Button>
      </Link>
    </div>
  );
};

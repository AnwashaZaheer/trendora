
import { Link } from 'react-router-dom';
import { AlertTriangle, Home, ShoppingCart } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex-grow max-w-7xl mx-auto px-4 py-20 text-center flex flex-col items-center justify-center gap-6">
      <div className="bg-brand-50 dark:bg-brand-950/40 p-6 rounded-full text-brand-600 border border-brand-100 dark:border-brand-900/30">
        <AlertTriangle className="w-16 h-16 animate-bounce" />
      </div>
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
          Page Not Found
        </h1>
        <p className="text-slate-500 text-sm max-w-md">
          We are sorry, but the page you are looking for does not exist, has been removed, or is temporarily unavailable.
        </p>
      </div>

      <div className="flex gap-4 mt-2">
        <Link to="/">
          <Button className="flex items-center gap-2">
            <Home className="w-4 h-4" /> Go Home
          </Button>
        </Link>
        <Link to="/products">
          <Button variant="outline" className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" /> Go Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}

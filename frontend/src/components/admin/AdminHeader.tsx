import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, ExternalLink, ShieldCheck } from 'lucide-react';

interface AdminHeaderProps {
  collapsed: boolean;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ collapsed }) => {
  const { user } = useAuth();

  return (
    <header className={`h-16 bg-slate-900 border-b border-slate-800 fixed top-0 right-0 z-20 transition-all duration-300 flex items-center justify-between px-6 ${
      collapsed ? 'left-20' : 'left-64'
    }`}>
      <div className="flex items-center space-x-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400" />
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider hidden sm:inline">Panel de Administración Enterprise</span>
      </div>

      <div className="flex items-center space-x-4">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all border border-slate-700"
        >
          <span>Ver Sitio Público</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <div className="flex items-center space-x-3 border-l border-slate-800 pl-4">
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
            alt=""
            className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/30"
          />
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-white">{user?.name}</p>
            <p className="text-[10px] text-blue-400 font-semibold">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

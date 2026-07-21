import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Newspaper,
  Cpu,
  Hammer,
  Users,
  MessageSquare,
  Settings,
  ShieldAlert,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, roles: ['ADMIN', 'EDITOR', 'SUPERVISOR'] },
    { label: 'Noticias & Blog', path: '/admin/news', icon: Newspaper, roles: ['ADMIN', 'EDITOR', 'SUPERVISOR'] },
    { label: 'Innovación', path: '/admin/projects-innovation', icon: Cpu, roles: ['ADMIN', 'EDITOR', 'SUPERVISOR'] },
    { label: 'Construcción', path: '/admin/projects-construction', icon: Hammer, roles: ['ADMIN', 'EDITOR', 'SUPERVISOR'] },
    { label: 'Usuarios & Roles', path: '/admin/users', icon: Users, roles: ['ADMIN'] },
    { label: 'Contactos', path: '/admin/contacts', icon: MessageSquare, roles: ['ADMIN', 'EDITOR', 'SUPERVISOR'] },
    { label: 'Configuración Sitio', path: '/admin/settings', icon: Settings, roles: ['ADMIN'] },
    { label: 'Auditoría & Backup', path: '/admin/audit-logs', icon: ShieldAlert, roles: ['ADMIN'] }
  ];

  return (
    <aside className={`fixed top-0 left-0 bottom-0 z-30 bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col justify-between ${
      collapsed ? 'w-20' : 'w-64'
    }`}>
      <div>
        {/* Header & Logo */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="p-1 rounded-lg bg-slate-950 border border-slate-800 shadow-sm flex items-center justify-center">
                <img src="/logo.png" alt="Logo" className="h-7 w-auto object-contain filter drop-shadow-[0_0_4px_rgba(59,130,246,0.5)] brightness-110 contrast-125" />
              </div>
              <span className="font-display font-bold text-white text-xs">Arions Builds AI SpA</span>
            </div>
          )}
          {collapsed && (
            <div className="p-1 rounded-lg bg-slate-950 border border-slate-800 shadow-sm flex items-center justify-center mx-auto">
              <img src="/logo.png" alt="Logo" className="h-7 w-auto object-contain filter drop-shadow-[0_0_4px_rgba(59,130,246,0.5)] brightness-110 contrast-125" />
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* User Badge */}
        {!collapsed && user && (
          <div className="p-4 mx-3 my-4 bg-slate-950/60 rounded-2xl border border-slate-800 flex items-center space-x-3">
            <img src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} alt="" className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/30" />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <span className="inline-block text-[10px] font-bold text-blue-400 uppercase tracking-wider">{user.role}</span>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5">
          {menuItems
            .filter((item) => !user || item.roles.includes(user.role))
            .map((item) => {
              const IconComp = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    active
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <IconComp className="w-5 h-5 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
        </nav>
      </div>

      {/* Footer Logout */}
      <div className="p-3 border-t border-slate-800">
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-semibold text-sm text-rose-400 hover:bg-rose-500/10 transition-all"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
};

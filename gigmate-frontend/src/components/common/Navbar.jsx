import React from 'react';
import { Menu, LogOut, User, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from './StatusBadge';

export const Navbar = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 sm:px-6 backdrop-blur-md">
      {/* Left: Mobile hamburger & Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-hidden lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-black text-lg">
            G
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-800 bg-clip-text text-transparent">
            Gig<span className="text-indigo-600">Mate</span>
          </span>
        </div>
      </div>

      {/* Right: User Status & Profile Actions */}
      <div className="flex items-center gap-3">
        {user?.role && (
          <div className="hidden sm:block">
            <StatusBadge status={user.role} />
          </div>
        )}

        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs font-semibold text-slate-800 truncate max-w-[150px]">
              {user?.email}
            </span>
            <span className="text-[10px] text-slate-400 capitalize">
              {user?.role ? user.role.replace('ROLE_', '').toLowerCase() : 'Authenticated'}
            </span>
          </div>

          <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-semibold text-sm">
            <User className="w-4 h-4 text-slate-500" />
          </div>

          <button
            onClick={logout}
            title="Sign out"
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

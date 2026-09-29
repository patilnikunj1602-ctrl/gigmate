import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  CalendarDays,
  FileCheck,
  Award,
  User,
  PlusCircle,
  Briefcase,
  Users,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const studentNavItems = [
    { label: 'Dashboard', to: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Find Opportunities', to: '/student/gigs', icon: Search },
    { label: 'Availability Calendar', to: '/student/availability', icon: CalendarDays },
    { label: 'My Applications', to: '/student/applications', icon: FileCheck },
    { label: 'Certificates & History', to: '/student/certificates', icon: Award },
    { label: 'Volunteer Profile', to: '/student/profile', icon: User },
  ];

  const recruiterNavItems = [
    { label: 'Dashboard', to: '/recruiter/dashboard', icon: LayoutDashboard },
    { label: 'Post Opportunity', to: '/recruiter/post-gig', icon: PlusCircle },
    { label: 'My Campaigns', to: '/recruiter/manage-gigs', icon: Briefcase },
  ];

  const adminNavItems = [
    { label: 'System Overview', to: '/admin/dashboard', icon: ShieldCheck },
  ];

  const navItems =
    user?.role === 'ROLE_STUDENT'
      ? studentNavItems
      : user?.role === 'ROLE_RECRUITER'
      ? recruiterNavItems
      : adminNavItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200/80 bg-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header on mobile */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-sm">
              G
            </div>
            <span className="font-bold text-lg text-slate-900">GigMate</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Role Card */}
        <div className="p-4 mx-3 my-4 rounded-xl bg-indigo-50/60 border border-indigo-100/80 text-xs">
          <div className="font-semibold text-indigo-950 uppercase tracking-wider text-[11px]">
            Active Workspace
          </div>
          <div className="text-slate-600 mt-0.5 truncate">
            {user?.role === 'ROLE_STUDENT'
              ? 'Student Volunteer Portal'
              : user?.role === 'ROLE_RECRUITER'
              ? 'Event Recruiter Workspace'
              : 'Administration Console'}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5 px-3 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-100 text-center text-xs text-slate-400">
          GigMate Platform v1.0.0
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

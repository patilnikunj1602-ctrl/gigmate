import React from 'react';

export const StatusBadge = ({ status, className = '' }) => {
  if (!status) return null;

  const normalized = status.toUpperCase();

  const config = {
    // Application statuses
    PENDING: {
      bg: 'bg-amber-100 text-amber-800 border-amber-200',
      dot: 'bg-amber-500',
      label: 'Pending Review',
    },
    APPROVED: {
      bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      dot: 'bg-emerald-500',
      label: 'Approved',
    },
    HIRED: {
      bg: 'bg-blue-100 text-blue-800 border-blue-200',
      dot: 'bg-blue-500',
      label: 'Hired / Assigned',
    },
    REJECTED: {
      bg: 'bg-rose-100 text-rose-800 border-rose-200',
      dot: 'bg-rose-500',
      label: 'Rejected',
    },
    COMPLETED: {
      bg: 'bg-purple-100 text-purple-800 border-purple-200',
      dot: 'bg-purple-500',
      label: 'Completed',
    },

    // Gig campaign statuses
    OPEN: {
      bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      dot: 'bg-emerald-500',
      label: 'Open',
    },
    CLOSED: {
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
      dot: 'bg-slate-400',
      label: 'Closed',
    },

    // Role badges
    ROLE_STUDENT: {
      bg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      dot: 'bg-indigo-500',
      label: 'Student Volunteer',
    },
    ROLE_RECRUITER: {
      bg: 'bg-teal-100 text-teal-800 border-teal-200',
      dot: 'bg-teal-500',
      label: 'Recruiter / Organizer',
    },
    ROLE_ADMIN: {
      bg: 'bg-purple-100 text-purple-800 border-purple-200',
      dot: 'bg-purple-500',
      label: 'Administrator',
    },
  }[normalized] || {
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
    label: status,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};

export default StatusBadge;

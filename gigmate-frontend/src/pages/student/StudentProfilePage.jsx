import React, { useState, useEffect } from 'react';
import { User, Mail, School, Heart, ShieldCheck, Calendar, Briefcase, Award, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import dashboardService from '../../api/dashboardService';
import reportingService from '../../api/reportingService';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export const StudentProfilePage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ freeDays: 0, applications: 0, completed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileStats();
  }, []);

  const fetchProfileStats = async () => {
    try {
      setLoading(true);
      const [freeDays, apps, completed] = await Promise.allSettled([
        dashboardService.getMyFreeDays(),
        dashboardService.getMyApplications(),
        reportingService.getStudentSummary('COMPLETED'),
      ]);

      setStats({
        freeDays: freeDays.status === 'fulfilled' ? freeDays.value?.length || 0 : 0,
        applications: apps.status === 'fulfilled' ? apps.value?.length || 0 : 0,
        completed: completed.status === 'fulfilled' ? completed.value?.length || 0 : 0,
      });
    } catch (e) {
      console.error('Error fetching profile stats:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Volunteer Profile</h1>
        <p className="text-sm text-slate-500 mt-1">
          Your student account credentials, availability records, and platform status.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 text-white flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-indigo-600 border-2 border-indigo-400 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-indigo-950/40">
            {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'S'}
          </div>

          <div className="text-center sm:text-left space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold">{user?.name || user?.email?.split('@')[0]}</h2>
              <StatusBadge status={user?.role} />
            </div>
            <p className="text-xs text-indigo-200 flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              {user?.email}
            </p>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                <School className="w-4 h-4 text-indigo-600" />
                Affiliated Institution
              </div>
              <div className="text-sm font-bold text-slate-800">
                {user?.collegeName || 'Student Volunteer Network'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Platform Verification
              </div>
              <div className="text-sm font-bold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Authenticated JWT Session
              </div>
            </div>
          </div>

          {/* Activity Statistics */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Platform Participation
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
                <div className="text-2xl font-black text-indigo-600">{stats.freeDays}</div>
                <div className="text-xs font-medium text-slate-600 mt-0.5">Free Days</div>
              </div>
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                <div className="text-2xl font-black text-blue-600">{stats.applications}</div>
                <div className="text-xs font-medium text-slate-600 mt-0.5">Applications</div>
              </div>
              <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100">
                <div className="text-2xl font-black text-purple-600">{stats.completed}</div>
                <div className="text-xs font-medium text-slate-600 mt-0.5">Certificates</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;

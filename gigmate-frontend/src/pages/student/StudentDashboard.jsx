import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Briefcase, Award, CheckCircle2, ArrowRight, Search, Clock } from 'lucide-react';
import dashboardService from '../../api/dashboardService';
import reportingService from '../../api/reportingService';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { useAuth } from '../../context/AuthContext';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [freeDays, setFreeDays] = useState([]);
  const [applications, setApplications] = useState([]);
  const [completedGigs, setCompletedGigs] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [freeDaysData, appsData, completedData] = await Promise.allSettled([
        dashboardService.getMyFreeDays(),
        dashboardService.getMyApplications(),
        reportingService.getStudentSummary('COMPLETED'),
      ]);

      if (freeDaysData.status === 'fulfilled') {
        setFreeDays(freeDaysData.value || []);
      }
      if (appsData.status === 'fulfilled') {
        setApplications(appsData.value || []);
      }
      if (completedData.status === 'fulfilled') {
        setCompletedGigs(completedData.value || []);
      }
    } catch (err) {
      console.error('Error fetching student dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const hiredCount = applications.filter((a) =>
    ['APPROVED', 'HIRED'].includes(a.status?.toUpperCase())
  ).length;

  if (loading) {
    return <LoadingSpinner text="Loading volunteer dashboard..." size="lg" />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 p-6 sm:p-8 text-white shadow-xl shadow-indigo-950/10">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold backdrop-blur-md mb-3">
            Student Volunteer Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || user?.email?.split('@')[0]}!
          </h1>
          <p className="mt-2 text-indigo-200 text-sm sm:text-base leading-relaxed">
            Manage your schedule, find volunteer opportunities aligned with your free days, and earn verifiable certificates.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/student/availability"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-950 text-sm font-bold shadow-md hover:bg-indigo-50 transition-colors"
            >
              <Calendar className="w-4 h-4 text-indigo-600" />
              Update Free Days
            </Link>
            <Link
              to="/student/gigs"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-700/60 hover:bg-indigo-700 border border-indigo-500/30 text-white text-sm font-semibold transition-colors"
            >
              <Search className="w-4 h-4" />
              Explore Gigs
            </Link>
          </div>
        </div>

        {/* Ambient background accent */}
        <div className="absolute right-0 top-0 h-full w-1/3 bg-radial from-indigo-500/20 to-transparent pointer-events-none" />
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Availability Registered"
          value={freeDays.length}
          subtitle="Days marked as free"
          icon={Calendar}
          color="indigo"
        />
        <StatCard
          title="Submitted Applications"
          value={applications.length}
          subtitle="Total gigs applied for"
          icon={Briefcase}
          color="blue"
        />
        <StatCard
          title="Approved / Hired"
          value={hiredCount}
          subtitle="Confirmed volunteer slots"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Earned Certificates"
          value={completedGigs.length}
          subtitle="Verified PDF credentials"
          icon={Award}
          color="purple"
        />
      </div>

      {/* Recent Applications Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Applications</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live status tracking for your submitted volunteer gigs
            </p>
          </div>
          <Link
            to="/student/applications"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            View all
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Briefcase}
              title="No applications yet"
              description="Browse opportunities and apply to volunteer gigs matching your schedule."
              actionLabel="Find Opportunities"
              onAction={() => (window.location.href = '/student/gigs')}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Opportunity</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Event Date</th>
                  <th className="px-6 py-3.5">Organizer</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {applications.slice(0, 5).map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {app.gig?.title || `Gig #${app.gig?.id || app.id}`}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-500">
                      <span className="px-2.5 py-1 bg-slate-100 rounded-lg">
                        {app.gig?.category || 'General'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {app.gig?.gigDate ? (
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {app.gig.gigDate}
                        </div>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600">
                      {app.gig?.recruiter?.name || app.gig?.recruiter?.email || 'Organizer'}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={app.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Free Days Registered Quick Preview */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Registered Availability</h3>
            <p className="text-xs text-slate-500">Dates when you are ready to volunteer</p>
          </div>
          <Link
            to="/student/availability"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Manage Dates →
          </Link>
        </div>

        {freeDays.length === 0 ? (
          <p className="text-sm text-slate-500 italic">
            You haven't marked any free dates yet. Mark dates to unlock automated gig matching!
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {freeDays.map((fd) => (
              <div
                key={fd.id}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700"
              >
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                {fd.availableDate}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;

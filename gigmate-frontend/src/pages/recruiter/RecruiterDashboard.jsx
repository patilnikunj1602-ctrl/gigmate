import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Briefcase, Users, CheckCircle2, ArrowRight, Calendar, Eye, Layers } from 'lucide-react';
import dashboardService from '../../api/dashboardService';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { useAuth } from '../../context/AuthContext';

export const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalApplicants, setTotalApplicants] = useState(0);

  useEffect(() => {
    fetchRecruiterData();
  }, []);

  const fetchRecruiterData = async () => {
    try {
      setLoading(true);
      const gigList = await dashboardService.getRecruiterGigs();
      setGigs(gigList || []);

      // Fetch applicant counts across recruiter gigs
      if (gigList && gigList.length > 0) {
        const appPromises = gigList.map((g) =>
          dashboardService.getGigApplications(g.id).catch(() => [])
        );
        const appResults = await Promise.all(appPromises);
        const count = appResults.reduce((acc, curr) => acc + (curr?.length || 0), 0);
        setTotalApplicants(count);
      }
    } catch (err) {
      console.error('Error fetching recruiter gigs:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalQuota = gigs.reduce((sum, g) => sum + (Number(g.quota) || 0), 0);
  const openCampaigns = gigs.filter((g) => g.status === 'OPEN').length;

  if (loading) {
    return <LoadingSpinner text="Loading organizer workspace..." size="lg" />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 p-6 sm:p-8 text-white shadow-xl shadow-teal-950/10">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-teal-200 text-xs font-semibold backdrop-blur-md mb-3">
            Event & Campaign Coordinator Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {user?.name || user?.email?.split('@')[0]}!
          </h1>
          <p className="mt-2 text-teal-100 text-sm sm:text-base leading-relaxed">
            Manage your volunteer positions, review student applications, approve candidates, and issue completion certificates.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/recruiter/post-gig"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-teal-950 text-sm font-bold shadow-md hover:bg-teal-50 transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-teal-600" />
              Publish New Gig
            </Link>
            <Link
              to="/recruiter/manage-gigs"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-800/80 hover:bg-teal-700 border border-teal-600/40 text-white text-sm font-semibold transition-colors"
            >
              <Users className="w-4 h-4" />
              Applicant Tracking (ATS)
            </Link>
          </div>
        </div>

        <div className="absolute right-0 top-0 h-full w-1/3 bg-radial from-teal-500/20 to-transparent pointer-events-none" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Campaigns"
          value={gigs.length}
          subtitle={`${openCampaigns} currently open`}
          icon={Layers}
          color="indigo"
        />
        <StatCard
          title="Volunteer Quota"
          value={totalQuota}
          subtitle="Total spots requested"
          icon={Users}
          color="emerald"
        />
        <StatCard
          title="Candidate Applications"
          value={totalApplicants}
          subtitle="Student submissions"
          icon={Briefcase}
          color="blue"
        />
        <StatCard
          title="Active Postings"
          value={openCampaigns}
          subtitle="Receiving applications"
          icon={CheckCircle2}
          color="purple"
        />
      </div>

      {/* Published Gigs Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Your Volunteer Campaigns</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review published requirements and inspect incoming student applicants
            </p>
          </div>
          <Link
            to="/recruiter/post-gig"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            New Gig
          </Link>
        </div>

        {gigs.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Briefcase}
              title="No campaigns published yet"
              description="Publish your first volunteer opportunity to start matching with interested students."
              actionLabel="Post New Gig"
              onAction={() => (window.location.href = '/recruiter/post-gig')}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Campaign Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Event Date</th>
                  <th className="px-6 py-4">Quota</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Applicant Management</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {gigs.map((gig) => (
                  <tr key={gig.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      <div>{gig.title}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-1 max-w-xs font-normal">
                        {gig.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-600">
                      <span className="px-2.5 py-1 bg-slate-100 rounded-lg">
                        {gig.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {gig.gigDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-800">
                      {gig.quota} Spots
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={gig.status || 'OPEN'} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/recruiter/gigs/${gig.id}/applications`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200 transition-colors"
                      >
                        <Users className="w-3.5 h-3.5" />
                        Review Applicants
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;

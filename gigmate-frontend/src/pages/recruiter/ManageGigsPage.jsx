import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Calendar, Users, PlusCircle, Search, ExternalLink, Filter, Layers } from 'lucide-react';
import dashboardService from '../../api/dashboardService';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';

export const ManageGigsPage = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [applicantCounts, setApplicantCounts] = useState({});

  const { error: toastError } = useToast();

  useEffect(() => {
    fetchGigs();
  }, []);

  const fetchGigs = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getRecruiterGigs();
      setGigs(data || []);

      // Pre-fetch applicant counts
      if (data && data.length > 0) {
        const counts = {};
        await Promise.all(
          data.map(async (g) => {
            try {
              const apps = await dashboardService.getGigApplications(g.id);
              counts[g.id] = apps?.length || 0;
            } catch {
              counts[g.id] = 0;
            }
          })
        );
        setApplicantCounts(counts);
      }
    } catch (err) {
      console.error('Error fetching recruiter gigs:', err);
      toastError('Could not load your campaigns.');
    } finally {
      setLoading(false);
    }
  };

  const filteredGigs = gigs.filter((g) => {
    const q = searchTerm.toLowerCase();
    return (
      g.title?.toLowerCase().includes(q) ||
      g.category?.toLowerCase().includes(q) ||
      g.description?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Manage Campaigns & Applicant Tracking
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review your active and past volunteer campaigns and manage applicants.
          </p>
        </div>

        <Link
          to="/recruiter/post-gig"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Create New Campaign
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search campaigns by title, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
          />
        </div>
        <span className="text-xs text-slate-400 font-medium hidden sm:inline">
          {filteredGigs.length} Total Campaigns
        </span>
      </div>

      {/* Campaigns Grid */}
      {loading ? (
        <LoadingSpinner text="Loading campaigns..." size="lg" />
      ) : filteredGigs.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No campaigns found"
          description={
            gigs.length === 0
              ? 'You have not created any volunteer opportunities yet.'
              : 'No campaigns match your search term.'
          }
          actionLabel={gigs.length === 0 ? 'Create Campaign' : undefined}
          onAction={gigs.length === 0 ? () => (window.location.href = '/recruiter/post-gig') : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGigs.map((gig) => {
            const count = applicantCounts[gig.id] || 0;

            return (
              <div
                key={gig.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 text-xs font-semibold">
                      {gig.category}
                    </span>
                    <StatusBadge status={gig.status || 'OPEN'} />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {gig.title}
                  </h3>

                  <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {gig.description || 'No description provided.'}
                  </p>

                  <div className="mt-4 space-y-2 pt-4 border-t border-slate-100 text-xs text-slate-600 font-medium">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        Event Date:
                      </span>
                      <span className="font-semibold text-slate-800">{gig.gigDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Users className="w-3.5 h-3.5" />
                        Spots Quota:
                      </span>
                      <span className="font-semibold text-slate-800">{gig.quota} Volunteers</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                    <Users className="w-3.5 h-3.5" />
                    {count} {count === 1 ? 'Applicant' : 'Applicants'}
                  </span>

                  <Link
                    to={`/recruiter/gigs/${gig.id}/applications`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold transition-colors shadow-xs"
                  >
                    Manage ATS
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManageGigsPage;

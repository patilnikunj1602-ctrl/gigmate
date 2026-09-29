import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Calendar, Tag, Users, Check, AlertCircle, ArrowRight, Eye, Briefcase, Filter } from 'lucide-react';
import dashboardService from '../../api/dashboardService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

export const GigExplorer = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialDate = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const initialCategory = searchParams.get('category') || 'Tech';

  const [date, setDate] = useState(initialDate);
  const [category, setCategory] = useState(initialCategory);
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [appliedGigIds, setAppliedGigIds] = useState(new Set());
  const [selectedGig, setSelectedGig] = useState(null);
  const [applyingId, setApplyingId] = useState(null);

  const { success, error: toastError } = useToast();

  const categories = [
    'Tech',
    'Concerts',
    'NGOs',
    'Community',
    'Sports',
    'Education',
    'Healthcare',
    'Environment',
  ];

  useEffect(() => {
    fetchApplicationsAndMatch();
  }, []);

  const fetchApplicationsAndMatch = async () => {
    try {
      // First fetch student applications so we know which gigs they already applied to
      const myApps = await dashboardService.getMyApplications();
      const ids = new Set(myApps.map((a) => a.gig?.id).filter(Boolean));
      setAppliedGigIds(ids);
    } catch (e) {
      console.error('Error fetching applications for matching:', e);
    }
    handleSearch(initialDate, initialCategory);
  };

  const handleSearch = async (searchDate = date, searchCat = category) => {
    if (!searchDate || !searchCat) {
      toastError('Please specify both an event date and a category to search.');
      return;
    }

    try {
      setLoading(true);
      setSearchParams({ date: searchDate, category: searchCat });
      const matched = await dashboardService.getMatchedGigs(searchDate, searchCat);
      setGigs(matched || []);
    } catch (err) {
      console.error('Error matching gigs:', err);
      toastError('Could not execute gig matching engine.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (gigId) => {
    try {
      setApplyingId(gigId);
      const application = await dashboardService.applyToGig(gigId);
      success('Application submitted successfully! Track status in your applications.');
      setAppliedGigIds((prev) => new Set([...prev, gigId]));
      if (selectedGig?.id === gigId) {
        setSelectedGig(null);
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (typeof err.response?.data === 'string' ? err.response?.data : null) ||
        'Failed to apply for this gig.';
      toastError(msg);
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Volunteer Opportunity Matching Engine
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Search open campaigns matching your free calendar date and domain interests.
        </p>
      </div>

      {/* Filter / Search Bar Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end"
        >
          {/* Date Selector */}
          <div className="sm:col-span-4">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Event Date
            </label>
            <div className="relative">
              <Calendar className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800"
              />
            </div>
          </div>

          {/* Category Selector */}
          <div className="sm:col-span-5">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Category / Domain
            </label>
            <div className="relative">
              <Tag className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={category}
                list="category-suggestions"
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Type or select category..."
                required
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800"
              />
              <datalist id="category-suggestions">
                {categories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Search Button */}
          <div className="sm:col-span-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Find Matches
            </button>
          </div>
        </form>

        {/* Quick Category Badges */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Quick Categories:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setCategory(cat);
                handleSearch(date, cat);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                category === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">
          Available Matching Gigs ({gigs.length})
        </span>
        <span className="text-xs text-slate-500">
          Showing results for <span className="font-semibold text-indigo-600">{category}</span> on{' '}
          <span className="font-semibold text-indigo-600">{date}</span>
        </span>
      </div>

      {/* Gigs List */}
      {loading ? (
        <LoadingSpinner text="Searching matching volunteer gigs..." size="lg" />
      ) : gigs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No gigs matched this criteria"
          description={`There are currently no volunteer positions listed for category "${category}" on date ${date}. Try selecting another date or category.`}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.map((gig) => {
            const isApplied = appliedGigIds.has(gig.id);
            const isApplying = applyingId === gig.id;

            return (
              <div
                key={gig.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-indigo-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold">
                      {gig.category}
                    </span>
                    <StatusBadge status={gig.status || 'OPEN'} />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {gig.title}
                  </h3>

                  <p className="mt-2 text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {gig.description || 'No specific description provided for this opportunity.'}
                  </p>

                  <div className="mt-4 space-y-2 pt-4 border-t border-slate-100 text-xs text-slate-600 font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{gig.gigDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{gig.quota} Volunteer spots</span>
                    </div>
                    {gig.recruiter && (
                      <div className="flex items-center gap-2 text-slate-500">
                        <span className="font-semibold text-slate-700">Organizer:</span>
                        <span>{gig.recruiter.name || gig.recruiter.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setSelectedGig(gig)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 p-2 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Details
                  </button>

                  {isApplied ? (
                    <span className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                      <Check className="w-3.5 h-3.5" />
                      Applied
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApply(gig.id)}
                      disabled={isApplying || gig.status === 'CLOSED'}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {isApplying ? (
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <ArrowRight className="w-3.5 h-3.5" />
                      )}
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Gig Details Modal */}
      <Modal
        isOpen={!!selectedGig}
        onClose={() => setSelectedGig(null)}
        title={selectedGig?.title || 'Volunteer Opportunity Details'}
      >
        {selectedGig && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold">
                Category: {selectedGig.category}
              </span>
              <StatusBadge status={selectedGig.status || 'OPEN'} />
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Description & Responsibilities
              </h4>
              <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                {selectedGig.description || 'No description provided.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block font-medium">Scheduled Date</span>
                <span className="text-sm font-bold text-slate-800">{selectedGig.gigDate}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block font-medium">Quota / Positions</span>
                <span className="text-sm font-bold text-slate-800">
                  {selectedGig.quota} Volunteers Needed
                </span>
              </div>
            </div>

            {selectedGig.recruiter && (
              <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs">
                <span className="text-indigo-950 font-semibold block">Event Coordinator Contact</span>
                <span className="text-slate-700">
                  {selectedGig.recruiter.name} ({selectedGig.recruiter.email})
                </span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedGig(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
              >
                Close
              </button>
              {appliedGigIds.has(selectedGig.id) ? (
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                  <Check className="w-3.5 h-3.5" />
                  Already Applied
                </span>
              ) : (
                <button
                  onClick={() => handleApply(selectedGig.id)}
                  disabled={applyingId === selectedGig.id}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20"
                >
                  Submit Application
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default GigExplorer;

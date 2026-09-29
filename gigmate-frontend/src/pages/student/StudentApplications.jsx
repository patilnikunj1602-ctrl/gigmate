import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileCheck, Calendar, Download, Search, Filter, AlertCircle, Award, ExternalLink } from 'lucide-react';
import dashboardService from '../../api/dashboardService';
import reportingService from '../../api/reportingService';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';

export const StudentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);

  const { success, error: toastError } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getMyApplications();
      setApplications(data || []);
    } catch (err) {
      console.error('Error fetching student applications:', err);
      toastError('Could not load your applications.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = async (applicationId, gigTitle) => {
    try {
      setDownloadingId(applicationId);
      await reportingService.downloadCertificateFile(applicationId, gigTitle);
      success('Certificate downloaded successfully!');
    } catch (err) {
      console.error('Error downloading certificate:', err);
      toastError('Failed to generate or download certificate.');
    } finally {
      setDownloadingId(null);
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesStatus =
      filterStatus === 'ALL' ||
      app.status?.toUpperCase() === filterStatus.toUpperCase();

    const title = app.gig?.title?.toLowerCase() || '';
    const category = app.gig?.category?.toLowerCase() || '';
    const organizer = app.gig?.recruiter?.name?.toLowerCase() || '';
    const query = searchTerm.toLowerCase();

    const matchesSearch =
      title.includes(query) || category.includes(query) || organizer.includes(query);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          My Volunteer Applications
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Monitor your application lifecycle, recruiter reviews, and download completion certificates.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-4 justify-between items-center">
        {/* Status Pills */}
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {['ALL', 'PENDING', 'APPROVED', 'HIRED', 'COMPLETED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterStatus === st
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {st === 'ALL' ? 'All Applications' : st}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search opportunity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
          />
        </div>
      </div>

      {/* Applications Table / Cards */}
      {loading ? (
        <LoadingSpinner text="Loading applications..." size="lg" />
      ) : filteredApplications.length === 0 ? (
        <EmptyState
          icon={FileCheck}
          title="No applications match your filter"
          description={
            applications.length === 0
              ? 'You have not submitted any applications yet.'
              : 'Try changing your status filter or search keyword.'
          }
          actionLabel={applications.length === 0 ? 'Explore Opportunities' : undefined}
          onAction={
            applications.length === 0 ? () => (window.location.href = '/student/gigs') : undefined
          }
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">App ID</th>
                  <th className="px-6 py-4">Volunteer Opportunity</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Organizer</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 text-xs font-mono text-slate-400">#{app.id}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      <div>{app.gig?.title || `Gig #${app.gig?.id}`}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-1 max-w-xs font-normal">
                        {app.gig?.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-slate-600 font-semibold">
                        {app.gig?.category || 'General'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {app.gig?.gigDate || '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600">
                      {app.gig?.recruiter?.name || app.gig?.recruiter?.email || 'Organizer'}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      {app.status?.toUpperCase() === 'COMPLETED' ? (
                        <button
                          onClick={() => handleDownloadCertificate(app.id, app.gig?.title)}
                          disabled={downloadingId === app.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold border border-purple-200 transition-colors cursor-pointer"
                        >
                          {downloadingId === app.id ? (
                            <span className="w-3.5 h-3.5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Award className="w-3.5 h-3.5 text-purple-600" />
                          )}
                          Download Certificate
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 italic">In progress</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentApplications;

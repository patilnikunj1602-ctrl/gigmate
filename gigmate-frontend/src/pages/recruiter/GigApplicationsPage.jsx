import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, ArrowLeft, Check, X, Award, CheckCircle2, Clock, Mail, ShieldAlert, Sparkles } from 'lucide-react';
import dashboardService from '../../api/dashboardService';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';

export const GigApplicationsPage = () => {
  const { gigId } = useParams();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');

  const { success, error: toastError } = useToast();

  useEffect(() => {
    fetchApplications();
  }, [gigId]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getGigApplications(gigId);
      setApplications(data || []);
    } catch (err) {
      console.error('Error fetching gig applications:', err);
      toastError('Failed to load applicant list for this gig.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      setUpdatingId(applicationId);
      const updated = await dashboardService.updateApplicationStatus(applicationId, newStatus);
      success(`Applicant status updated to ${newStatus}!`);

      // Update state locally
      setApplications((prev) =>
        prev.map((app) => (app.id === applicationId ? { ...app, status: newStatus } : app))
      );
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (typeof err.response?.data === 'string' ? err.response?.data : null) ||
        'Failed to update applicant status.';
      toastError(msg);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (filterStatus === 'ALL') return true;
    return app.status?.toUpperCase() === filterStatus.toUpperCase();
  });

  const hiredCount = applications.filter((a) =>
    ['APPROVED', 'HIRED', 'COMPLETED'].includes(a.status?.toUpperCase())
  ).length;

  return (
    <div className="space-y-6">
      {/* Header & Back Button */}
      <div>
        <button
          onClick={() => navigate('/recruiter/manage-gigs')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Campaigns
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Live Applicant Tracking System (ATS)
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Review candidates, approve volunteer slots, and issue completion certificates for Gig #{gigId}.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
              {applications.length} Applicants Total
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
              {hiredCount} Confirmed Slots
            </span>
          </div>
        </div>
      </div>

      {/* Info notice about completion */}
      <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-indigo-950 text-xs flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Volunteer Certification Workflow:</span> When a student completes their volunteer shift, update their status to{' '}
          <span className="font-bold text-indigo-700 underline">COMPLETED</span>. This officially enables the student to download their digitally signed PDF certificate.
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs">
        {['ALL', 'PENDING', 'APPROVED', 'HIRED', 'COMPLETED', 'REJECTED'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterStatus === st
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
            }`}
          >
            {st === 'ALL' ? 'All Applicants' : st}
          </button>
        ))}
      </div>

      {/* Applicant List Table */}
      {loading ? (
        <LoadingSpinner text="Loading applicants..." size="lg" />
      ) : filteredApplications.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No applicants found"
          description={
            applications.length === 0
              ? 'No students have applied to this volunteer campaign yet.'
              : 'No applicants match the selected status filter.'
          }
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Application ID</th>
                  <th className="px-6 py-4">Student Volunteer</th>
                  <th className="px-6 py-4">Contact Email</th>
                  <th className="px-6 py-4">Current Status</th>
                  <th className="px-6 py-4 text-right">Update Workflow Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredApplications.map((app) => {
                  const isUpdating = updatingId === app.id;
                  const current = app.status?.toUpperCase();

                  return (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 text-xs font-mono text-slate-400">
                        #{app.id}
                      </td>

                      <td className="px-6 py-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                            {app.student?.name?.[0]?.toUpperCase() || 'S'}
                          </div>
                          <div>
                            <div>{app.student?.name || 'Student Volunteer'}</div>
                            <div className="text-[11px] text-slate-400 font-normal">
                              Registered Student Account
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          {app.student?.email}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={app.status} />
                      </td>

                      <td className="px-6 py-4 text-right">
                        {isUpdating ? (
                          <div className="inline-flex items-center gap-1.5 text-xs text-indigo-600">
                            <span className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                            Updating...
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5">
                            {/* Approve */}
                            {current !== 'APPROVED' && current !== 'HIRED' && current !== 'COMPLETED' && (
                              <button
                                onClick={() => handleUpdateStatus(app.id, 'APPROVED')}
                                title="Approve volunteer slot"
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold border border-emerald-200 transition-colors"
                              >
                                Approve
                              </button>
                            )}

                            {/* Hire */}
                            {current !== 'HIRED' && current !== 'COMPLETED' && (
                              <button
                                onClick={() => handleUpdateStatus(app.id, 'HIRED')}
                                title="Confirm assignment"
                                className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200 transition-colors"
                              >
                                Hire
                              </button>
                            )}

                            {/* Mark Completed (triggers certificate) */}
                            {current !== 'COMPLETED' && (
                              <button
                                onClick={() => handleUpdateStatus(app.id, 'COMPLETED')}
                                title="Mark task fulfilled & issue certificate"
                                className="px-2.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold border border-purple-200 transition-colors"
                              >
                                Mark Completed
                              </button>
                            )}

                            {/* Reject */}
                            {current !== 'REJECTED' && current !== 'COMPLETED' && (
                              <button
                                onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                                title="Reject application"
                                className="px-2 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 transition-colors"
                              >
                                Reject
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default GigApplicationsPage;

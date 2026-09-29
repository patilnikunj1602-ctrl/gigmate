import React, { useState, useEffect } from 'react';
import { Award, Download, Calendar, ShieldCheck, CheckCircle2, Sparkles, ExternalLink } from 'lucide-react';
import reportingService from '../../api/reportingService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';

export const CertificatesPage = () => {
  const [completedGigs, setCompletedGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  const { success, error: toastError } = useToast();

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const data = await reportingService.getStudentSummary('COMPLETED');
      setCompletedGigs(data || []);
    } catch (err) {
      console.error('Error fetching certificates:', err);
      toastError('Could not load completed volunteer credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (applicationId, gigTitle) => {
    try {
      setDownloadingId(applicationId);
      await reportingService.downloadCertificateFile(applicationId, gigTitle);
      success('Official PDF certificate downloaded!');
    } catch (err) {
      console.error('Error generating PDF certificate:', err);
      toastError('Failed to generate PDF certificate.');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Volunteer Achievements & Verified Certificates
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Official platform-issued completion credentials signed by event recruiters.
        </p>
      </div>

      {/* Summary Highlight Card */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl shadow-purple-950/10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-purple-200 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Verified Credentials
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">
            {completedGigs.length} Completed Volunteer {completedGigs.length === 1 ? 'Gig' : 'Gigs'}
          </h2>
          <p className="text-sm text-purple-200 max-w-xl">
            Each certificate contains verifiable cryptographic logs, organizer endorsement, and activity metrics suitable for your resume or academic credit.
          </p>
        </div>

        <div className="h-20 w-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
          <Award className="w-10 h-10 text-amber-300" />
        </div>
      </div>

      {/* Certificate Cards */}
      {loading ? (
        <LoadingSpinner text="Loading verified credentials..." size="lg" />
      ) : completedGigs.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No completed certificates yet"
          description="Once an organizer marks your volunteer participation as COMPLETED, your official PDF certificate will appear here."
          actionLabel="View Applications"
          onAction={() => (window.location.href = '/student/applications')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {completedGigs.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-2xl p-6 border-2 border-indigo-100/80 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Decorative top strip */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500" />

              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                    Verified Completion
                  </span>
                  <span className="text-xs font-mono text-slate-400">Ref: #{app.id}</span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mt-2">
                  {app.gig?.title || `Volunteer Gig #${app.gig?.id}`}
                </h3>

                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {app.gig?.description || 'Event volunteer contribution.'}
                </p>

                <div className="mt-5 space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="text-slate-400">Category Domain:</span>
                    <span className="font-semibold text-slate-800">{app.gig?.category || 'General'}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="text-slate-400">Execution Date:</span>
                    <span className="font-semibold text-slate-800">{app.gig?.gigDate || '—'}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="text-slate-400">Organized By:</span>
                    <span className="font-semibold text-slate-800">
                      {app.gig?.recruiter?.name || app.gig?.recruiter?.email || 'Organizer'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Format: Standard A4 Landscape PDF</span>
                <button
                  onClick={() => handleDownload(app.id, app.gig?.title)}
                  disabled={downloadingId === app.id}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-60"
                >
                  {downloadingId === app.id ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  Download PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CertificatesPage;

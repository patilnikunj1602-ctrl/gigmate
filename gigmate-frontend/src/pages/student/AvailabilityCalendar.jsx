import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, ArrowRight, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import dashboardService from '../../api/dashboardService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';

export const AvailabilityCalendar = () => {
  const [freeDays, setFreeDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFreeDays();
  }, []);

  const fetchFreeDays = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getMyFreeDays();
      setFreeDays(data || []);
    } catch (err) {
      console.error('Error fetching free days:', err);
      toastError('Could not load your registered availability days.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDate = async (dateToAdd) => {
    const targetDate = dateToAdd || selectedDate;
    if (!targetDate) {
      toastError('Please select a valid date.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await dashboardService.toggleFreeDay(targetDate);
      success(`Date ${targetDate} marked as available!`);
      setSelectedDate('');
      fetchFreeDays();
    } catch (err) {
      const msg = err.response?.data?.message || (typeof err.response?.data === 'string' ? err.response?.data : null) || 'Failed to update availability.';
      toastError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickAdd = (offsetDays) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const dateStr = d.toISOString().split('T')[0];
    handleAddDate(dateStr);
  };

  // Sort free days chronologically
  const sortedFreeDays = [...freeDays].sort((a, b) =>
    new Date(a.availableDate) - new Date(b.availableDate)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Availability Calendar & Free Days
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Mark dates you are free to volunteer. Our matching engine will pair you with events on these dates.
        </p>
      </div>

      {/* Date Input Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <h2 className="text-base font-bold text-slate-800 mb-2 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          Mark New Free Day
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Select any upcoming date when you want to join a volunteer campaign.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center max-w-xl">
          <input
            type="date"
            value={selectedDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800"
          />
          <button
            onClick={() => handleAddDate()}
            disabled={submitting || !selectedDate}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            {submitting ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            Mark Available
          </button>
        </div>

        {/* Quick Date Presets */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Quick Presets:</span>
          <button
            type="button"
            onClick={() => handleQuickAdd(0)}
            className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 font-medium transition-colors"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => handleQuickAdd(1)}
            className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 font-medium transition-colors"
          >
            Tomorrow
          </button>
          <button
            type="button"
            onClick={() => handleQuickAdd(2)}
            className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 font-medium transition-colors"
          >
            In 2 Days
          </button>
          <button
            type="button"
            onClick={() => handleQuickAdd(7)}
            className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 font-medium transition-colors"
          >
            Next Week
          </button>
        </div>
      </div>

      {/* List of Registered Dates */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">Your Registered Free Days</h3>
            <p className="text-xs text-slate-500">
              {sortedFreeDays.length} {sortedFreeDays.length === 1 ? 'date' : 'dates'} marked on record
            </p>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading availability schedule..." />
        ) : sortedFreeDays.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No availability dates marked"
            description="Use the date selector above to add dates when you are free to volunteer."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedFreeDays.map((fd) => {
              const d = new Date(fd.availableDate);
              const formattedDate = d.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={fd.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-indigo-300 hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-indigo-600 font-semibold mb-1">
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Free Day
                      </span>
                      <span className="text-[10px] text-slate-400">ID #{fd.id}</span>
                    </div>
                    <div className="text-sm font-bold text-slate-900">{fd.availableDate}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{formattedDate}</div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                    <button
                      onClick={() => navigate(`/student/gigs?date=${fd.availableDate}`)}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group-hover:underline"
                    >
                      Find Gigs
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailabilityCalendar;

import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Award, Users, CheckCircle2, ArrowRight, Sparkles, Shield, HeartHandshake } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navigation Bar */}
      <nav className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-black text-lg shadow-md shadow-indigo-600/30">
              G
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              Gig<span className="text-indigo-600">Mate</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to={
                  user?.role === 'ROLE_STUDENT'
                    ? '/student/dashboard'
                    : user?.role === 'ROLE_RECRUITER'
                    ? '/recruiter/dashboard'
                    : '/admin/dashboard'
                }
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-600/20 transition-colors"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/50 text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-600/20 transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-200/50 via-purple-100/40 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-semibold mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            Empowering Campus Volunteers & Non-Profit Events
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Match Your Free Days With <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Purposeful Volunteer Gigs</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            GigMate synchronizes student volunteer schedules with verified event organizers, NGOs, and tech conferences. Earn verified digital completion certificates with ease.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base shadow-lg shadow-indigo-600/25 transition-all hover:-translate-y-0.5"
            >
              Join as Volunteer
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-base border border-slate-200 shadow-xs transition-colors"
            >
              Organizer Sign In
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto border-t border-slate-200/80 pt-8 text-left">
            <div>
              <div className="text-2xl font-black text-slate-900">100%</div>
              <div className="text-xs text-slate-500 font-medium">Free Availability Match</div>
            </div>
            <div>
              <div className="text-2xl font-black text-indigo-600">Verified</div>
              <div className="text-xs text-slate-500 font-medium">PDF Certifications</div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">Direct ATS</div>
              <div className="text-xs text-slate-500 font-medium">Organizer Applicant Tracking</div>
            </div>
            <div>
              <div className="text-2xl font-black text-purple-600">Zero Fee</div>
              <div className="text-xs text-slate-500 font-medium">For Student Volunteers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              A Complete Ecosystem Built for Impact
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              Explore how students and organizations collaborate efficiently through our unified platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-200 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Smart Free-Day Matching</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Students mark specific calendar days they are free. The backend matching engine instantly filters and surfaces campaigns fitting your available dates.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-200 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Recruiter Applicant ATS</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Event leads post requirements with quotas, review student applicants in real time, and update statuses from Pending to Approved, Hired, or Completed.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-200 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Automated PDF Certificates</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Completed assignments automatically generate an authenticated, tamper-proof landscape PDF certificate stamped with recruiter details and date.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-white border-t border-slate-200 text-center text-xs text-slate-500">
        <p>© 2026 GigMate Volunteer Management System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;

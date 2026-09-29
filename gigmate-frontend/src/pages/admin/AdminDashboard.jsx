import React from 'react';
import { ShieldCheck, Server, Database, Lock, CheckCircle2, Layers, Cpu, Code2 } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboard = () => {
  const { user } = useAuth();

  const endpoints = [
    { method: 'POST', path: '/api/auth/register', auth: 'Public', desc: 'User registration with profile bootstrap' },
    { method: 'POST', path: '/api/auth/login', auth: 'Public', desc: 'JWT token generation & auth validation' },
    { method: 'POST', path: '/api/dashboard/student/free-days', auth: 'ROLE_STUDENT', desc: 'Toggle / register available free day' },
    { method: 'GET', path: '/api/dashboard/student/free-days', auth: 'ROLE_STUDENT', desc: 'List active student availability dates' },
    { method: 'GET', path: '/api/dashboard/student/gigs/match', auth: 'ROLE_STUDENT', desc: 'Matching engine by date & category' },
    { method: 'POST', path: '/api/dashboard/student/gigs/{id}/apply', auth: 'ROLE_STUDENT', desc: 'Submit application for gig campaign' },
    { method: 'GET', path: '/api/dashboard/student/applications', auth: 'ROLE_STUDENT', desc: 'Student application tracking' },
    { method: 'POST', path: '/api/dashboard/recruiter/gigs', auth: 'ROLE_RECRUITER', desc: 'Publish volunteer opportunity' },
    { method: 'GET', path: '/api/dashboard/recruiter/gigs', auth: 'ROLE_RECRUITER', desc: 'List recruiter published campaigns' },
    { method: 'GET', path: '/api/dashboard/recruiter/gigs/{id}/applications', auth: 'ROLE_RECRUITER', desc: 'ATS candidate tracking stream' },
    { method: 'PUT', path: '/api/dashboard/recruiter/applications/{id}/status', auth: 'ROLE_RECRUITER', desc: 'Update applicant review status' },
    { method: 'GET', path: '/api/reporting/student/summary', auth: 'ROLE_STUDENT', desc: 'Completed gig performance history' },
    { method: 'GET', path: '/api/reporting/certificate/{id}', auth: 'ROLE_STUDENT', desc: 'iTextPDF cryptographic certificate generation' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold mb-3">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
          System Administration Console
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          GigMate Architecture & API Observability
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Real-time overview of the integrated Spring Boot backend, security layers, and API endpoints.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Backend Engine"
          value="Spring Boot"
          subtitle="Java 17 / Jakarta EE"
          icon={Server}
          color="indigo"
        />
        <StatCard
          title="Persistence Layer"
          value="MySQL & JPA"
          subtitle="Hibernate ORM Dialect"
          icon={Database}
          color="emerald"
        />
        <StatCard
          title="Security Model"
          value="Stateless JWT"
          subtitle="BCrypt + JJWT Filter"
          icon={Lock}
          color="purple"
        />
        <StatCard
          title="Document Engine"
          value="iTextPDF"
          subtitle="Binary PDF streaming"
          icon={Code2}
          color="blue"
        />
      </div>

      {/* Endpoints Registry */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Active Backend REST API Catalog</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            100% of these endpoints are mapped and integrated into this React frontend.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Method</th>
                <th className="px-6 py-3.5">Endpoint Path</th>
                <th className="px-6 py-3.5">Authority / Role</th>
                <th className="px-6 py-3.5">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-xs">
              {endpoints.map((ep, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                        ep.method === 'GET'
                          ? 'bg-blue-100 text-blue-700'
                          : ep.method === 'POST'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {ep.method}
                    </span>
                  </td>
                  <td className="px-6 py-3 font-mono font-semibold text-slate-800">{ep.path}</td>
                  <td className="px-6 py-3">
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-medium">
                      {ep.auth}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-slate-500">{ep.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

'use client';


import Dashboard from '@/components/Dashboard';
import Navigation from '@/components/Navigation';

export default function DashboardPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      <Dashboard />
    </div>
  );
}
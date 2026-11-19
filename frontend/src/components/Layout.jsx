import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users2,
  BookOpen,
  UserCheck,
  UserCog,
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  Shield,
  Briefcase
} from 'lucide-react';
import { useAuth, ROLES, ROLE_LABELS } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, role, logout, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSwitchRole = (newRole) => {
    login(newRole);
    setRoleSwitcherOpen(false);
    // Redirect if current route isn't allowed for the new role
    if (newRole === ROLES.EMPLOYEE && !['/onboarding', '/policy'].includes(location.pathname)) {
      navigate('/onboarding');
    } else if (newRole !== ROLES.EMPLOYEE && ['/onboarding'].includes(location.pathname)) {
      navigate('/dashboard');
    }
  };

  // Build navigation items filtered by role
  const navItems = [
    {
      to: '/dashboard',
      label: 'Risk Dashboard',
      icon: LayoutDashboard,
      roles: [ROLES.HR_STAFF, ROLES.HR_ADMIN],
      badge: 'ML Engine'
    },
    {
      to: '/teams',
      label: 'Team Rollup',
      icon: Users2,
      roles: [ROLES.HR_STAFF, ROLES.HR_ADMIN]
    },
    {
      to: '/onboarding',
      label: 'Onboarding Agent',
      icon: UserCheck,
      roles: [ROLES.EMPLOYEE, ROLES.HR_STAFF, ROLES.HR_ADMIN],
      badge: 'GenAI'
    },
    {
      to: '/policy',
      label: 'Policy Q&A',
      icon: BookOpen,
      roles: [ROLES.EMPLOYEE, ROLES.HR_STAFF, ROLES.HR_ADMIN],
      badge: 'RAG'
    },
    {
      to: '/admin/employees',
      label: 'Employee Directory',
      icon: UserCog,
      roles: [ROLES.HR_ADMIN],
      badge: 'Admin'
    },
  ];

  const visibleNav = navItems.filter((item) => !item.roles || item.roles.includes(role));

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800">
      {/* ── Left Sidebar (Desktop) ── */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-200/80 shadow-[1px_0_3px_0_rgba(0,0,0,0.02)] fixed inset-y-0 z-30">
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100 flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900">Nirnaya<span className="text-brand-600">.ai</span></span>
                <span className="text-[10px] font-semibold bg-brand-50 text-brand-700 px-1.5 py-0.5 rounded border border-brand-200 uppercase">
                  v1.0
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Workforce Intelligence</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Workforce Platform
          </div>

          {visibleNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all group ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 transition-colors group-hover:text-brand-600" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60 group-hover:border-brand-200 group-hover:bg-brand-100/50 group-hover:text-brand-700 transition-colors">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Hackathon Team Credits */}
        <div className="p-4 mx-4 mb-4 rounded-xl bg-slate-50 border border-slate-200/70">
          <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />
            <span>Team Curious Coders</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            Dayananda Sagar College of Engineering (DSCE) • Theme: AI in HR
          </p>
        </div>

        {/* User Footer Profile */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-sm flex-shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
              <p className="text-[11px] text-slate-500 capitalize">{ROLE_LABELS[role]}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 flex items-center justify-between shadow-xs">
          {/* Mobile hamburger */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="font-bold text-slate-900">Nirnaya<span className="text-brand-600">.ai</span></span>
          </div>

          {/* Quick Context & Role Switcher */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Active Role Mode:</span>
            <div className="relative">
              <button
                onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-xs font-semibold text-slate-800 transition-colors border border-slate-200/80"
              >
                <Shield className="w-3.5 h-3.5 text-brand-600" />
                <span>{ROLE_LABELS[role]}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {roleSwitcherOpen && (
                <div className="absolute left-0 mt-1.5 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 animate-in fade-in-50 zoom-in-95">
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Quick Role Switch
                  </div>
                  {Object.entries(ROLE_LABELS).map(([rKey, rLabel]) => (
                    <button
                      key={rKey}
                      onClick={() => handleSwitchRole(rKey)}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                        role === rKey ? 'font-bold text-brand-700 bg-brand-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>{rLabel}</span>
                      {role === rKey && <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Header Status */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>FastAPI Backend Active</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700 hidden sm:inline">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-rose-200 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Slide-down Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-1 z-30">
            {visibleNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm ${
                      isActive ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-slate-600'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        )}

        {/* Page Inner Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;

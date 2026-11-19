import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation, Link } from 'react-router-dom';
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
    <div className="min-h-screen flex bg-[#FBF4EF] text-[#312C29] font-sans selection:bg-[#D9684C] selection:text-white">
      {/* ── Left Sidebar (Desktop) ── */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#FAF6F2] border-r border-[#DED1C9] shadow-[1px_0_16px_rgba(49,44,41,0.03)] fixed inset-y-0 z-30">
        {/* Brand Header */}
        <div className="p-6 border-b border-[#DED1C9] flex flex-col gap-1">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#312C29] text-[#D9684C] flex items-center justify-center shadow-md shadow-[#312C29]/15 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-heading font-bold tracking-tight text-[#312C29]">
                  Nirnaya<span className="text-[#D9684C]">.ai</span>
                </span>
                <span className="text-[10px] font-semibold bg-[#FDEAE5] text-[#B2553E] px-1.5 py-0.5 rounded-full border border-[#D9684C]/30 uppercase tracking-wider">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] text-[#7A736E] font-medium tracking-wide">Workforce Intelligence</p>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-[#7A736E]">
            Workforce Platform
          </div>

          {visibleNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs tracking-tight transition-all group ${
                    isActive
                      ? 'bg-[#312C29] text-white font-semibold shadow-sm'
                      : 'text-[#5D5753] hover:text-[#312C29] hover:bg-[#F2EAE3]'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 transition-colors group-hover:text-[#D9684C]" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F5E9DF] text-[#5D5753] border border-[#DED1C9] group-hover:border-[#D9684C]/40 group-hover:text-[#312C29] transition-colors">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Hackathon Team Credits */}
        <div className="p-4 mx-4 mb-4 rounded-2xl bg-white border border-[#DED1C9] shadow-xs">
          <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-[#312C29]">
            <span className="w-2 h-2 rounded-full bg-[#D9684C] animate-pulse" />
            <span className="font-heading">Team Curious Coders</span>
          </div>
          <p className="text-[11px] text-[#7A736E] leading-relaxed">
            Dayananda Sagar College of Engineering • AI in HR
          </p>
        </div>

        {/* User Footer Profile */}
        <div className="p-4 border-t border-[#DED1C9] bg-[#F5E9DF]/50 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-[#312C29] text-[#FBF4EF] font-heading font-bold flex items-center justify-center text-sm flex-shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-[#312C29] truncate">{user?.name}</p>
              <p className="text-[11px] text-[#7A736E] capitalize">{ROLE_LABELS[role]}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-2 text-[#7A736E] hover:text-[#C62828] hover:bg-[#FFEBEE] rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 h-16 bg-[#FBF4EF]/90 backdrop-blur-md border-b border-[#DED1C9] px-4 lg:px-8 flex items-center justify-between">
          {/* Mobile hamburger */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#312C29] hover:bg-[#F2EAE3] rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="font-heading font-bold text-[#312C29]">
              Nirnaya<span className="text-[#D9684C]">.ai</span>
            </span>
          </div>

          {/* Quick Context & Role Switcher */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs font-medium text-[#7A736E]">Active Role Mode:</span>
            <div className="relative">
              <button
                onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-[#F5E9DF] text-xs font-semibold text-[#312C29] transition-colors border border-[#DED1C9] shadow-xs"
              >
                <Shield className="w-3.5 h-3.5 text-[#D9684C]" />
                <span>{ROLE_LABELS[role]}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#7A736E]" />
              </button>

              {roleSwitcherOpen && (
                <div className="absolute left-0 mt-1.5 w-48 bg-white rounded-2xl shadow-xl border border-[#DED1C9] py-1.5 z-50 animate-in fade-in-50 zoom-in-95">
                  <div className="px-3.5 py-1 text-[10px] uppercase font-bold text-[#7A736E] tracking-wider">
                    Quick Role Switch
                  </div>
                  {Object.entries(ROLE_LABELS).map(([rKey, rLabel]) => (
                    <button
                      key={rKey}
                      onClick={() => handleSwitchRole(rKey)}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-[#FBF4EF] ${
                        role === rKey ? 'font-bold text-[#B2553E] bg-[#FDEAE5]' : 'text-[#312C29]'
                      }`}
                    >
                      <span>{rLabel}</span>
                      {role === rKey && <span className="w-1.5 h-1.5 rounded-full bg-[#D9684C]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Header Status */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs text-[#5D5753] bg-white px-3.5 py-1.5 rounded-full border border-[#DED1C9]">
              <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
              <span>FastAPI Backend Active</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#312C29] hidden sm:inline">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5D5753] hover:text-[#C62828] px-3 py-1.5 rounded-xl border border-[#DED1C9] hover:border-[#C62828]/30 hover:bg-[#FFEBEE] transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Slide-down Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FAF6F2] border-b border-[#DED1C9] px-4 py-3 space-y-1.5 z-30">
            {visibleNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs ${
                      isActive ? 'bg-[#312C29] text-white font-semibold' : 'text-[#5D5753]'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F5E9DF] text-[#5D5753] border border-[#DED1C9]">
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

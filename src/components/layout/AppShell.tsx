import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  Inbox,
  ClipboardCheck,
  BookOpen,
  PlaySquare,
  Award,
  Calendar,
  Map,
  Briefcase,
  GitBranch,
  Megaphone,
  Users,
  Search,
  Bell,
  Sparkles,
  Sun,
  Moon,
  User,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { useAcademyStore } from '../../store/useAcademyStore';
import { pageVariants } from '../../lib/utils';

interface AppShellProps {
  title: string;
  subtitle?: string;
  mobileGreeting?: boolean;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  title,
  subtitle,
  mobileGreeting = false,
  children,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    today,
    activeRole,
    users,
    inbox,
    notifications,
    darkMode,
    toggleDarkMode,
    setCmdkOpen,
    setChatOpen,
    markNotificationsSeen,
  } = useAcademyStore();

  const [notifOpen, setNotifOpen] = useState(false);
  const currentUser = users[activeRole];
  const unreadInboxCount = inbox.filter((m) => m.unread).length;
  const unreadNotifCount = notifications.filter((n) => n.unread).length;

  const navGroups = [
    {
      label: 'Menu',
      items: [
        activeRole === 'leader'
          ? { key: '/team', label: 'Team Progress', icon: Users }
          : { key: '/dashboard', label: 'Dashboard', icon: Home },
        { key: '/inbox', label: 'Inbox', icon: Inbox, badge: unreadInboxCount },
        { key: '/tasks', label: 'Tasks', icon: ClipboardCheck },
      ],
    },
    {
      label: 'Belajar',
      items: [
        { key: '/courses', label: 'Courses', icon: BookOpen },
        { key: '/library', label: 'Learning Library', icon: PlaySquare },
        { key: '/certification', label: 'Certification', icon: Award },
        { key: '/calendar', label: 'Enablement Calendar', icon: Calendar },
      ],
    },
    {
      label: 'Jualan',
      items: [
        { key: '/products', label: 'Product Mapping', icon: Map },
        { key: '/toolkit', label: 'Sales Toolkit', icon: Briefcase },
        { key: '/process', label: 'Business Process', icon: GitBranch },
      ],
    },
    {
      label: 'Info & Studio',
      items: [
        { key: '/news', label: 'News & Announcements', icon: Megaphone },
        { key: '/admin', label: 'Admin & AI Studio', icon: ShieldCheck },
      ],
    },
  ];

  const isRouteActive = (key: string) => {
    const p = location.pathname;
    if (key === '/courses' && (p.startsWith('/course/') || p.startsWith('/player/') || p.startsWith('/simulator/'))) {
      return true;
    }
    if (key === '/products' && p.startsWith('/product/')) {
      return true;
    }
    return p === key;
  };

  return (
    <div className="min-h-screen flex flex-col lg:grid lg:grid-cols-[268px_1fr] bg-canvas text-ink">
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col sticky top-0 h-screen bg-surface border-r border-line px-4 py-5 overflow-y-auto"
        aria-label="Menu utama"
      >
        <Link
          to={activeRole === 'leader' ? '/team' : '/dashboard'}
          className="flex items-center gap-3 px-2 pb-6 group"
        >
          <div className="w-10 h-10 rounded-2xl hero-gradient flex items-center justify-center text-white font-extrabold text-base shadow-brand shrink-0">
            LA
          </div>
          <div className="min-w-0">
            <div className="font-extrabold text-base text-ink tracking-tight leading-tight group-hover:text-la-blue transition">
              LA Sales Academy
            </div>
            <div className="text-[11px] font-semibold text-muted-custom tracking-wide uppercase">
              Growth &amp; Enablement
            </div>
          </div>
        </Link>

        <div className="space-y-5 flex-1">
          {navGroups.map((group) => (
            <div key={group.label}>
              <div className="px-3 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-custom">
                {group.label}
              </div>
              <nav className="space-y-1" aria-label={group.label}>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isRouteActive(item.key);
                  return (
                    <Link
                      key={item.key}
                      to={item.key}
                      className={`flex items-center gap-3 h-10 px-3 rounded-xl text-sm font-medium transition ${
                        active
                          ? 'bg-la-ice dark:bg-slate-800 text-la-blue dark:text-sky-300 font-bold'
                          : 'text-ink-2 hover:bg-subtle/60 hover:text-ink'
                      }`}
                    >
                      <Icon
                        className={`w-[18px] h-[18px] shrink-0 ${
                          active ? 'text-la-blue dark:text-sky-400' : 'text-muted-custom'
                        }`}
                        strokeWidth={1.5}
                      />
                      <span className="truncate flex-1">{item.label}</span>
                      {item.badge ? (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-la-blue text-white">
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        <div className="pt-4 mt-4 border-t border-line">
          <div className="p-3.5 rounded-2xl bg-canvas border border-line flex items-start gap-2.5 text-xs">
            <Info className="w-4 h-4 text-la-blue shrink-0 mt-0.5" strokeWidth={1.5} />
            <div className="min-w-0">
              <div className="font-bold text-ink">Butuh bantuan?</div>
              <a
                href="mailto:commerce.operation@lintasarta.co.id"
                className="text-la-blue hover:underline truncate block mt-0.5"
              >
                commerce.operation@lintasarta.co.id
              </a>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0 pb-24 lg:pb-16">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-canvas/85 backdrop-blur-md border-b border-line/70 px-4 sm:px-8 py-3.5 flex items-center gap-3">
          {/* Desktop Title */}
          <div className="hidden md:block min-w-0 mr-auto">
            <h1 className="text-xl font-extrabold text-ink tracking-tight truncate">{title}</h1>
            <p className="text-xs text-muted-custom truncate">{subtitle || today}</p>
          </div>

          {/* Mobile Greeting or Title */}
          <div className="md:hidden flex items-center gap-2.5 mr-auto min-w-0">
            {mobileGreeting ? (
              <>
                <span
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${currentUser.avatarColor}`}
                >
                  {currentUser.initials}
                </span>
                <div className="min-w-0">
                  <small className="block text-[11px] text-muted-custom">Selamat pagi,</small>
                  <b className="text-sm font-bold text-ink truncate block">{currentUser.name}</b>
                </div>
              </>
            ) : (
              <h1 className="text-lg font-extrabold text-ink truncate">{title}</h1>
            )}
          </div>

          {/* Global Search Trigger */}
          <button
            type="button"
            onClick={() => setCmdkOpen(true)}
            className="flex items-center gap-2.5 h-10 px-3.5 rounded-full bg-surface border border-line text-xs text-muted-custom hover:border-la-blue/50 transition w-44 sm:w-72"
            aria-label="Cari materi, course, atau produk"
          >
            <Search className="w-4 h-4 text-la-blue shrink-0" strokeWidth={1.5} />
            <span className="truncate flex-1 text-left">Cari materi, course, produk…</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-subtle text-[10px] font-mono text-ink-2">
              ⌘K
            </kbd>
          </button>

          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={toggleDarkMode}
            aria-label="Toggle Dark Mode"
            title={darkMode ? 'Mode Terang' : 'Mode Gelap'}
            className="w-10 h-10 rounded-full bg-surface border border-line flex items-center justify-center text-ink-2 hover:text-la-blue transition shrink-0"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400" strokeWidth={1.5} />
            ) : (
              <Moon className="w-4 h-4" strokeWidth={1.5} />
            )}
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setNotifOpen(!notifOpen);
                if (!notifOpen && unreadNotifCount > 0) {
                  markNotificationsSeen();
                }
              }}
              aria-label="Notifikasi"
              className="w-10 h-10 rounded-full bg-surface border border-line flex items-center justify-center text-ink-2 hover:text-la-blue transition relative shrink-0"
            >
              <Bell className="w-4 h-4" strokeWidth={1.5} />
              {unreadNotifCount > 0 && (
                <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-la-red ring-2 ring-white" />
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-surface border border-line shadow-2xl p-3 z-50">
                <div className="flex items-center justify-between px-2 pb-2 border-b border-line">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-custom">
                    Notifikasi Terbaru
                  </h3>
                  <button
                    type="button"
                    onClick={() => setNotifOpen(false)}
                    className="text-xs text-la-blue font-semibold"
                  >
                    Tutup
                  </button>
                </div>
                <div className="divide-y divide-line max-h-72 overflow-y-auto mt-1">
                  {notifications.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => {
                        setNotifOpen(false);
                        if (n.go) navigate(n.go);
                      }}
                      className="w-full text-left p-2.5 hover:bg-subtle/60 rounded-xl transition flex items-start gap-2.5"
                    >
                      <div className="w-8 h-8 rounded-xl bg-la-ice dark:bg-slate-800 text-la-blue flex items-center justify-center shrink-0 mt-0.5">
                        <Bell className="w-4 h-4" strokeWidth={1.5} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-ink">{n.title}</div>
                        <div className="text-xs text-muted-custom truncate">{n.body}</div>
                        <div className="text-[10px] text-muted-custom mt-0.5">{n.time}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Chip */}
          <Link
            to="/profile"
            className="hidden sm:flex items-center gap-2.5 pl-1.5 pr-3.5 py-1 rounded-full bg-surface border border-line hover:border-la-blue/40 transition shrink-0"
          >
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${currentUser.avatarColor}`}
            >
              {currentUser.initials}
            </span>
            <div className="text-left leading-tight">
              <div className="text-xs font-bold text-ink">{currentUser.name}</div>
              <div className="text-[11px] text-muted-custom">{currentUser.title}</div>
            </div>
          </Link>
        </header>

        {/* Animated Main Content */}
        <motion.main
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex-1 px-4 sm:px-8 py-6 max-w-7xl w-full mx-auto space-y-6"
        >
          {children}
        </motion.main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-surface/95 backdrop-blur-md border-t border-line grid grid-cols-5 py-1.5 px-2 text-[11px] font-medium"
        aria-label="Navigasi bawah"
      >
        <Link
          to={activeRole === 'leader' ? '/team' : '/dashboard'}
          className={`flex flex-col items-center gap-1 py-1 rounded-xl ${
            location.pathname === '/dashboard' || location.pathname === '/team'
              ? 'text-la-blue font-bold'
              : 'text-muted-custom'
          }`}
        >
          {activeRole === 'leader' ? (
            <Users className="w-5 h-5" strokeWidth={1.5} />
          ) : (
            <Home className="w-5 h-5" strokeWidth={1.5} />
          )}
          <span>{activeRole === 'leader' ? 'Tim' : 'Beranda'}</span>
        </Link>
        <Link
          to="/courses"
          className={`flex flex-col items-center gap-1 py-1 rounded-xl ${
            isRouteActive('/courses') ? 'text-la-blue font-bold' : 'text-muted-custom'
          }`}
        >
          <BookOpen className="w-5 h-5" strokeWidth={1.5} />
          <span>Belajar</span>
        </Link>
        <button
          type="button"
          onClick={() => setCmdkOpen(true)}
          className="flex flex-col items-center gap-1 py-1 rounded-xl text-muted-custom"
        >
          <Search className="w-5 h-5" strokeWidth={1.5} />
          <span>Cari</span>
        </button>
        <Link
          to="/products"
          className={`flex flex-col items-center gap-1 py-1 rounded-xl ${
            isRouteActive('/products') || location.pathname === '/toolkit'
              ? 'text-la-blue font-bold'
              : 'text-muted-custom'
          }`}
        >
          <Briefcase className="w-5 h-5" strokeWidth={1.5} />
          <span>Jualan</span>
        </Link>
        <Link
          to="/profile"
          className={`flex flex-col items-center gap-1 py-1 rounded-xl ${
            location.pathname === '/profile' ? 'text-la-blue font-bold' : 'text-muted-custom'
          }`}
        >
          <User className="w-5 h-5" strokeWidth={1.5} />
          <span>Profil</span>
        </Link>
      </nav>

      {/* Floating Tanya AI Button */}
      <button
        type="button"
        onClick={() => setChatOpen(true)}
        className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-40 inline-flex items-center gap-2 px-5 py-3.5 rounded-full navy-gradient text-white font-bold text-sm shadow-brand-lg hover:scale-105 active:scale-95 transition"
      >
        <Sparkles className="w-4 h-4 text-sky-300" strokeWidth={1.5} />
        <span>Tanya AI</span>
      </button>
    </div>
  );
};


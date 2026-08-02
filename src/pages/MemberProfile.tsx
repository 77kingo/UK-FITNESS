import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useBookingStore } from '../store/bookingStore';
import {
  Calendar, Clock, MapPin, Trash2, Award,
  Droplets, Flame, TrendingUp, QrCode, Bell, Dumbbell,
  CheckCircle2, Plus, BarChart2,
  Zap, Star, Trophy, Activity, Heart, Coffee, Target
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { HydrationLog, BodyMetricEntry } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

// ── Local-Storage Keys ──────────────────────────────────────────────────────
const HYDRATION_KEY  = 'uk_fitness_hydration';
const METRICS_KEY    = 'uk_fitness_metrics';
const STREAK_KEY     = 'uk_fitness_streaks';
const NOTIFS_KEY     = 'uk_fitness_notifs';

// ── Helpers ──────────────────────────────────────────────────────────────────
const today = () => new Date().toISOString().slice(0, 10);
const todayLabel = () =>
  new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getWeekDates() {
  const now = new Date();
  const dow = now.getDay(); // 0=Sun
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dow + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

// ── Notification seed ─────────────────────────────────────────────────────
const SEED_NOTIFS = [
  { id: 'n1', title: 'Booking Confirmed', message: 'Your VOLT CONDITIONING class tomorrow at 07:00 is locked in.', type: 'success' as const, read: false, createdAt: new Date(Date.now() - 1*60*60*1000).toISOString() },
  { id: 'n2', title: 'New Class Added', message: "POWER SCULPT has been added to Saturday's schedule.", type: 'info' as const, read: false, createdAt: new Date(Date.now() - 3*60*60*1000).toISOString() },
  { id: 'n3', title: 'Membership Renewal', message: 'Your Premium Athlete plan renews in 25 days.', type: 'warning' as const, read: true, createdAt: new Date(Date.now() - 24*60*60*1000).toISOString() },
];

// ── Tabs definition ────────────────────────────────────────────────────────
type Tab = 'bookings' | 'fitness' | 'metrics' | 'notifications' | 'pt';

export const MemberProfile: React.FC = () => {
  const { user } = useAuthStore();
  const { userBookings, loading, error, fetchUserBookings, cancelBooking } = useBookingStore();

  // Active Tab
  const [activeTab, setActiveTab] = useState<Tab>('bookings');
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // ── Hydration / Caloric state ──
  const [hydration, setHydration] = useState<HydrationLog[]>(() => {
    try { return JSON.parse(localStorage.getItem(HYDRATION_KEY) || '[]'); } catch { return []; }
  });
  const todayHydration = hydration.find(h => h.date === today()) ?? { date: today(), waterMl: 0, calories: 0 };

  const updateHydration = (field: 'waterMl' | 'calories', delta: number) => {
    setHydration(prev => {
      const idx = prev.findIndex(h => h.date === today());
      let updated: HydrationLog[];
      if (idx === -1) {
        updated = [...prev, { date: today(), waterMl: 0, calories: 0, [field]: Math.max(0, delta) }];
      } else {
        updated = prev.map((h, i) =>
          i === idx ? { ...h, [field]: Math.max(0, h[field] + delta) } : h
        );
      }
      localStorage.setItem(HYDRATION_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // ── Body Metrics ──
  const [metrics, setMetrics] = useState<BodyMetricEntry[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(METRICS_KEY) || '[]');
    } catch {
      return [
        { date: new Date(Date.now() - 30*86400*1000).toISOString().slice(0,10), weightKg: 82, bodyFatPct: 22, muscleMassKg: 38 },
        { date: new Date(Date.now() - 14*86400*1000).toISOString().slice(0,10), weightKg: 80, bodyFatPct: 20, muscleMassKg: 39 },
        { date: today(), weightKg: 78, bodyFatPct: 18, muscleMassKg: 40 },
      ];
    }
  });
  const [metricInput, setMetricInput] = useState({ weightKg: '', bodyFatPct: '', muscleMassKg: '' });

  const saveMetric = () => {
    const entry: BodyMetricEntry = {
      date: today(),
      weightKg: parseFloat(metricInput.weightKg) || 0,
      bodyFatPct: parseFloat(metricInput.bodyFatPct) || 0,
      muscleMassKg: parseFloat(metricInput.muscleMassKg) || 0,
    };
    const updated = [...metrics.filter(m => m.date !== today()), entry].sort((a, b) => a.date.localeCompare(b.date));
    setMetrics(updated);
    localStorage.setItem(METRICS_KEY, JSON.stringify(updated));
    setMetricInput({ weightKg: '', bodyFatPct: '', muscleMassKg: '' });
  };

  const latestMetric = metrics[metrics.length - 1];
  const prevMetric   = metrics[metrics.length - 2];
  const delta = (field: keyof Omit<BodyMetricEntry, 'date'>) => {
    if (!latestMetric || !prevMetric) return null;
    return +(latestMetric[field] - prevMetric[field]).toFixed(1);
  };

  // ── Streaks ──
  const [attendedDays, setAttendedDays] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(STREAK_KEY) || '[]'); } catch { return []; }
  });
  const weekDates = getWeekDates();
  const toggleStreak = (date: string) => {
    setAttendedDays(prev => {
      const next = prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date];
      localStorage.setItem(STREAK_KEY, JSON.stringify(next));
      return next;
    });
  };
  const currentStreak = (() => {
    let s = 0;
    const d = new Date();
    while (true) {
      if (attendedDays.includes(d.toISOString().slice(0, 10))) { s++; d.setDate(d.getDate() - 1); }
      else break;
    }
    return s;
  })();

  // ── Notifications ──
  const [notifs, setNotifs] = useState(() => {
    try {
      const stored = localStorage.getItem(NOTIFS_KEY);
      return stored ? JSON.parse(stored) : SEED_NOTIFS;
    } catch { return SEED_NOTIFS; }
  });
  const unreadCount = notifs.filter((n: any) => !n.read).length;
  const markAllRead = () => {
    const updated = notifs.map((n: any) => ({ ...n, read: true }));
    setNotifs(updated);
    localStorage.setItem(NOTIFS_KEY, JSON.stringify(updated));
  };

  // ── Personal Training Requests (mock) ──
  const [ptRequests] = useState([
    { id: 'pt1', trainerName: 'Sarah Jenkins', specialty: 'HIIT & Cardio', date: 'Wed 31 Jul', time: '09:00 AM', status: 'confirmed' },
    { id: 'pt2', trainerName: 'Marcus Vance', specialty: 'Strength & Power', date: 'Fri 2 Aug', time: '11:00 AM', status: 'pending' },
  ]);

  useEffect(() => {
    if (user) fetchUserBookings(user.id);
  }, [user, fetchUserBookings]);

  if (!user) return null;

  const handleCancelBooking = async (bookingId: string, className: string) => {
    if (window.confirm(`Cancel your spot in ${className}?`)) {
      setCancellingId(bookingId);
      await cancelBooking(bookingId);
      setCancellingId(null);
    }
  };

  const fmt = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  const fmtT = (iso: string) => new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });

  const mockSubscription = {
    tier: user.role === 'admin' ? 'Elite Admin Package' : 'Premium Athlete',
    status: 'Active',
    renewalDate: new Date(Date.now() + 25 * 86400 * 1000).toLocaleDateString('en-GB'),
  };

  const WATER_GOAL   = 2500;
  const CALORIE_GOAL = 2200;
  const waterPct  = Math.min(100, Math.round((todayHydration.waterMl / WATER_GOAL) * 100));
  const calPct    = Math.min(100, Math.round((todayHydration.calories / CALORIE_GOAL) * 100));

  const tabs: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'bookings',       label: 'My Classes',    icon: <Calendar className="h-4 w-4" /> },
    { id: 'fitness',        label: 'Daily Fitness',  icon: <Droplets className="h-4 w-4" /> },
    { id: 'metrics',        label: 'Body Metrics',  icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'pt',             label: 'Personal Training', icon: <Dumbbell className="h-4 w-4" /> },
    { id: 'notifications',  label: 'Notifications', icon: <Bell className="h-4 w-4" />, badge: unreadCount },
  ];

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* ── HERO HEADER CARD ─────────────────────────────────────────── */}
      <section className="glass-card rounded-2xl p-6 md:p-8 border border-gray-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Identity */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-neon to-emerald-500 rounded-2xl flex items-center justify-center text-brand-dark text-2xl font-black shadow-neon-glow">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-brand-neon rounded-full border-2 border-brand-dark animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-extrabold text-white uppercase tracking-wider">{user.fullName}</h1>
                <span className="text-xs font-black uppercase text-brand-neon px-2.5 py-0.5 bg-brand-neon/10 border border-brand-neon/20 rounded-full">
                  {user.role}
                </span>
              </div>
              <p className="text-gray-400 text-xs mt-1">{user.email}</p>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1 text-xs text-brand-neon font-bold">
                  <Zap className="h-3.5 w-3.5" />
                  <span>{currentStreak} Day Streak</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Trophy className="h-3.5 w-3.5 text-yellow-500" />
                  <span>{userBookings.length} Classes Booked</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'This Week', value: userBookings.filter(b => b.scheduleSlot && new Date(b.scheduleSlot.startTime) > new Date(Date.now() - 7*86400*1000)).length, icon: <Activity className="h-4 w-4 text-brand-neon" /> },
              { label: 'Streak Days', value: currentStreak, icon: <Zap className="h-4 w-4 text-yellow-400" /> },
              { label: 'Water Today', value: `${todayHydration.waterMl}ml`, icon: <Droplets className="h-4 w-4 text-blue-400" /> },
            ].map((stat, i) => (
              <div key={i} className="bg-brand-dark/60 border border-gray-900 rounded-xl p-3 text-center">
                <div className="flex justify-center mb-1">{stat.icon}</div>
                <div className="text-white font-black text-lg leading-tight">{stat.value}</div>
                <div className="text-gray-500 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* QR Entry Pass */}
          <div className="flex flex-col items-center gap-2 bg-brand-dark/60 border border-brand-neon/20 rounded-xl p-4">
            <div className="text-xs font-extrabold text-brand-neon uppercase tracking-widest flex items-center gap-1.5">
              <QrCode className="h-3.5 w-3.5" />
              Club Entry Pass
            </div>
            <div className="relative w-20 h-20 bg-white rounded-lg flex items-center justify-center overflow-hidden">
              {/* Simulated QR pattern */}
              <div className="w-full h-full grid grid-cols-8 grid-rows-8 gap-0.5 p-1">
                {Array.from({ length: 64 }, (_, i) => (
                  <div key={i} className={`rounded-sm ${Math.random() > 0.4 ? 'bg-brand-dark' : 'bg-white'}`} />
                ))}
              </div>
              {/* Scan line animation */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="w-full h-0.5 bg-brand-neon/80 animate-[scanline_2s_ease-in-out_infinite]" style={{ animation: 'scanline 2s ease-in-out infinite' }} />
              </div>
            </div>
            <p className="text-gray-500 text-xs text-center">Show at reception</p>
          </div>
        </div>
      </section>

      {/* ── TAB NAVIGATION ─────────────────────────────────────────────── */}
      <div className="flex gap-1 bg-brand-accent/30 border border-gray-900 p-1.5 rounded-xl overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-extrabold uppercase tracking-wider whitespace-nowrap transition-all duration-300 flex-shrink-0 ${
              activeTab === tab.id
                ? 'bg-brand-neon text-brand-dark shadow-neon-glow'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge && tab.badge > 0 ? (
              <span className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-xs font-black flex items-center justify-center ${activeTab === tab.id ? 'bg-brand-dark text-brand-neon' : 'bg-red-500 text-white'}`}>
                {tab.badge}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* ── TAB CONTENT ────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >

          {/* ─────── BOOKINGS TAB ─────────────────────────────────────── */}
          {activeTab === 'bookings' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <section className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-bold text-white uppercase tracking-wider">Active Bookings</h2>
                  <span className="text-xs bg-brand-accent text-gray-400 font-bold px-3 py-1 rounded-full">{userBookings.length} Booked</span>
                </div>

                {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">{error}</div>}

                {loading && userBookings.length === 0 ? (
                  <div className="space-y-3">{[1, 2].map(i => <div key={i} className="glass-card p-5 rounded-xl animate-pulse h-20" />)}</div>
                ) : userBookings.length === 0 ? (
                  <div className="glass-card p-12 text-center rounded-2xl border border-gray-900 space-y-4">
                    <Calendar className="h-10 w-10 text-gray-700 mx-auto" />
                    <p className="text-gray-400 text-sm font-medium">No upcoming bookings. Head to the schedule to reserve your spot.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userBookings.map(b => {
                      const slot = b.scheduleSlot;
                      if (!slot?.classType) return null;
                      return (
                        <article key={b.id} className="glass-card p-5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs uppercase font-extrabold tracking-wider bg-brand-neon/10 text-brand-neon border border-brand-neon/15 px-2.5 py-0.5 rounded-full">{slot.classType.category}</span>
                              <h3 className="font-bold text-white text-base">{slot.classType.name}</h3>
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                              <span className="flex items-center gap-1"><Calendar className="h-3 w-3 text-brand-neon" />{fmt(slot.startTime)}</span>
                              <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-brand-neon" />{fmtT(slot.startTime)} – {fmtT(slot.endTime)}</span>
                              {slot.roomNumber && <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-brand-neon" />{slot.roomNumber}</span>}
                            </div>
                          </div>
                          <button
                            onClick={() => handleCancelBooking(b.id, slot.classType!.name)}
                            disabled={cancellingId === b.id}
                            className="flex items-center gap-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 border border-gray-800 hover:border-red-500/20 px-4 py-2 rounded-md text-xs font-bold transition-all"
                          >
                            {cancellingId === b.id ? <span>Cancelling...</span> : <><Trash2 className="h-3.5 w-3.5" /><span>Cancel Spot</span></>}
                          </button>
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* Membership summary sidebar */}
              <section className="space-y-5">
                <h2 className="text-lg font-bold text-white uppercase tracking-wider">Membership</h2>
                <div className="glass-card p-6 rounded-xl border border-gray-800 space-y-5">
                  <div className="flex items-start gap-3">
                    <div className="bg-brand-neon/15 p-2 rounded-lg border border-brand-neon/10"><Award className="h-6 w-6 text-brand-neon" /></div>
                    <div>
                      <h3 className="text-white font-bold text-sm uppercase">{mockSubscription.tier}</h3>
                      <p className="text-gray-500 text-xs mt-0.5">Full Club Access</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-900 pt-4 space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Status</span><span className="text-brand-neon font-black uppercase flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-brand-neon animate-pulse" />Active</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Renews</span><span className="text-white font-bold">{mockSubscription.renewalDate}</span></div>
                  </div>
                  <Button variant="outline" className="w-full text-xs uppercase font-bold" onClick={() => alert('Stripe billing portal – Phase 3 feature.')}>Manage Subscription</Button>
                </div>

                {/* Weekly streak mini */}
                <div className="glass-card p-5 rounded-xl border border-gray-800 space-y-3">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-400" />
                    <span className="text-white text-xs font-bold uppercase tracking-wider">This Week's Attendance</span>
                  </div>
                  <div className="flex gap-2">
                    {weekDates.map((d, i) => {
                      const attended = attendedDays.includes(d);
                      const isToday = d === today();
                      return (
                        <button
                          key={d}
                          onClick={() => toggleStreak(d)}
                          title={`Toggle ${WEEK_DAYS[i]}`}
                          className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg text-xs font-bold transition-all border ${
                            attended ? 'bg-brand-neon text-brand-dark border-brand-neon shadow-neon-glow' : isToday ? 'border-brand-neon/40 text-brand-neon bg-brand-neon/10' : 'border-gray-900 text-gray-600 bg-brand-dark/40 hover:border-gray-700'
                          }`}
                        >
                          <span>{WEEK_DAYS[i].charAt(0)}</span>
                          {attended ? <CheckCircle2 className="h-3 w-3" /> : <span className="h-3 w-3 rounded-full border border-current opacity-30" />}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-gray-500 text-xs">Tap a day to toggle your attendance. Current streak: <strong className="text-brand-neon">{currentStreak} days</strong></p>
                </div>
              </section>
            </div>
          )}

          {/* ─────── DAILY FITNESS TAB ─────────────────────────────────── */}
          {activeTab === 'fitness' && (
            <div className="space-y-6">
              <p className="text-gray-400 text-sm">{todayLabel()} — Log your daily nutrition and hydration below.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Water tracker */}
                <div className="glass-card p-6 rounded-2xl border border-gray-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-500/15 p-2 rounded-lg border border-blue-500/20"><Droplets className="h-5 w-5 text-blue-400" /></div>
                      <div>
                        <h3 className="text-white font-bold text-sm uppercase">Hydration</h3>
                        <p className="text-gray-500 text-xs">Goal: {WATER_GOAL.toLocaleString()} ml</p>
                      </div>
                    </div>
                    <span className="text-2xl font-black text-white">{todayHydration.waterMl}<span className="text-gray-500 text-sm font-medium"> ml</span></span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-gray-900 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${waterPct}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{waterPct}% of daily goal</span>
                    {waterPct >= 100 && <span className="text-xs text-brand-neon font-bold flex items-center gap-1"><Star className="h-3 w-3" />Goal Reached!</span>}
                  </div>
                  <div className="flex gap-3">
                    {[250, 500].map(ml => (
                      <button key={ml} onClick={() => updateHydration('waterMl', ml)} className="flex-1 py-2 text-xs font-bold bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg transition-all">+{ml}ml</button>
                    ))}
                    <button onClick={() => updateHydration('waterMl', -250)} className="py-2 px-3 text-xs font-bold bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-lg transition-all">-250ml</button>
                  </div>
                </div>

                {/* Calorie tracker */}
                <div className="glass-card p-6 rounded-2xl border border-gray-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="bg-orange-500/15 p-2 rounded-lg border border-orange-500/20"><Flame className="h-5 w-5 text-orange-400" /></div>
                      <div>
                        <h3 className="text-white font-bold text-sm uppercase">Calories</h3>
                        <p className="text-gray-500 text-xs">Goal: {CALORIE_GOAL.toLocaleString()} kcal</p>
                      </div>
                    </div>
                    <span className="text-2xl font-black text-white">{todayHydration.calories}<span className="text-gray-500 text-sm font-medium"> kcal</span></span>
                  </div>
                  <div className="w-full bg-gray-900 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-orange-500 to-red-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${calPct}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{calPct}% of daily goal</span>
                    {calPct >= 100 && <span className="text-xs text-brand-neon font-bold flex items-center gap-1"><Star className="h-3 w-3" />Goal Reached!</span>}
                  </div>
                  <div className="flex gap-3">
                    {[200, 500].map(cal => (
                      <button key={cal} onClick={() => updateHydration('calories', cal)} className="flex-1 py-2 text-xs font-bold bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 rounded-lg transition-all">+{cal} kcal</button>
                    ))}
                    <button onClick={() => updateHydration('calories', -200)} className="py-2 px-3 text-xs font-bold bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-lg transition-all">-200</button>
                  </div>
                </div>
              </div>

              {/* Weekly streak grid */}
              <div className="glass-card p-6 rounded-2xl border border-gray-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    <h3 className="text-white font-bold text-sm uppercase">Weekly Attendance Tracker</h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-brand-neon font-black border border-brand-neon/20 bg-brand-neon/10 px-3 py-1 rounded-full">
                    <Trophy className="h-3.5 w-3.5" />
                    <span>{currentStreak} Day Streak</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  {weekDates.map((d, i) => {
                    const attended = attendedDays.includes(d);
                    const isToday = d === today();
                    return (
                      <button
                        key={d}
                        onClick={() => toggleStreak(d)}
                        className={`flex-1 flex flex-col items-center gap-2 py-4 rounded-xl text-xs font-extrabold transition-all border ${
                          attended ? 'bg-brand-neon text-brand-dark border-brand-neon shadow-neon-glow' : isToday ? 'border-brand-neon/30 text-brand-neon/70 bg-brand-neon/5' : 'border-gray-900 text-gray-600 bg-brand-dark/40 hover:border-gray-700'
                        }`}
                      >
                        <span>{WEEK_DAYS[i]}</span>
                        {attended
                          ? <CheckCircle2 className="h-5 w-5" />
                          : <div className="h-5 w-5 rounded-full border-2 border-current opacity-30" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Trophy Case (Gamification Badges) */}
              <div className="glass-card p-6 rounded-2xl border border-gray-800 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-5 w-5 text-yellow-400" />
                  <h3 className="text-white font-bold text-sm uppercase">Trophy Case</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { id: 'first_class', title: 'First Blood', desc: 'Attended your first class', icon: <Flame className="h-6 w-6" />, active: attendedDays.length > 0 },
                    { id: 'streak_3', title: 'Momentum', desc: 'Achieved a 3-day streak', icon: <Zap className="h-6 w-6" />, active: currentStreak >= 3 },
                    { id: 'early_bird', title: 'Early Bird', desc: 'Attended a 6:00 AM class', icon: <Coffee className="h-6 w-6" />, active: false }, // Mock inactive badge
                    { id: 'weekend', title: 'Weekend Warrior', desc: 'Attended a class on Saturday', icon: <Target className="h-6 w-6" />, active: false }, // Mock inactive badge
                  ].map(badge => (
                    <motion.div 
                      key={badge.id}
                      whileHover={{ scale: 1.05 }}
                      className={`relative flex flex-col items-center text-center p-4 rounded-xl border transition-all ${
                        badge.active 
                          ? 'bg-yellow-400/10 border-yellow-400/30 text-yellow-400' 
                          : 'bg-brand-dark/50 border-gray-800 text-gray-600 grayscale'
                      }`}
                    >
                      <div className={`mb-3 p-3 rounded-full ${badge.active ? 'bg-yellow-400/20' : 'bg-gray-900'}`}>
                        {badge.icon}
                      </div>
                      <h4 className={`text-xs font-black uppercase tracking-wider mb-1 ${badge.active ? 'text-white' : 'text-gray-500'}`}>{badge.title}</h4>
                      <p className="text-[10px] text-gray-500">{badge.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─────── BODY METRICS TAB ──────────────────────────────────── */}
          {activeTab === 'metrics' && (
            <div className="space-y-6">
              {/* Latest Snapshot */}
              {latestMetric && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {[
                    { label: 'Body Weight', value: `${latestMetric.weightKg} kg`, d: delta('weightKg'), color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', icon: <Heart className="h-5 w-5 text-blue-400" /> },
                    { label: 'Body Fat', value: `${latestMetric.bodyFatPct}%`, d: delta('bodyFatPct'), color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', icon: <Flame className="h-5 w-5 text-orange-400" /> },
                    { label: 'Muscle Mass', value: `${latestMetric.muscleMassKg} kg`, d: delta('muscleMassKg'), color: 'text-brand-neon', bg: 'bg-brand-neon/10 border-brand-neon/20', icon: <Dumbbell className="h-5 w-5 text-brand-neon" /> },
                  ].map((m, i) => (
                    <div key={i} className={`glass-card p-5 rounded-2xl border ${m.bg} space-y-3`}>
                      <div className="flex justify-between items-center">
                        <div className="bg-brand-dark/60 p-2 rounded-lg">{m.icon}</div>
                        {m.d !== null && (
                          <span className={`text-xs font-black px-2 py-0.5 rounded-full border ${m.d > 0 ? 'text-green-400 bg-green-500/10 border-green-500/20' : m.d < 0 ? 'text-red-400 bg-red-500/10 border-red-500/20' : 'text-gray-400 border-gray-700'}`}>
                            {m.d > 0 ? `+${m.d}` : m.d}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">{m.label}</p>
                        <p className={`text-3xl font-black ${m.color} mt-0.5`}>{m.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Progress bars over time */}
              {metrics.length >= 2 && (
                <div className="glass-card p-6 rounded-2xl border border-gray-800 space-y-4">
                  <h3 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                    <BarChart2 className="h-4 w-4 text-brand-neon" />
                    Progress Over Time
                  </h3>
                  <div className="space-y-4">
                    {metrics.slice(-5).map((m, i, arr) => {
                      const isLast = i === arr.length - 1;
                      return (
                        <div key={m.date} className={`flex items-center gap-4 text-xs ${isLast ? 'opacity-100' : 'opacity-60'}`}>
                          <span className="text-gray-500 w-20 shrink-0">{new Date(m.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                          <div className="flex-1 grid grid-cols-3 gap-2">
                            <div className="bg-gray-900 rounded-full h-2 overflow-hidden"><div className="h-full bg-blue-400 rounded-full" style={{ width: `${Math.min(100, m.weightKg / 120 * 100)}%` }} /></div>
                            <div className="bg-gray-900 rounded-full h-2 overflow-hidden"><div className="h-full bg-orange-400 rounded-full" style={{ width: `${Math.min(100, m.bodyFatPct / 40 * 100)}%` }} /></div>
                            <div className="bg-gray-900 rounded-full h-2 overflow-hidden"><div className="h-full bg-brand-neon rounded-full" style={{ width: `${Math.min(100, m.muscleMassKg / 80 * 100)}%` }} /></div>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-right w-32 shrink-0">
                            <span className="text-blue-400 font-bold">{m.weightKg}kg</span>
                            <span className="text-orange-400 font-bold">{m.bodyFatPct}%</span>
                            <span className="text-brand-neon font-bold">{m.muscleMassKg}kg</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex gap-4 text-xs text-gray-500 pt-2 border-t border-gray-900">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400" />Weight</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400" />Body Fat</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-neon" />Muscle</span>
                  </div>
                </div>
              )}

              {/* Log new entry */}
              <div className="glass-card p-6 rounded-2xl border border-gray-800 space-y-4">
                <h3 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                  <Plus className="h-4 w-4 text-brand-neon" />
                  Log Today's Measurements
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Weight (kg)', key: 'weightKg', placeholder: 'e.g. 78.5' },
                    { label: 'Body Fat (%)', key: 'bodyFatPct', placeholder: 'e.g. 18.0' },
                    { label: 'Muscle Mass (kg)', key: 'muscleMassKg', placeholder: 'e.g. 40.0' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-xs uppercase font-extrabold tracking-wider text-gray-400 mb-1.5">{f.label}</label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder={f.placeholder}
                        className="w-full bg-brand-dark border border-gray-800 rounded-md py-2.5 px-4 text-white text-sm focus:border-brand-neon focus:ring-1 focus:ring-brand-neon focus:outline-none"
                        value={metricInput[f.key as keyof typeof metricInput]}
                        onChange={e => setMetricInput(prev => ({ ...prev, [f.key]: e.target.value }))}
                      />
                    </div>
                  ))}
                </div>
                <Button onClick={saveMetric} className="w-full sm:w-auto">Save Today's Metrics</Button>
              </div>
            </div>
          )}

          {/* ─────── PERSONAL TRAINING TAB ─────────────────────────────── */}
          {activeTab === 'pt' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Active PT sessions */}
                <div className="space-y-4">
                  <h3 className="text-white font-bold text-sm uppercase tracking-wider">Your PT Sessions</h3>
                  {ptRequests.map(pt => (
                    <div key={pt.id} className="glass-card p-5 rounded-xl border border-gray-800 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-white font-bold">{pt.trainerName}</h4>
                          <p className="text-gray-400 text-xs mt-0.5">{pt.specialty}</p>
                        </div>
                        <span className={`text-xs font-black uppercase px-2.5 py-1 rounded-full border ${
                          pt.status === 'confirmed' ? 'bg-brand-neon/10 text-brand-neon border-brand-neon/20' :
                          pt.status === 'pending'   ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                          'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>{pt.status}</span>
                      </div>
                      <div className="flex gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3 text-brand-neon" />{pt.date}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-brand-neon" />{pt.time}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Book new PT */}
                <div className="glass-card p-6 rounded-xl border border-gray-800 space-y-4">
                  <h3 className="text-white font-bold text-sm uppercase tracking-wider">Book a Personal Trainer</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Sarah Jenkins', specialty: 'HIIT & Cardio', available: true },
                      { name: 'Marcus Vance', specialty: 'Strength & Power', available: true },
                      { name: 'Elena Rostova', specialty: 'Yoga & Mobility', available: false },
                    ].map(t => (
                      <div key={t.name} className="flex items-center justify-between p-3 bg-brand-dark/60 border border-gray-900 rounded-lg">
                        <div>
                          <p className="text-white text-sm font-semibold">{t.name}</p>
                          <p className="text-gray-500 text-xs">{t.specialty}</p>
                        </div>
                        <button
                          disabled={!t.available}
                          onClick={() => alert(`PT request for ${t.name} submitted! (Phase 3 feature)`)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-md transition-all ${t.available ? 'bg-brand-neon text-brand-dark hover:shadow-neon-glow' : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}
                        >
                          {t.available ? 'Request' : 'Unavailable'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─────── NOTIFICATIONS TAB ─────────────────────────────────── */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-bold text-sm uppercase tracking-wider">{unreadCount > 0 ? `${unreadCount} Unread` : 'All Caught Up'}</h3>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-brand-neon hover:underline font-bold">Mark all as read</button>
                )}
              </div>
              {notifs.map((n: any) => (
                <div key={n.id} className={`glass-card p-5 rounded-xl border transition-all ${n.read ? 'border-gray-900 opacity-60' : n.type === 'success' ? 'border-brand-neon/20' : n.type === 'warning' ? 'border-yellow-500/20' : 'border-blue-500/20'}`}>
                  <div className="flex items-start gap-4">
                    <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${n.read ? 'bg-gray-700' : n.type === 'success' ? 'bg-brand-neon' : n.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-white text-sm font-bold">{n.title}</h4>
                        <span className="text-gray-600 text-xs shrink-0">{new Date(n.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-gray-400 text-xs mt-1 leading-relaxed">{n.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { useBookingStore } from '../store/bookingStore';
import { usePaymentStore } from '../store/paymentStore';
import {
  Plus, Users, Calendar, Check, AlertCircle,
  BarChart2, Star, Trash2, CheckCircle2,
  Activity, Shield, UserCheck,
  Bell, Eye, QrCode, CreditCard, Upload, XCircle, Image as ImageIcon
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { motion, AnimatePresence } from 'framer-motion';

// ── Types ────────────────────────────────────────────────────────────────────
type AdminTab = 'overview' | 'classes' | 'schedule' | 'roster' | 'reviews' | 'announcements' | 'payments' | 'qrsettings';

interface MockRosterEntry {
  id: string;
  name: string;
  email: string;
  status: 'booked' | 'attended' | 'absent';
}

interface MockReview {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'removed';
  date: string;
}

interface Announcement {
  id: string;
  title: string;
  body: string;
  type: 'info' | 'warning' | 'urgent';
  active: boolean;
  createdAt: string;
}

// ── Mock Data ────────────────────────────────────────────────────────────────
const INITIAL_REVIEWS: MockReview[] = [
  { id: 'r1', userName: 'Aade Kunwar',    rating: 5, comment: 'AAL EX SIZE! Best gym in Bhimdatta, totally motivating environment.',               status: 'approved', date: '2025-09-15' },
  { id: 'r2', userName: 'Deeps Single',   rating: 5, comment: 'Excellent equipment and amazing trainers. Would highly recommend to everyone!',     status: 'pending',  date: '2025-08-20' },
  { id: 'r3', userName: 'Kailash Saaud',  rating: 5, comment: 'Love the energy in this gym. Staff is helpful and the classes are world-class.',    status: 'pending',  date: '2026-05-10' },
  { id: 'r4', userName: 'Rajesh Thapa',   rating: 4, comment: 'Great gym. Could use a few more machines during peak hours but overall excellent.', status: 'approved', date: '2026-06-22' },
];

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  { id: 'a1', title: 'Holiday Schedule',  body: 'The gym will operate on reduced hours (8AM-5PM) during Dashain festival.',         type: 'info',    active: true,  createdAt: new Date(Date.now() - 86400*2000).toISOString() },
  { id: 'a2', title: 'New Yoga Class',    body: 'POWER SCULPT Yoga starts every Saturday from 7AM. Limited spots – book now!',       type: 'info',    active: true,  createdAt: new Date(Date.now() - 86400*1000).toISOString() },
  { id: 'a3', title: 'Equipment Check',   body: 'Heavy barbells in Studio B will be serviced on Monday. Alternate machines available.',type: 'warning', active: false, createdAt: new Date(Date.now() - 86400*5000).toISOString() },
];

const CATEGORIES = ['HIIT', 'Strength', 'Yoga', 'Cardio', 'Mobility'];
const TRAINERS = [
  { id: 'trainer-1', name: 'Sarah Jenkins' },
  { id: 'trainer-2', name: 'Marcus Vance' },
  { id: 'trainer-3', name: 'Elena Rostova' },
];

// Occupancy analytics mock (by category)
const CATEGORY_STATS = [
  { category: 'HIIT',     bookings: 87, capacity: 100, color: 'from-brand-neon to-emerald-400' },
  { category: 'Strength', bookings: 62, capacity: 80,  color: 'from-blue-400 to-cyan-400' },
  { category: 'Yoga',     bookings: 45, capacity: 60,  color: 'from-purple-400 to-violet-500' },
  { category: 'Cardio',   bookings: 33, capacity: 50,  color: 'from-orange-400 to-red-400' },
  { category: 'Mobility', bookings: 18, capacity: 30,  color: 'from-pink-400 to-rose-400' },
];

function generateRoster(slotId: string): MockRosterEntry[] {
  const names = ['Saurav Bhattarai', 'Aade Kunwar', 'Deeps Single', 'Kailash Saaud', 'Rajesh Thapa', 'Sunita Rai', 'Maya Gurung', 'Bikash Shrestha'];
  return names.slice(0, 5 + (slotId.charCodeAt(0) % 4)).map((n, i) => ({
    id: `${slotId}-m${i}`,
    name: n,
    email: `${n.toLowerCase().replace(' ', '.')}@email.com`,
    status: i < 2 ? 'attended' : 'booked',
  }));
}

// ── Main Component ───────────────────────────────────────────────────────────
export const AdminDashboard: React.FC = () => {
  const { classTypes, scheduleSlots, error, fetchClassTypes, fetchScheduleSlots, adminAddClassType, adminAddScheduleSlot } = useBookingStore();

  // Active Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // ── Class Type Form ──
  const [className, setClassName]       = useState('');
  const [classDesc, setClassDesc]       = useState('');
  const [classCategory, setClassCategory] = useState('HIIT');
  const [classDuration, setClassDuration] = useState(45);
  const [classCapacity, setClassCapacity] = useState(20);
  const [classImgUrl, setClassImgUrl]   = useState('');

  // ── Schedule Slot Form ──
  const [selectedClassTypeId, setSelectedClassTypeId] = useState('');
  const [trainerId, setTrainerId]       = useState('trainer-1');
  const [trainerName, setTrainerName]   = useState('Sarah Jenkins');
  const [slotDate, setSlotDate]         = useState('');
  const [slotTime, setSlotTime]         = useState('');
  const [roomNumber, setRoomNumber]     = useState('Studio A');

  // ── Feedback ──
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError]     = useState<string | null>(null);
  const [submitting, setSubmitting]       = useState(false);

  // ── Class Roster ──
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [roster, setRoster]             = useState<MockRosterEntry[]>([]);
  const [rosterOpen, setRosterOpen]     = useState(false);

  // ── Reviews ──
  const [reviews, setReviews] = useState<MockReview[]>(() => {
    try { return JSON.parse(localStorage.getItem('uk_admin_reviews') || 'null') ?? INITIAL_REVIEWS; } catch { return INITIAL_REVIEWS; }
  });

  // ── Announcements ──
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    try { return JSON.parse(localStorage.getItem('uk_admin_announcements') || 'null') ?? INITIAL_ANNOUNCEMENTS; } catch { return INITIAL_ANNOUNCEMENTS; }
  });
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnBody,  setNewAnnBody]  = useState('');
  const [newAnnType,  setNewAnnType]  = useState<'info' | 'warning' | 'urgent'>('info');

  // ── Payments & QR Settings Store ──
  const { submissions, qrConfig, updateQRConfig, approvePayment, rejectPayment } = usePaymentStore();

  // QR Settings local form state
  const [bankName, setBankName]           = useState(qrConfig.bankName);
  const [accountNumber, setAccountNumber] = useState(qrConfig.accountNumber);
  const [instructions, setInstructions]   = useState(qrConfig.instructions);
  const [qrImage, setQrImage]             = useState(qrConfig.qrImageBase64);

  // Payment History filters & modal
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [viewReceiptUrl, setViewReceiptUrl] = useState<string | null>(null);

  useEffect(() => { fetchClassTypes(); fetchScheduleSlots(); }, [fetchClassTypes, fetchScheduleSlots]);
  useEffect(() => { if (classTypes.length > 0 && !selectedClassTypeId) setSelectedClassTypeId(classTypes[0].id); }, [classTypes, selectedClassTypeId]);

  const saveReviews = (r: MockReview[]) => { setReviews(r); localStorage.setItem('uk_admin_reviews', JSON.stringify(r)); };
  const saveAnnouncements = (a: Announcement[]) => { setAnnouncements(a); localStorage.setItem('uk_admin_announcements', JSON.stringify(a)); };

  // ── Metrics ──
  const totalBookings  = scheduleSlots.reduce((a, s) => a + s.currentOccupancy, 0);
  const totalCapacity  = scheduleSlots.reduce((a, s) => a + (s.classType?.capacity ?? 0), 0);
  const occupancyPct   = totalCapacity > 0 ? Math.round((totalBookings / totalCapacity) * 100) : 0;
  const pendingReviews = reviews.filter(r => r.status === 'pending').length;
  const pendingPayments = submissions.filter(s => s.status === 'pending').length;

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleQRImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setQrImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveQRConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateQRConfig({
      bankName,
      accountNumber,
      instructions,
      qrImageBase64: qrImage,
    });
    setActionSuccess('QR Payment settings saved successfully!');
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleAddClassType = async (e: React.FormEvent) => {
    e.preventDefault(); setActionError(null); setActionSuccess(null); setSubmitting(true);
    if (!className || !classDesc) { setActionError('Fill in class name and description.'); setSubmitting(false); return; }
    const success = await adminAddClassType({ name: className, description: classDesc, category: classCategory, durationMinutes: Number(classDuration), capacity: Number(classCapacity), imageUrl: classImgUrl });
    setSubmitting(false);
    if (success) { setActionSuccess(`"${className}" added!`); setClassName(''); setClassDesc(''); setClassImgUrl(''); }
    else setActionError('Failed to add class type.');
  };

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault(); setActionError(null); setActionSuccess(null); setSubmitting(true);
    if (!selectedClassTypeId || !slotDate || !slotTime) { setActionError('Select class, date and time.'); setSubmitting(false); return; }
    const start = new Date(`${slotDate}T${slotTime}`);
    const cls   = classTypes.find(c => c.id === selectedClassTypeId);
    if (!cls) { setActionError('Invalid class type.'); setSubmitting(false); return; }
    const end   = new Date(start.getTime() + cls.durationMinutes * 60000);
    const success = await adminAddScheduleSlot({ classTypeId: selectedClassTypeId, trainerId, trainerName, startTime: start.toISOString(), endTime: end.toISOString(), roomNumber });
    setSubmitting(false);
    if (success) { setActionSuccess(`Slot scheduled on ${slotDate} at ${slotTime}.`); setSlotDate(''); setSlotTime(''); }
    else setActionError('Failed to schedule slot.');
  };

  const openRoster = (slotId: string) => {
    setSelectedSlot(slotId);
    setRoster(generateRoster(slotId));
    setRosterOpen(true);
  };

  const toggleAttendance = (memberId: string) => {
    setRoster(prev => prev.map(m =>
      m.id !== memberId ? m :
      { ...m, status: m.status === 'attended' ? 'booked' : m.status === 'booked' ? 'absent' : 'attended' }
    ));
  };

  const moderateReview = (id: string, action: 'approve' | 'remove') => {
    saveReviews(reviews.map(r => r.id !== id ? r : { ...r, status: action === 'approve' ? 'approved' : 'removed' }));
  };

  const addAnnouncement = () => {
    if (!newAnnTitle || !newAnnBody) return;
    const a: Announcement = { id: `a-${Date.now()}`, title: newAnnTitle, body: newAnnBody, type: newAnnType, active: true, createdAt: new Date().toISOString() };
    saveAnnouncements([a, ...announcements]);
    setNewAnnTitle(''); setNewAnnBody('');
  };

  const toggleAnnouncement = (id: string) => {
    saveAnnouncements(announcements.map(a => a.id !== id ? a : { ...a, active: !a.active }));
  };

  const tabs: { id: AdminTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'overview',       label: 'Overview',        icon: <Activity className="h-4 w-4" /> },
    { id: 'payments',       label: 'Payments',        icon: <CreditCard className="h-4 w-4" />, badge: pendingPayments },
    { id: 'qrsettings',     label: 'QR Settings',     icon: <QrCode className="h-4 w-4" /> },
    { id: 'classes',        label: 'Add Class',       icon: <Plus className="h-4 w-4" /> },
    { id: 'schedule',       label: 'Schedule Slot',   icon: <Calendar className="h-4 w-4" /> },
    { id: 'roster',         label: 'Class Roster',    icon: <UserCheck className="h-4 w-4" /> },
    { id: 'reviews',        label: 'Reviews',         icon: <Star className="h-4 w-4" />, badge: pendingReviews },
    { id: 'announcements',  label: 'Announcements',   icon: <Bell className="h-4 w-4" /> },
  ];

  const inputCls = 'w-full bg-brand-dark border border-gray-800 rounded-md py-2.5 px-4 text-white text-sm focus:border-brand-neon focus:ring-1 focus:ring-brand-neon focus:outline-none';
  const labelCls = 'block text-xs uppercase font-extrabold tracking-wider text-gray-400 mb-2';

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-gray-900 pb-6">
        <div>
          <span className="text-brand-neon text-xs font-extrabold uppercase tracking-widest">Management Hub</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-1 uppercase tracking-tight">Admin Control Panel</h1>
          <p className="text-gray-400 text-sm mt-1">Configure classes, schedule slots, moderate reviews, and manage members.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-brand-neon font-black border border-brand-neon/20 bg-brand-neon/10 px-4 py-2 rounded-full">
          <Shield className="h-3.5 w-3.5" />
          <span>Admin Access</span>
        </div>
      </section>

      {/* ── KPI STAT CARDS ───────────────────────────────────────────────── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Bookings',   value: totalBookings,             icon: <Users className="h-5 w-5" />,    color: 'text-brand-neon',  bg: 'bg-brand-neon/10 border-brand-neon/15' },
          { label: 'Scheduled Slots',  value: scheduleSlots.length,      icon: <Calendar className="h-5 w-5" />, color: 'text-teal-400',    bg: 'bg-teal-500/10 border-teal-500/15' },
          { label: 'Occupancy Rate',   value: `${occupancyPct}%`,        icon: <BarChart2 className="h-5 w-5" />,color: 'text-purple-400',  bg: 'bg-purple-500/10 border-purple-500/15' },
          { label: 'Pending Reviews',  value: pendingReviews,            icon: <Star className="h-5 w-5" />,     color: 'text-yellow-400',  bg: 'bg-yellow-500/10 border-yellow-500/15' },
        ].map((s, i) => (
          <div key={i} className={`glass-card p-5 rounded-xl flex items-center gap-4 border ${s.bg}`}>
            <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center ${s.color} border`}>{s.icon}</div>
            <div>
              <div className="text-xs text-gray-500 font-bold uppercase leading-tight">{s.label}</div>
              <div className={`text-2xl font-black mt-0.5 ${s.color}`}>{s.value}</div>
            </div>
          </div>
        ))}
      </section>

      {/* ── ALERTS ───────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {actionSuccess && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl flex items-center gap-3 text-sm font-semibold">
            <Check className="h-5 w-5 shrink-0" />{actionSuccess}
          </motion.div>
        )}
        {(actionError || error) && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3 text-sm font-semibold">
            <AlertCircle className="h-5 w-5 shrink-0" />{actionError || error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TABS ─────────────────────────────────────────────────────────── */}
      <div className="flex gap-1 bg-brand-accent/30 border border-gray-900 p-1.5 rounded-xl overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => { setActiveTab(tab.id); setActionSuccess(null); setActionError(null); }}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-extrabold uppercase tracking-wider whitespace-nowrap transition-all flex-shrink-0 ${
              activeTab === tab.id ? 'bg-brand-neon text-brand-dark shadow-neon-glow' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}>
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge && tab.badge > 0 ? (
              <span className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-xs font-black flex items-center justify-center ${activeTab === tab.id ? 'bg-brand-dark text-brand-neon' : 'bg-yellow-500 text-brand-dark'}`}>{tab.badge}</span>
            ) : null}
          </button>
        ))}
      </div>

      {/* ── TAB CONTENT ──────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }}>

          {/* ═══ OVERVIEW ═══════════════════════════════════════════════ */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Occupancy analytics by category */}
              <div className="glass-card p-6 rounded-2xl border border-gray-800 space-y-4">
                <h3 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                  <BarChart2 className="h-4 w-4 text-brand-neon" />
                  Class Category Occupancy
                </h3>
                <div className="space-y-4">
                  {CATEGORY_STATS.map(s => {
                    const pct = Math.round((s.bookings / s.capacity) * 100);
                    return (
                      <div key={s.category} className="flex items-center gap-4">
                        <span className="text-gray-400 text-xs font-bold uppercase w-20 shrink-0">{s.category}</span>
                        <div className="flex-1 bg-gray-900 rounded-full h-3 overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.7, ease: 'easeOut' }}
                            className={`h-full bg-gradient-to-r ${s.color} rounded-full`} />
                        </div>
                        <div className="text-right shrink-0 w-24">
                          <span className="text-white font-black text-sm">{pct}%</span>
                          <span className="text-gray-600 text-xs ml-1">({s.bookings}/{s.capacity})</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent schedule slots */}
              <div className="glass-card p-6 rounded-2xl border border-gray-800 space-y-4">
                <h3 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-brand-neon" />
                  Upcoming Slots
                </h3>
                <div className="space-y-3">
                  {scheduleSlots.slice(0, 5).map(slot => {
                    const ct = slot.classType;
                    const fillPct = ct ? Math.round((slot.currentOccupancy / ct.capacity) * 100) : 0;
                    return (
                      <div key={slot.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-brand-dark/60 border border-gray-900 rounded-lg p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs bg-brand-neon/10 text-brand-neon border border-brand-neon/15 font-bold px-2 py-0.5 rounded-full">{ct?.category}</span>
                            <span className="text-white font-bold text-sm">{ct?.name ?? 'Unknown'}</span>
                          </div>
                          <div className="flex gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-brand-neon" />{new Date(slot.startTime).toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                            <span>{slot.trainerName}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <div className="text-xs text-gray-500">{slot.currentOccupancy}/{ct?.capacity ?? '?'} members</div>
                            <div className={`text-xs font-bold ${fillPct >= 90 ? 'text-red-400' : fillPct >= 60 ? 'text-yellow-400' : 'text-brand-neon'}`}>{fillPct}% full</div>
                          </div>
                          <button onClick={() => openRoster(slot.id)} className="text-xs font-bold px-3 py-1.5 bg-brand-neon/10 hover:bg-brand-neon/20 text-brand-neon border border-brand-neon/20 rounded-md transition-all flex items-center gap-1">
                            <Eye className="h-3 w-3" />Roster
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {scheduleSlots.length === 0 && <p className="text-gray-600 text-sm text-center py-4">No slots scheduled yet.</p>}
                </div>
              </div>

              {/* Active announcements summary */}
              <div className="glass-card p-6 rounded-2xl border border-gray-800 space-y-3">
                <h3 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                  <Bell className="h-4 w-4 text-brand-neon" />
                  Active Announcements
                </h3>
                {announcements.filter(a => a.active).map(a => (
                  <div key={a.id} className={`flex items-start gap-3 p-3 rounded-lg border ${a.type === 'urgent' ? 'bg-red-500/10 border-red-500/20' : a.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-blue-500/10 border-blue-500/20'}`}>
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${a.type === 'urgent' ? 'bg-red-400' : a.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'}`} />
                    <div>
                      <p className="text-white text-sm font-bold">{a.title}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{a.body}</p>
                    </div>
                  </div>
                ))}
                {announcements.filter(a => a.active).length === 0 && <p className="text-gray-600 text-sm">No active announcements.</p>}
              </div>
            </div>
          )}

          {/* ═══ ADD CLASS TYPE ═════════════════════════════════════════ */}
          {activeTab === 'classes' && (
            <section className="glass-card p-6 md:p-8 rounded-2xl max-w-2xl border border-gray-900">
              <form onSubmit={handleAddClassType} className="space-y-6">
                <h2 className="text-xl font-bold text-white uppercase tracking-wider">Create New Class Type</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div><label className={labelCls} htmlFor="class-name">Class Name *</label><input id="class-name" type="text" placeholder="e.g. Iron Hypertrophy" className={inputCls} value={className} onChange={e => setClassName(e.target.value)} required /></div>
                  <div>
                    <label className={labelCls} htmlFor="class-category">Category</label>
                    <select id="class-category" className={inputCls} value={classCategory} onChange={e => setClassCategory(e.target.value)}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div><label className={labelCls} htmlFor="class-desc">Description *</label><textarea id="class-desc" placeholder="Describe the class format, key moves, and target fitness level." rows={3} className={inputCls} value={classDesc} onChange={e => setClassDesc(e.target.value)} required /></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div><label className={labelCls} htmlFor="class-duration">Duration (minutes)</label><input id="class-duration" type="number" min="15" max="180" className={inputCls} value={classDuration} onChange={e => setClassDuration(Number(e.target.value))} /></div>
                  <div><label className={labelCls} htmlFor="class-capacity">Max Capacity</label><input id="class-capacity" type="number" min="1" max="100" className={inputCls} value={classCapacity} onChange={e => setClassCapacity(Number(e.target.value))} /></div>
                </div>
                <div><label className={labelCls} htmlFor="class-img">Image URL (optional)</label><input id="class-img" type="text" placeholder="/assets/class.jpg" className={inputCls} value={classImgUrl} onChange={e => setClassImgUrl(e.target.value)} /></div>
                <Button type="submit" className="w-full sm:w-auto" isLoading={submitting}><Plus className="h-4 w-4 mr-2" /><span>Create Class Type</span></Button>
              </form>
            </section>
          )}

          {/* ═══ SCHEDULE SLOT ══════════════════════════════════════════ */}
          {activeTab === 'schedule' && (
            <section className="glass-card p-6 md:p-8 rounded-2xl max-w-2xl border border-gray-900">
              <form onSubmit={handleAddSlot} className="space-y-6">
                <h2 className="text-xl font-bold text-white uppercase tracking-wider">Schedule Class Instance</h2>
                <div>
                  <label className={labelCls} htmlFor="slot-class">Select Class *</label>
                  <select id="slot-class" className={inputCls} value={selectedClassTypeId} onChange={e => setSelectedClassTypeId(e.target.value)} required>
                    {classTypes.map(c => <option key={c.id} value={c.id}>{c.name} ({c.category} · {c.durationMinutes} min)</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className={labelCls} htmlFor="slot-trainer">Trainer</label>
                    <select id="slot-trainer" className={inputCls} value={trainerId} onChange={e => { setTrainerId(e.target.value); setTrainerName(TRAINERS.find(t => t.id === e.target.value)?.name ?? ''); }}>
                      {TRAINERS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                  <div><label className={labelCls} htmlFor="slot-room">Room</label><input id="slot-room" type="text" placeholder="Studio A" className={inputCls} value={roomNumber} onChange={e => setRoomNumber(e.target.value)} /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div><label className={labelCls} htmlFor="slot-date">Date *</label><input id="slot-date" type="date" className={inputCls} value={slotDate} onChange={e => setSlotDate(e.target.value)} required /></div>
                  <div><label className={labelCls} htmlFor="slot-time">Start Time *</label><input id="slot-time" type="time" className={inputCls} value={slotTime} onChange={e => setSlotTime(e.target.value)} required /></div>
                </div>
                <Button type="submit" className="w-full sm:w-auto" isLoading={submitting}><Calendar className="h-4 w-4 mr-2" /><span>Schedule Slot</span></Button>
              </form>
            </section>
          )}

          {/* ═══ CLASS ROSTER ═══════════════════════════════════════════ */}
          {activeTab === 'roster' && (
            <div className="space-y-5">
              <h2 className="text-white font-bold text-sm uppercase tracking-wider">Select a Slot to Manage Roster</h2>
              {scheduleSlots.length === 0 && <p className="text-gray-500 text-sm">No slots found. Schedule slots first.</p>}
              <div className="space-y-3">
                {scheduleSlots.map(slot => {
                  const isOpen = selectedSlot === slot.id && rosterOpen;
                  const ct = slot.classType;
                  return (
                    <div key={slot.id} className="glass-card rounded-xl border border-gray-800 overflow-hidden">
                      {/* Slot header */}
                      <button onClick={() => { if (isOpen) { setRosterOpen(false); setSelectedSlot(null); } else openRoster(slot.id); }}
                        className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="bg-brand-neon/10 border border-brand-neon/20 p-2 rounded-lg"><Calendar className="h-4 w-4 text-brand-neon" /></div>
                          <div className="text-left">
                            <p className="text-white font-bold text-sm">{ct?.name ?? 'Unknown'} <span className="text-gray-500 font-normal">— {slot.trainerName}</span></p>
                            <p className="text-gray-500 text-xs">{new Date(slot.startTime).toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} · {slot.roomNumber}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs font-bold text-gray-400">{slot.currentOccupancy}/{ct?.capacity ?? '?'}</span>
                          <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                        </div>
                      </button>

                      {/* Roster table */}
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                            <div className="border-t border-gray-900 p-5 space-y-3">
                              <div className="flex items-center justify-between text-xs text-gray-500 uppercase font-bold px-1">
                                <span>Member</span>
                                <span>Attendance</span>
                              </div>
                              {roster.map(m => (
                                <div key={m.id} className="flex items-center justify-between bg-brand-dark/60 border border-gray-900 rounded-lg px-4 py-3">
                                  <div>
                                    <p className="text-white text-sm font-semibold">{m.name}</p>
                                    <p className="text-gray-500 text-xs">{m.email}</p>
                                  </div>
                                  <button onClick={() => toggleAttendance(m.id)}
                                    className={`text-xs font-black px-3 py-1.5 rounded-full border transition-all ${
                                      m.status === 'attended' ? 'bg-brand-neon/15 text-brand-neon border-brand-neon/30' :
                                      m.status === 'absent'   ? 'bg-red-500/15 text-red-400 border-red-500/30' :
                                      'bg-gray-800 text-gray-400 border-gray-700 hover:border-brand-neon/30 hover:text-brand-neon'
                                    }`}>
                                    {m.status === 'attended' ? '✓ Attended' : m.status === 'absent' ? '✗ Absent' : '○ Booked'}
                                  </button>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══ REVIEWS MODERATION ════════════════════════════════════ */}
          {activeTab === 'reviews' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-white font-bold text-sm uppercase tracking-wider">Member Reviews</h2>
                <span className="text-xs text-yellow-400 font-bold border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 rounded-full">{pendingReviews} Pending Approval</span>
              </div>

              {/* Pending first */}
              {['pending', 'approved', 'removed'].map(statusGroup => {
                const group = reviews.filter(r => r.status === statusGroup);
                if (group.length === 0) return null;
                return (
                  <div key={statusGroup} className="space-y-3">
                    <h3 className={`text-xs font-extrabold uppercase tracking-widest ${statusGroup === 'pending' ? 'text-yellow-400' : statusGroup === 'approved' ? 'text-brand-neon' : 'text-red-400'}`}>
                      {statusGroup} ({group.length})
                    </h3>
                    {group.map(r => (
                      <div key={r.id} className={`glass-card p-5 rounded-xl border ${statusGroup === 'pending' ? 'border-yellow-500/20' : statusGroup === 'approved' ? 'border-brand-neon/15' : 'border-gray-900 opacity-60'}`}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-white font-bold text-sm">{r.userName}</p>
                              <div className="flex">
                                {Array.from({ length: 5 }, (_, i) => (
                                  <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-700'}`} />
                                ))}
                              </div>
                              <span className="text-gray-500 text-xs">{r.date}</span>
                            </div>
                            <p className="text-gray-300 text-sm mt-1.5 leading-relaxed">"{r.comment}"</p>
                          </div>
                          {statusGroup === 'pending' && (
                            <div className="flex flex-col gap-2 shrink-0">
                              <button onClick={() => moderateReview(r.id, 'approve')} className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-brand-neon/10 hover:bg-brand-neon/20 text-brand-neon border border-brand-neon/20 rounded-md transition-all">
                                <CheckCircle2 className="h-3.5 w-3.5" />Approve
                              </button>
                              <button onClick={() => moderateReview(r.id, 'remove')} className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-md transition-all">
                                <Trash2 className="h-3.5 w-3.5" />Remove
                              </button>
                            </div>
                          )}
                          {statusGroup === 'approved' && (
                            <button onClick={() => moderateReview(r.id, 'remove')} className="text-xs font-bold px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-md transition-all">Remove</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          {/* ═══ ANNOUNCEMENTS ══════════════════════════════════════════ */}
          {activeTab === 'announcements' && (
            <div className="space-y-6">
              {/* Create new announcement */}
              <div className="glass-card p-6 rounded-2xl border border-gray-800 space-y-4">
                <h3 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                  <Bell className="h-4 w-4 text-brand-neon" />
                  Broadcast New Announcement
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2"><label className={labelCls}>Title</label><input type="text" placeholder="Announcement title…" className={inputCls} value={newAnnTitle} onChange={e => setNewAnnTitle(e.target.value)} /></div>
                  <div>
                    <label className={labelCls}>Type</label>
                    <select className={inputCls} value={newAnnType} onChange={e => setNewAnnType(e.target.value as any)}>
                      <option value="info">ℹ Info</option>
                      <option value="warning">⚠ Warning</option>
                      <option value="urgent">🔴 Urgent</option>
                    </select>
                  </div>
                </div>
                <div><label className={labelCls}>Message</label><textarea rows={3} placeholder="Announcement body text…" className={inputCls} value={newAnnBody} onChange={e => setNewAnnBody(e.target.value)} /></div>
                <Button onClick={addAnnouncement} disabled={!newAnnTitle || !newAnnBody}><Bell className="h-4 w-4 mr-2" />Publish Announcement</Button>
              </div>

              {/* Existing announcements */}
              <div className="space-y-3">
                <h3 className="text-white font-bold text-sm uppercase tracking-wider">All Announcements</h3>
                {announcements.map(a => (
                  <div key={a.id} className={`glass-card p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center gap-4 justify-between transition-all ${!a.active ? 'opacity-50' : a.type === 'urgent' ? 'border-red-500/20' : a.type === 'warning' ? 'border-yellow-500/20' : 'border-blue-500/20'}`}>
                    <div className="flex items-start gap-3">
                      <span className="text-lg mt-0.5">{a.type === 'urgent' ? '🔴' : a.type === 'warning' ? '⚠️' : 'ℹ️'}</span>
                      <div>
                        <p className="text-white font-bold text-sm">{a.title}</p>
                        <p className="text-gray-400 text-xs mt-1 leading-relaxed">{a.body}</p>
                        <p className="text-gray-600 text-xs mt-1.5">{new Date(a.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <button onClick={() => toggleAnnouncement(a.id)}
                      className={`text-xs font-bold px-4 py-2 rounded-lg border transition-all shrink-0 ${a.active ? 'bg-brand-neon/10 text-brand-neon border-brand-neon/20 hover:bg-brand-neon/20' : 'bg-gray-800 text-gray-500 border-gray-700 hover:border-gray-600'}`}>
                      {a.active ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ PAYMENTS HISTORY & REVIEW TAB ════════════════════════════ */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              {/* Header & Filter Row */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass-card p-5 rounded-2xl border border-gray-800">
                <div>
                  <h3 className="text-white font-bold text-base uppercase tracking-tight flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-brand-neon" />
                    Member Payment History & Receipts
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">Review uploaded member receipts, verify amounts, and update membership status.</p>
                </div>
                {/* Filter buttons */}
                <div className="flex gap-2 w-full sm:w-auto">
                  {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setPaymentFilter(f)}
                      className={`flex-1 sm:flex-none text-xs font-bold uppercase px-3 py-1.5 rounded-lg border transition-all ${
                        paymentFilter === f
                          ? 'bg-brand-neon text-brand-dark border-brand-neon shadow-neon-glow'
                          : 'bg-brand-dark text-gray-400 border-gray-800 hover:text-white'
                      }`}
                    >
                      {f} {f === 'pending' && pendingPayments > 0 ? `(${pendingPayments})` : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payments Submissions List */}
              {submissions.filter(s => paymentFilter === 'all' || s.status === paymentFilter).length === 0 ? (
                <div className="glass-card p-12 rounded-2xl text-center border border-gray-800 space-y-3">
                  <CreditCard className="h-10 w-10 text-gray-600 mx-auto" />
                  <h4 className="text-white font-bold text-sm uppercase">No Payments Found</h4>
                  <p className="text-gray-500 text-xs">There are no payment submissions matching the "{paymentFilter}" filter.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {submissions
                    .filter(s => paymentFilter === 'all' || s.status === paymentFilter)
                    .map(sub => (
                      <div
                        key={sub.id}
                        className={`glass-card p-5 rounded-2xl border transition-all ${
                          sub.status === 'pending'
                            ? 'border-yellow-500/30 bg-yellow-500/5'
                            : sub.status === 'approved'
                            ? 'border-green-500/20'
                            : 'border-red-500/20 opacity-75'
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                          {/* Info */}
                          <div className="flex items-start gap-4">
                            {/* Receipt Thumbnail */}
                            {sub.receiptImageBase64 ? (
                              <button
                                onClick={() => setViewReceiptUrl(sub.receiptImageBase64)}
                                className="relative group shrink-0"
                                title="Click to enlarge receipt"
                              >
                                <img
                                  src={sub.receiptImageBase64}
                                  alt="Receipt Screenshot"
                                  className="w-16 h-16 object-cover rounded-xl border border-gray-700 group-hover:border-brand-neon transition-colors"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-xl flex items-center justify-center transition-opacity">
                                  <Eye className="h-5 w-5 text-white" />
                                </div>
                              </button>
                            ) : (
                              <div className="w-16 h-16 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-600 shrink-0">
                                <ImageIcon className="h-6 w-6" />
                              </div>
                            )}

                            <div className="space-y-1">
                              <div className="flex items-center gap-3">
                                <h4 className="text-white font-extrabold text-base">{sub.memberName}</h4>
                                <span
                                  className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                                    sub.status === 'pending'
                                      ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                      : sub.status === 'approved'
                                      ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                      : 'bg-red-500/10 text-red-400 border-red-500/20'
                                  }`}
                                >
                                  {sub.status}
                                </span>
                              </div>
                              <p className="text-xs text-gray-400">{sub.memberEmail}</p>
                              <div className="flex items-center gap-4 text-xs pt-1">
                                <span className="text-brand-neon font-black">Plan: {sub.membershipTier}</span>
                                <span className="text-white font-bold">Amount: Rs. {sub.amountPaid?.toLocaleString()}</span>
                                <span className="text-gray-500">{new Date(sub.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 border-t lg:border-t-0 border-gray-800 pt-4 lg:pt-0">
                            {sub.status === 'pending' ? (
                              <>
                                <button
                                  onClick={() => approvePayment(sub.id, 'Verified via QR screenshot')}
                                  className="flex items-center justify-center gap-1.5 text-xs font-bold px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 rounded-xl transition-all"
                                >
                                  <CheckCircle2 className="h-4 w-4" /> Approve Payment
                                </button>
                                <button
                                  onClick={() => rejectPayment(sub.id, 'Receipt unreadable or payment missing')}
                                  className="flex items-center justify-center gap-1.5 text-xs font-bold px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl transition-all"
                                >
                                  <XCircle className="h-4 w-4" /> Reject Payment
                                </button>
                              </>
                            ) : sub.status === 'approved' ? (
                              <button
                                onClick={() => rejectPayment(sub.id)}
                                className="text-xs font-bold px-3 py-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                              >
                                Revoke Approval
                              </button>
                            ) : (
                              <button
                                onClick={() => approvePayment(sub.id)}
                                className="text-xs font-bold px-3 py-1.5 text-gray-500 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all"
                              >
                                Re-approve
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* ═══ QR CODE SETTINGS TAB ══════════════════════════════════════ */}
          {activeTab === 'qrsettings' && (
            <div className="space-y-6">
              <div className="glass-card p-6 rounded-2xl border border-gray-800">
                <h3 className="text-white font-extrabold text-base uppercase tracking-tight flex items-center gap-2 mb-1">
                  <QrCode className="h-5 w-5 text-brand-neon" />
                  Gym QR Code Payment Settings
                </h3>
                <p className="text-xs text-gray-400 mb-6">
                  Upload your gym's official payment QR code (eSewa / FonePay / Khalti / Bank QR). Members will see this code when paying for memberships.
                </p>

                <form onSubmit={handleSaveQRConfig} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Form fields */}
                  <div className="space-y-4">
                    <div>
                      <label className={labelCls}>Payment Gateway / Bank Name</label>
                      <input
                        type="text"
                        placeholder="e.g. eSewa / FonePay / Nabil Bank"
                        className={inputCls}
                        value={bankName}
                        onChange={e => setBankName(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className={labelCls}>Account Number / Mobile Number</label>
                      <input
                        type="text"
                        placeholder="e.g. 9800000000"
                        className={inputCls}
                        value={accountNumber}
                        onChange={e => setAccountNumber(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className={labelCls}>Payment Instructions for Members</label>
                      <textarea
                        rows={4}
                        placeholder="Scan QR code, enter exact membership amount, then upload screenshot of completed payment..."
                        className={inputCls}
                        value={instructions}
                        onChange={e => setInstructions(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className={labelCls}>Upload QR Code Image</label>
                      <div className="relative border-2 border-dashed border-gray-700 hover:border-brand-neon/50 bg-brand-dark/50 rounded-xl p-4 text-center cursor-pointer transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleQRImageUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        <div className="flex flex-col items-center gap-1">
                          <Upload className="h-5 w-5 text-gray-400" />
                          <span className="text-xs font-bold text-white">Click to upload new QR Image</span>
                          <span className="text-[10px] text-gray-500">PNG, JPG or WEBP image</span>
                        </div>
                      </div>
                    </div>

                    <Button type="submit" className="w-full justify-center py-3 text-xs font-bold uppercase tracking-wider">
                      Save QR Settings
                    </Button>
                  </div>

                  {/* Member Live Preview Card */}
                  <div className="bg-brand-dark border border-gray-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Member Checkout Preview</span>

                    {qrImage ? (
                      <img
                        src={qrImage}
                        alt="QR Code Preview"
                        className="w-56 h-56 object-contain rounded-xl border border-gray-700 bg-white p-2 shadow-xl"
                      />
                    ) : (
                      <div className="w-56 h-56 rounded-xl border-2 border-dashed border-gray-700 flex flex-col items-center justify-center p-4 text-gray-600 bg-black/40">
                        <QrCode className="h-16 w-16 mb-2 text-gray-700" />
                        <span className="text-xs font-bold uppercase">No QR Image Uploaded</span>
                      </div>
                    )}

                    <div className="space-y-1 text-xs w-full max-w-xs text-left border-t border-gray-800 pt-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Gateway:</span>
                        <span className="text-white font-bold">{bankName || 'Not Set'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Account ID:</span>
                        <span className="text-brand-neon font-mono font-bold">{accountNumber || 'Not Set'}</span>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>

      {/* Lightbox Receipt Preview Modal */}
      {viewReceiptUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={() => setViewReceiptUrl(null)}>
          <div className="relative max-w-3xl max-h-[90vh] bg-gray-900 rounded-2xl p-2 border border-gray-800" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setViewReceiptUrl(null)}
              className="absolute -top-3 -right-3 bg-brand-neon text-brand-dark p-2 rounded-full font-bold shadow-lg hover:scale-110 transition-transform"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={viewReceiptUrl}
              alt="Full Receipt Screenshot"
              className="max-h-[85vh] w-auto object-contain rounded-xl mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
};


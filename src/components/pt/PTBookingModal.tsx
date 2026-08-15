import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Dumbbell, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';

interface PTBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedTrainer?: string;
  memberName?: string;
}

const TRAINERS = [
  { id: 't1', name: 'Marcus Thorne', specialty: 'Head Strength & Powerlifting', vibe: 'Heavy Metal & Phonk' },
  { id: 't2', name: 'Elena Rostova', specialty: 'HIIT & Circuit Conditioning', vibe: "'90s Hip Hop & D&B" },
  { id: 't3', name: 'Julian Vance', specialty: 'Mobility & Athletic Recovery', vibe: 'Deep House & Lo-Fi' },
];

const FOCUS_AREAS = [
  'Strength & Heavy Compound Lifts',
  'HIIT, Conditioning & Fat Shred',
  'Bodybuilding & Hypertrophy',
  'Mobility, Core & Yoga Recovery',
  'Form Check & Physiological Assessment',
];

const TIME_SLOTS = ['07:00 AM', '09:00 AM', '11:00 AM', '04:00 PM', '06:00 PM', '07:30 PM'];

export const PTBookingModal: React.FC<PTBookingModalProps> = ({
  isOpen,
  onClose,
  preselectedTrainer = 'Marcus Thorne',
  memberName = '',
}) => {
  const [selectedTrainer, setSelectedTrainer] = useState(preselectedTrainer);
  const [focusArea, setFocusArea] = useState(FOCUS_AREAS[0]);
  const [sessionDate, setSessionDate] = useState('');
  const [sessionTime, setSessionTime] = useState(TIME_SLOTS[0]);
  const [nameInput, setNameInput] = useState(memberName);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!sessionDate) {
      setError('Please select a session date.');
      return;
    }

    // Save PT session to localStorage mock storage
    try {
      const existing = JSON.parse(localStorage.getItem('uk_fitness_pt_sessions') || '[]');
      const newSession = {
        id: `pt_${Date.now()}`,
        memberName: nameInput.trim(),
        trainerName: selectedTrainer,
        focusArea,
        date: sessionDate,
        time: sessionTime,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('uk_fitness_pt_sessions', JSON.stringify([newSession, ...existing]));
    } catch {
      // fallback
    }

    setError(null);
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setError(null);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="glass-card w-full max-w-xl rounded-3xl border border-gray-800 p-6 md:p-8 relative overflow-hidden bg-brand-dark/95 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-neon/10 border border-brand-neon/20 flex items-center justify-center text-brand-neon">
                <Dumbbell className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white uppercase tracking-tight">Book 1-on-1 PT Session</h3>
                <p className="text-xs text-gray-400">Personalized Coaching • Private Studio Access</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs font-bold">
                  {error}
                </div>
              )}

              {/* Step 1: Select Trainer */}
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                  Select Coach
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {TRAINERS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedTrainer(t.name)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedTrainer === t.name
                          ? 'bg-brand-neon/15 border-brand-neon text-brand-neon shadow-neon-glow'
                          : 'bg-gray-900/60 border-gray-800 text-gray-400 hover:text-white'
                      }`}
                    >
                      <span className="block text-xs font-black uppercase text-white mb-0.5">{t.name}</span>
                      <span className="block text-[10px] text-gray-500 line-clamp-1">{t.specialty}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Focus Area */}
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Session Focus Area
                </label>
                <select
                  value={focusArea}
                  onChange={(e) => setFocusArea(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white font-bold focus:border-brand-neon focus:outline-none"
                >
                  {FOCUS_AREAS.map((fa) => (
                    <option key={fa} value={fa}>
                      {fa}
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 3: Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white font-bold focus:border-brand-neon focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Preferred Time Slot
                  </label>
                  <select
                    value={sessionTime}
                    onChange={(e) => setSessionTime(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white font-bold focus:border-brand-neon focus:outline-none"
                  >
                    {TIME_SLOTS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Step 4: Member Name */}
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white font-bold focus:border-brand-neon focus:outline-none"
                />
              </div>

              <Button type="submit" className="w-full justify-center py-3 text-xs font-bold uppercase tracking-wider gap-2">
                <span>Confirm 1-on-1 PT Booking</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          ) : (
            /* Success State */
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-brand-neon/10 border border-brand-neon/30 text-brand-neon flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <div>
                <h4 className="text-2xl font-extrabold text-white uppercase tracking-tight">PT Session Booked!</h4>
                <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                  Your private 1-on-1 session with <strong className="text-brand-neon">{selectedTrainer}</strong> is confirmed.
                </p>
              </div>

              <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Coach:</span>
                  <span className="text-white font-bold">{selectedTrainer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Focus:</span>
                  <span className="text-white font-bold">{focusArea}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date & Time:</span>
                  <span className="text-brand-neon font-bold">{sessionDate} at {sessionTime}</span>
                </div>
              </div>

              <Button onClick={handleClose} className="w-full justify-center py-3 text-xs font-bold uppercase tracking-wider">
                Done
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

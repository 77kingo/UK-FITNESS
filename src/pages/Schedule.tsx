import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useBookingStore } from '../store/bookingStore';
import { ClassCard } from '../components/schedule/ClassCard';
import { BookingModal } from '../components/schedule/BookingModal';
import { ScheduleSlot } from '../types';
import { Calendar, Filter, AlertTriangle } from 'lucide-react';

interface ScheduleProps {
  onOpenAuth: () => void;
}

export const Schedule: React.FC<ScheduleProps> = ({ onOpenAuth }) => {
  const { user } = useAuthStore();
  const {
    scheduleSlots,
    userBookings,
    loading,
    error,
    fetchClassTypes,
    fetchScheduleSlots,
    fetchUserBookings,
    createBooking,
    cancelBookingBySlot,
  } = useBookingStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDayOffset, setSelectedDayOffset] = useState<number>(0);
  const [activeSlotForBooking, setActiveSlotForBooking] = useState<ScheduleSlot | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const initData = async () => {
      await fetchClassTypes();
      await fetchScheduleSlots();
      if (user) {
        await fetchUserBookings(user.id);
      }
    };
    initData();
  }, [user, fetchClassTypes, fetchScheduleSlots, fetchUserBookings]);

  // Categories list for filtering
  const categories = ['All', 'HIIT', 'Strength', 'Yoga'];

  // Day filter calculations
  const getDayLabel = (offset: number) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    if (offset === 0) return 'Today';
    if (offset === 1) return 'Tomorrow';
    return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const getFilteredSlots = () => {
    return scheduleSlots.filter((slot) => {
      // 1. Filter by category
      const matchesCategory =
        selectedCategory === 'All' ||
        slot.classType?.category.toLowerCase() === selectedCategory.toLowerCase();

      // 2. Filter by date offset
      const slotDate = new Date(slot.startTime);
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + selectedDayOffset);
      
      const isSameDay =
        slotDate.getFullYear() === targetDate.getFullYear() &&
        slotDate.getMonth() === targetDate.getMonth() &&
        slotDate.getDate() === targetDate.getDate();

      return matchesCategory && isSameDay;
    });
  };

  const isSlotBooked = (slotId: string) => {
    return userBookings.some((b) => b.scheduleSlotId === slotId);
  };

  const handleBookClick = (slot: ScheduleSlot) => {
    setActiveSlotForBooking(slot);
  };

  const handleConfirmBooking = async () => {
    if (!user || !activeSlotForBooking) return;
    setBookingLoading(true);
    const success = await createBooking(user.id, activeSlotForBooking.id);
    setBookingLoading(false);
    if (success) {
      setActiveSlotForBooking(null);
    }
  };

  const handleCancelBooking = async (slot: ScheduleSlot) => {
    if (!user) return;
    if (window.confirm(`Are you sure you want to cancel your booking for ${slot.classType?.name}?`)) {
      await cancelBookingBySlot(user.id, slot.id);
    }
  };

  const filteredSlots = getFilteredSlots();

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Page Header */}
      <section className="text-center md:text-left max-w-3xl">
        <span className="text-brand-neon text-sm font-extrabold uppercase tracking-widest">TIMETABLE & REGISTRATION</span>
        <h1 className="text-4xl font-extrabold text-white mt-2 uppercase tracking-tight">CLASS SCHEDULE</h1>
        <p className="text-gray-400 text-sm sm:text-base mt-2 leading-relaxed">
          Filter by discipline or calendar date below. Book slots in advance. Lockers, towels, and showers are provided at no additional cost.
        </p>
      </section>

      {/* Database Error Alert */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Schedule Operation Error</h4>
            <p className="text-xs text-red-400/80 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Filters: Day Selector & Category Tabs */}
      <div className="space-y-6 bg-brand-accent/20 border border-gray-900 p-5 rounded-2xl">
        {/* Day selection row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-white font-bold" aria-label="Select Date">
            <Calendar className="h-4 w-4 text-brand-neon" />
            <span className="uppercase tracking-wider">Date Selection</span>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            {[0, 1, 2].map((offset) => (
              <button
                key={offset}
                onClick={() => setSelectedDayOffset(offset)}
                className={`flex-1 sm:flex-none text-xs uppercase font-extrabold px-5 py-2.5 rounded-md border tracking-wider transition-all duration-300 ${
                  selectedDayOffset === offset
                    ? 'bg-brand-neon text-brand-dark border-brand-neon shadow-neon-glow'
                    : 'bg-brand-dark/50 text-gray-400 border-gray-800 hover:text-white'
                }`}
              >
                {getDayLabel(offset)}
              </button>
            ))}
          </div>
        </div>

        <hr className="border-gray-900" />

        {/* Category Tabs */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-white font-bold" aria-label="Filter Category">
            <Filter className="h-4 w-4 text-brand-neon" />
            <span className="uppercase tracking-wider">Discipline Filter</span>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-1 sm:flex-none text-xs uppercase font-extrabold px-5 py-2 rounded-md border tracking-wider transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-brand-accent text-brand-neon border-brand-neon/30'
                    : 'bg-brand-dark/30 text-gray-500 border-gray-900 hover:text-gray-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Class Slots Grid */}
      {loading && scheduleSlots.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-10" aria-busy="true">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="glass-card p-6 rounded-xl h-80 animate-pulse space-y-4">
              <div className="w-1/3 h-5 bg-gray-800 rounded" />
              <div className="w-2/3 h-7 bg-gray-800 rounded" />
              <div className="w-full h-16 bg-gray-800 rounded" />
              <div className="space-y-2 pt-4">
                <div className="w-3/4 h-4 bg-gray-800 rounded" />
                <div className="w-1/2 h-4 bg-gray-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredSlots.length === 0 ? (
        <div className="glass-card p-12 rounded-2xl text-center max-w-xl mx-auto space-y-4 border border-gray-900">
          <Calendar className="h-10 w-10 text-gray-600 mx-auto" />
          <h3 className="text-lg font-bold text-white uppercase tracking-wider">No Classes Scheduled</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            There are no {selectedCategory !== 'All' ? `${selectedCategory} ` : ''}classes available for {getDayLabel(selectedDayOffset).toLowerCase()}. Please select another day or clear filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSlots.map((slot) => (
            <ClassCard
              key={slot.id}
              slot={slot}
              isBooked={isSlotBooked(slot.id)}
              onBook={handleBookClick}
              onCancel={handleCancelBooking}
              isAuthenticated={!!user}
              onOpenAuth={onOpenAuth}
            />
          ))}
        </div>
      )}

      {/* Booking Confirmation Dialog */}
      <BookingModal
        slot={activeSlotForBooking}
        isOpen={activeSlotForBooking !== null}
        onClose={() => setActiveSlotForBooking(null)}
        onConfirm={handleConfirmBooking}
        isLoading={bookingLoading}
      />
    </div>
  );
};

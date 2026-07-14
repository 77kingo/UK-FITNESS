import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useBookingStore } from '../store/bookingStore';
import { Calendar, Clock, MapPin, Trash2, Award, UserCheck, Shield } from 'lucide-react';
import { Button } from '../components/common/Button';

export const MemberProfile: React.FC = () => {
  const { user } = useAuthStore();
  const { userBookings, loading, error, fetchUserBookings, cancelBooking } = useBookingStore();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserBookings(user.id);
    }
  }, [user, fetchUserBookings]);

  if (!user) return null;

  const handleCancelBooking = async (bookingId: string, className: string) => {
    if (window.confirm(`Are you sure you want to cancel your spot in ${className}?`)) {
      setCancellingId(bookingId);
      await cancelBooking(bookingId);
      setCancellingId(null);
    }
  };

  const formatFullDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  // Mock active subscription details for MVP profile completeness
  const mockSubscription = {
    tier: user.role === 'admin' ? 'Elite Admin Package' : 'Premium Athlete Tier',
    status: 'Active',
    renewalDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB'),
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Page Header */}
      <section className="border-b border-gray-900 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-brand-neon text-sm font-extrabold uppercase tracking-widest">MEMBER HUB</span>
          <h1 className="text-4xl font-extrabold text-white mt-1 uppercase tracking-tight">MY DASHBOARD</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your active bookings, schedules, and subscription package details.</p>
        </div>
        <div className="flex items-center gap-4 bg-brand-accent/40 border border-gray-800 p-4 rounded-xl">
          <div className="bg-brand-neon/15 p-2 rounded-lg">
            <UserCheck className="h-6 w-6 text-brand-neon" />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Account Status</div>
            <div className="text-white font-bold text-sm flex items-center gap-1.5 mt-0.5">
              <span>{user.fullName}</span>
              <span className="text-xs font-black uppercase text-brand-neon px-2 py-0.5 bg-brand-neon/10 border border-brand-neon/20 rounded">
                {user.role}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Layout: Left column active bookings, Right column subscription metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Active Bookings */}
        <section className="lg:col-span-2 space-y-6" aria-labelledby="active-bookings-heading">
          <div className="flex items-center justify-between">
            <h2 id="active-bookings-heading" className="text-xl font-bold text-white uppercase tracking-wider">
              My Active Bookings
            </h2>
            <span className="text-xs bg-brand-accent text-gray-400 font-bold px-2.5 py-1 rounded">
              {userBookings.length} Booked
            </span>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {loading && userBookings.length === 0 ? (
            <div className="space-y-4">
              {[1, 2].map((idx) => (
                <div key={idx} className="glass-card p-6 rounded-xl animate-pulse flex justify-between h-24">
                  <div className="w-1/2 bg-gray-800 h-6 rounded" />
                  <div className="w-20 bg-gray-800 h-8 rounded" />
                </div>
              ))}
            </div>
          ) : userBookings.length === 0 ? (
            <div className="glass-card p-10 text-center rounded-xl border border-gray-900 space-y-4">
              <Calendar className="h-8 w-8 text-gray-600 mx-auto" />
              <h3 className="text-white font-semibold uppercase tracking-wider text-sm">No Bookings Found</h3>
              <p className="text-gray-400 text-xs max-w-sm mx-auto leading-relaxed">
                You haven't reserved any spots for upcoming fitness sessions yet. View the schedule to register.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {userBookings.map((booking) => {
                const slot = booking.scheduleSlot;
                if (!slot || !slot.classType) return null;
                const isCancelling = cancellingId === booking.id;

                return (
                  <article
                    key={booking.id}
                    className="glass-card p-5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-gray-800 transition-colors"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase font-extrabold tracking-wider bg-brand-neon/10 text-brand-neon border border-brand-neon/15 px-2.5 py-0.5 rounded-full">
                          {slot.classType.category}
                        </span>
                        <h3 className="font-bold text-white text-lg">{slot.classType.name}</h3>
                      </div>

                      {/* Info grid */}
                      <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-brand-neon" />
                          <span>{formatFullDate(slot.startTime)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-brand-neon" />
                          <span>{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</span>
                        </div>
                        {slot.roomNumber && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-brand-neon" />
                            <span>{slot.roomNumber}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleCancelBooking(booking.id, slot.classType?.name || 'Class')}
                      disabled={isCancelling}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 border border-gray-800 hover:border-red-500/20 px-4 py-2 rounded-md text-xs font-bold transition-all"
                      aria-label={`Cancel booking for ${slot.classType.name}`}
                    >
                      {isCancelling ? (
                        <span>Cancelling...</span>
                      ) : (
                        <>
                          <Trash2 className="h-3.5 w-3.5 shrink-0" />
                          <span>Cancel Spot</span>
                        </>
                      )}
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Right Column: Membership Summary Info */}
        <section className="space-y-6" aria-labelledby="subscription-heading">
          <h2 id="subscription-heading" className="text-xl font-bold text-white uppercase tracking-wider">
            Membership Plan
          </h2>

          <div className="glass-card p-6 rounded-xl border border-gray-800 space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-brand-neon/15 p-2 rounded-lg shrink-0 border border-brand-neon/10">
                <Award className="h-6 w-6 text-brand-neon" />
              </div>
              <div className="space-y-1">
                <h3 className="text-white font-bold text-base leading-tight uppercase">
                  {mockSubscription.tier}
                </h3>
                <p className="text-gray-400 text-xs">
                  Full Club access with premium features.
                </p>
              </div>
            </div>

            <div className="border-t border-gray-900 pt-4 space-y-3.5 text-sm text-gray-300">
              <div className="flex justify-between">
                <span className="text-gray-500">Plan Status</span>
                <span className="text-brand-neon font-black uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-neon animate-pulse" />
                  {mockSubscription.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Renewal Date</span>
                <span className="text-white font-bold">{mockSubscription.renewalDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Method</span>
                <span className="text-white font-medium">Stripe (•••• 4242)</span>
              </div>
            </div>

            {/* Manage plan placeholder action button */}
            <div className="pt-2">
              <Button
                variant="outline"
                className="w-full text-xs font-bold uppercase tracking-wider"
                onClick={() => alert('Billing portal portal simulated. Stripe billing integration is scheduled for Phase 3.')}
              >
                Manage Subscription
              </Button>
            </div>
          </div>

          {/* Quick FAQ accessibility compliance */}
          <div className="bg-brand-accent/20 border border-gray-900 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-brand-neon shrink-0" />
              <h4 className="text-white text-xs font-bold uppercase tracking-wider">Account Policies</h4>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              If you miss 3 scheduled classes without cancelling in advance, your booking privileges may be suspended for 7 days to ensure fair club occupancy.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

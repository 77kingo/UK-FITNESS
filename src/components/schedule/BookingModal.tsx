import React, { useEffect, useRef } from 'react';
import { X, Calendar, Clock, User, ShieldAlert } from 'lucide-react';
import { ScheduleSlot } from '../../types';
import { Button } from '../common/Button';

interface BookingModalProps {
  slot: ScheduleSlot | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  slot,
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal on escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      // Accessibility focus trap: focus the modal container or the close button
      modalRef.current?.focus();
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !slot || !slot.classType) return null;

  const { classType, startTime, endTime, trainerName } = slot;

  const formatFullDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      {/* Background Overlay click to close */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Content */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className="glass-card relative max-w-md w-full bg-brand-card rounded-2xl border border-gray-800 p-6 md:p-8 shadow-2xl focus:outline-none"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-md hover:bg-white/5 transition-colors focus:ring-2 focus:ring-brand-neon"
          aria-label="Close booking modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <span className="text-xs uppercase font-extrabold tracking-wider text-brand-neon bg-brand-neon/10 border border-brand-neon/20 px-2.5 py-1 rounded-full">
            Confirm Booking
          </span>
          <h2 id="booking-modal-title" className="text-2xl font-extrabold text-white mt-3">
            {classType.name}
          </h2>
        </div>

        {/* Details Grid */}
        <div className="space-y-4 mb-6 text-sm text-gray-300">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-brand-neon shrink-0" />
            <span>{formatFullDate(startTime)}</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-brand-neon shrink-0" />
            <span>{formatTime(startTime)} - {formatTime(endTime)} ({classType.durationMinutes} minutes)</span>
          </div>
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-brand-neon shrink-0" />
            <span>Led by Coach {trainerName || 'Elite Personal'}</span>
          </div>
        </div>

        {/* Terms/Cancellation Policy Notice */}
        <div className="bg-brand-accent/50 border border-gray-800 rounded-lg p-4 mb-8 flex gap-3 text-xs leading-relaxed text-gray-400">
          <ShieldAlert className="h-5 w-5 text-brand-neon shrink-0" />
          <p>
            Please note our <strong>12-hour cancellation policy</strong>. Cancellations made within 12 hours of the class start time will count as a late cancellation.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isLoading}
          >
            Go Back
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            className="flex-1"
            isLoading={isLoading}
          >
            Confirm Spot
          </Button>
        </div>
      </div>
    </div>
  );
};

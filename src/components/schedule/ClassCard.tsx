import React from 'react';
import { Clock, User, Users, MapPin, CheckCircle2 } from 'lucide-react';
import { ScheduleSlot } from '../../types';

interface ClassCardProps {
  slot: ScheduleSlot;
  isBooked: boolean;
  onBook: (slot: ScheduleSlot) => void;
  onCancel: (slot: ScheduleSlot) => void;
  isAuthenticated: boolean;
  onOpenAuth: () => void;
}

export const ClassCard: React.FC<ClassCardProps> = ({
  slot,
  isBooked,
  onBook,
  onCancel,
  isAuthenticated,
  onOpenAuth,
}) => {
  const { classType, startTime, endTime, roomNumber, currentOccupancy, trainerName } = slot;
  
  if (!classType) return null;

  const isFull = currentOccupancy >= classType.capacity;
  
  // Format times nicely (e.g. 18:30 - 19:30)
  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'hiit':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'yoga':
        return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
      case 'strength':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      default:
        return 'bg-brand-neon/10 text-brand-neon border-brand-neon/20';
    }
  };

  return (
    <article 
      className={`glass-card p-6 rounded-xl flex flex-col justify-between h-full transition-all duration-300 ${
        isBooked ? 'border-brand-neon/40 shadow-neon-glow/10' : ''
      }`}
      aria-labelledby={`slot-title-${slot.id}`}
    >
      <div>
        {/* Header: Category Badge & Capacity */}
        <div className="flex justify-between items-start mb-4">
          <span className={`text-xs uppercase font-extrabold tracking-wider border px-2.5 py-1 rounded-full ${getCategoryColor(classType.category)}`}>
            {classType.category}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-gray-400" aria-label={`Capacity: ${currentOccupancy} out of ${classType.capacity} booked`}>
            <Users className="h-3.5 w-3.5" />
            <span>{currentOccupancy} / {classType.capacity}</span>
          </div>
        </div>

        {/* Title */}
        <h3 id={`slot-title-${slot.id}`} className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-brand-neon transition-colors duration-300">
          {classType.name}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-sm mb-5 line-clamp-2 leading-relaxed">
          {classType.description}
        </p>

        {/* Meta Info */}
        <div className="space-y-2.5 mb-6 text-sm text-gray-300">
          <div className="flex items-center gap-2.5">
            <Clock className="h-4 w-4 text-brand-neon" />
            <time dateTime={startTime}>
              {formatTime(startTime)} - {formatTime(endTime)} ({classType.durationMinutes} mins)
            </time>
          </div>
          <div className="flex items-center gap-2.5">
            <User className="h-4 w-4 text-brand-neon" />
            <span>Trainer: {trainerName || 'Elite Coach'}</span>
          </div>
          {roomNumber && (
            <div className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 text-brand-neon" />
              <span>Studio Room: {roomNumber}</span>
            </div>
          )}
        </div>
      </div>

      {/* Booking CTA Button */}
      <div className="pt-4 border-t border-gray-900">
        {!isAuthenticated ? (
          <button
            onClick={onOpenAuth}
            className="w-full bg-brand-accent text-white hover:bg-brand-neon hover:text-brand-dark px-4 py-2.5 rounded-md font-bold text-sm tracking-wide transition-all duration-300 focus:ring-2 focus:ring-brand-neon focus:ring-offset-2 focus:ring-offset-brand-dark"
          >
            Sign In to Book
          </button>
        ) : isBooked ? (
          <button
            onClick={() => onCancel(slot)}
            className="w-full bg-brand-neon/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 text-brand-neon border border-brand-neon/30 px-4 py-2.5 rounded-md font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-neon group-hover:text-red-400" />
            <span className="group-hover:hidden">Booked</span>
            <span className="hidden group-hover:inline">Cancel Booking</span>
          </button>
        ) : (
          <button
            onClick={() => onBook(slot)}
            disabled={isFull}
            className={`w-full px-4 py-2.5 rounded-md font-bold text-sm tracking-wide transition-all duration-300 focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark ${
              isFull
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700/50'
                : 'bg-brand-neon text-brand-dark hover:shadow-neon-glow hover:scale-[1.01] active:scale-[0.99] focus:ring-brand-neon'
            }`}
          >
            {isFull ? 'Fully Booked' : 'Book Class'}
          </button>
        )}
      </div>
    </article>
  );
};

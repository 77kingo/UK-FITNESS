import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Flame, Coffee, Zap, Users } from 'lucide-react';
import { useBookingStore } from '../../store/bookingStore';

export const GymVibeMeter: React.FC = () => {
  const { scheduleSlots } = useBookingStore();

  // Simple heuristic based on scheduled slots today and current occupancy
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const todayEnd = todayStart + 24 * 60 * 60 * 1000;

  const todaySlots = scheduleSlots.filter((s) => {
    const time = new Date(s.startTime).getTime();
    return time >= todayStart && time <= todayEnd;
  });

  const activeNowSlots = todaySlots.filter((s) => {
    const start = new Date(s.startTime).getTime();
    const end = new Date(s.endTime).getTime();
    // expanding the "active" window by 30 mins before and after for calculation
    return now.getTime() >= start - 30 * 60000 && now.getTime() <= end + 30 * 60000;
  });

  const totalOccupancy = activeNowSlots.reduce((acc, curr) => acc + curr.currentOccupancy, 0);
  const totalCapacity = activeNowSlots.reduce((acc, curr) => acc + (curr.classType?.capacity || 0), 0);
  
  // Default to a low/chill vibe if no classes active right now
  let fillPct = 15;
  if (totalCapacity > 0) {
    fillPct = Math.min(100, Math.max(15, Math.round((totalOccupancy / totalCapacity) * 100)));
  } else {
    // If no classes, base it vaguely on time of day (fake baseline busyness)
    const hour = now.getHours();
    if (hour >= 17 && hour <= 20) fillPct = 75; // evening rush
    else if (hour >= 6 && hour <= 9) fillPct = 65; // morning rush
    else if (hour >= 11 && hour <= 14) fillPct = 40; // lunch
    else fillPct = 20; // quiet
  }

  // Determine Vibe details
  let vibeConfig = {
    label: 'Chill & Quiet',
    desc: 'Plenty of space. Great time for a focused, uninterrupted session.',
    icon: <Coffee className="h-8 w-8 text-amber-400" />,
    color: 'from-amber-400 to-yellow-500',
    textColor: 'text-amber-400'
  };

  if (fillPct >= 80) {
    vibeConfig = {
      label: 'Peak Energy',
      desc: 'The gym is buzzing! High energy, loud music, full classes.',
      icon: <Flame className="h-8 w-8 text-orange-500" />,
      color: 'from-orange-500 to-red-500',
      textColor: 'text-orange-500'
    };
  } else if (fillPct >= 45) {
    vibeConfig = {
      label: 'Steady Flow',
      desc: 'Good energy, moderate crowd. Machines are cycling nicely.',
      icon: <Zap className="h-8 w-8 text-brand-neon" />,
      color: 'from-brand-neon to-emerald-400',
      textColor: 'text-brand-neon'
    };
  }

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-sm font-black text-gray-400 tracking-widest uppercase flex items-center gap-2">
            <Activity className="h-4 w-4" /> Live Gym Vibe
          </h2>
        </div>
        <div className="flex items-center gap-2 bg-brand-dark border border-gray-800 px-3 py-1.5 rounded-full text-xs font-bold text-gray-400">
          <div className={`w-2 h-2 rounded-full ${vibeConfig.textColor} animate-pulse bg-current`} />
          Live
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Visual Gauge (Half Donut) */}
        <div className="relative w-48 h-24 overflow-hidden shrink-0">
          {/* Background Arc */}
          <div className="absolute top-0 left-0 w-48 h-48 rounded-full border-[16px] border-gray-900 border-b-transparent border-r-transparent transform -rotate-45" />
          {/* Active Arc */}
          <motion.div 
            className={`absolute top-0 left-0 w-48 h-48 rounded-full border-[16px] border-b-transparent border-r-transparent transform -rotate-45`}
            style={{ 
              borderColor: 'currentColor', 
              color: fillPct >= 80 ? '#f97316' : fillPct >= 45 ? '#ccff00' : '#fbbf24' 
            }}
            initial={{ rotate: -225 }} // -225 is 0% (hidden behind mask)
            animate={{ rotate: -225 + (fillPct / 100) * 180 }} // full is -45
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <div className="absolute bottom-0 left-0 w-full flex flex-col items-center justify-end pb-1">
            <div className="bg-brand-dark/50 p-2 rounded-full mb-1">
              {vibeConfig.icon}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left space-y-2">
          <h3 className={`text-2xl font-black uppercase tracking-wide ${vibeConfig.textColor}`}>
            {vibeConfig.label}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            {vibeConfig.desc}
          </p>
          <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
              <Users className="h-4 w-4 text-gray-600" />
              <span>Current Capacity: {fillPct}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

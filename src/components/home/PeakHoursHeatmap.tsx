import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingDown } from 'lucide-react';

interface HourData {
  time: string;
  occupancy: number; // 0 to 100
  label: string;
}

const WEEK_DATA: Record<string, HourData[]> = {
  Mon: [
    { time: '06:00', occupancy: 35, label: 'Early Flow' },
    { time: '08:00', occupancy: 65, label: 'Morning Rush' },
    { time: '10:00', occupancy: 40, label: 'Chill & Open' },
    { time: '12:00', occupancy: 50, label: 'Lunch Cardio' },
    { time: '14:00', occupancy: 30, label: 'Optimal Time' },
    { time: '16:00', occupancy: 55, label: 'Pre-Peak' },
    { time: '18:00', occupancy: 92, label: 'Peak PR Hour' },
    { time: '20:00', occupancy: 70, label: 'Evening Crew' },
  ],
  Tue: [
    { time: '06:00', occupancy: 30, label: 'Early Flow' },
    { time: '08:00', occupancy: 60, label: 'Morning Rush' },
    { time: '10:00', occupancy: 35, label: 'Chill & Open' },
    { time: '12:00', occupancy: 45, label: 'Lunch Cardio' },
    { time: '14:00', occupancy: 28, label: 'Optimal Time' },
    { time: '16:00', occupancy: 58, label: 'Pre-Peak' },
    { time: '18:00', occupancy: 88, label: 'Peak PR Hour' },
    { time: '20:00', occupancy: 65, label: 'Evening Crew' },
  ],
  Wed: [
    { time: '06:00', occupancy: 38, label: 'Early Flow' },
    { time: '08:00', occupancy: 70, label: 'Morning Rush' },
    { time: '10:00', occupancy: 42, label: 'Chill & Open' },
    { time: '12:00', occupancy: 52, label: 'Lunch Cardio' },
    { time: '14:00', occupancy: 32, label: 'Optimal Time' },
    { time: '16:00', occupancy: 60, label: 'Pre-Peak' },
    { time: '18:00', occupancy: 95, label: 'Peak PR Hour' },
    { time: '20:00', occupancy: 72, label: 'Evening Crew' },
  ],
  Thu: [
    { time: '06:00', occupancy: 32, label: 'Early Flow' },
    { time: '08:00', occupancy: 62, label: 'Morning Rush' },
    { time: '10:00', occupancy: 38, label: 'Chill & Open' },
    { time: '12:00', occupancy: 48, label: 'Lunch Cardio' },
    { time: '14:00', occupancy: 26, label: 'Optimal Time' },
    { time: '16:00', occupancy: 56, label: 'Pre-Peak' },
    { time: '18:00', occupancy: 86, label: 'Peak PR Hour' },
    { time: '20:00', occupancy: 62, label: 'Evening Crew' },
  ],
  Fri: [
    { time: '06:00', occupancy: 36, label: 'Early Flow' },
    { time: '08:00', occupancy: 68, label: 'Morning Rush' },
    { time: '10:00', occupancy: 40, label: 'Chill & Open' },
    { time: '12:00', occupancy: 54, label: 'Lunch Cardio' },
    { time: '14:00', occupancy: 34, label: 'Optimal Time' },
    { time: '16:00', occupancy: 65, label: 'Pre-Peak' },
    { time: '18:00', occupancy: 90, label: 'Peak PR Hour' },
    { time: '20:00', occupancy: 55, label: 'Weekend Starter' },
  ],
  Sun: [
    { time: '08:00', occupancy: 25, label: 'Recovery Morning' },
    { time: '10:00', occupancy: 48, label: 'Sunday Circuit' },
    { time: '12:00', occupancy: 60, label: 'Midday Lift' },
    { time: '14:00', occupancy: 42, label: 'Chill Flow' },
    { time: '16:00', occupancy: 35, label: 'Sauna & Plunge' },
    { time: '17:30', occupancy: 20, label: 'Closing Prep' },
  ],
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sun'];

export const PeakHoursHeatmap: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState('Mon');
  const [hoveredHour, setHoveredHour] = useState<HourData | null>(null);

  const hours = WEEK_DATA[selectedDay] || WEEK_DATA.Mon;
  const lowestHour = hours.reduce((prev, curr) => (curr.occupancy < prev.occupancy ? curr : prev), hours[0]);

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-6 relative overflow-hidden bg-brand-dark/90">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-4 w-4 text-brand-neon" />
            <h3 className="text-white font-black text-lg uppercase tracking-tight">Live Gym Crowd & Peak Tracker</h3>
          </div>
          <p className="text-xs text-gray-400">Plan your session to beat the crowd and secure open squat platforms.</p>
        </div>

        {/* Days Selector */}
        <div className="flex bg-black/50 p-1 rounded-xl border border-gray-800">
          {DAYS.map((d) => (
            <button
              key={d}
              onClick={() => {
                setSelectedDay(d);
                setHoveredHour(null);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedDay === d
                  ? 'bg-brand-neon text-brand-dark shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Heatmap Bar Chart */}
      <div className="p-6 bg-black/40 rounded-2xl border border-gray-800/80 space-y-4">
        <div className="flex items-end justify-between gap-2 sm:gap-4 h-36 pt-6">
          {hours.map((h, idx) => {
            const isPeak = h.occupancy >= 80;
            const isMedium = h.occupancy >= 50 && h.occupancy < 80;
            const barColor = isPeak
              ? 'bg-red-500 hover:bg-red-400'
              : isMedium
              ? 'bg-yellow-400 hover:bg-yellow-300'
              : 'bg-brand-neon hover:brightness-110';

            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer"
                onMouseEnter={() => setHoveredHour(h)}
                onMouseLeave={() => setHoveredHour(null)}
              >
                <div className="relative w-full flex items-end justify-center h-full">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${h.occupancy}%` }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    className={`w-full max-w-[28px] rounded-t-lg transition-colors ${barColor}`}
                  />
                </div>
                <span className="text-[10px] text-gray-500 font-bold group-hover:text-white transition-colors">
                  {h.time}
                </span>
              </div>
            );
          })}
        </div>

        {/* Dynamic Footer with Recommendation */}
        <div className="pt-4 border-t border-gray-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand-neon animate-pulse" />
            <span className="text-gray-300">
              {hoveredHour ? (
                <span>
                  <strong>{hoveredHour.time}</strong> • Occupancy: <strong className="text-brand-neon">{hoveredHour.occupancy}%</strong> ({hoveredHour.label})
                </span>
              ) : (
                <span>Hover over any hour to inspect crowd density</span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-brand-neon bg-brand-neon/10 px-3 py-1 rounded-full border border-brand-neon/20 font-bold">
            <TrendingDown className="h-3.5 w-3.5" />
            <span>Best Window Today: {lowestHour.time} ({lowestHour.occupancy}% chill)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { Music, Instagram, Twitter, ShieldCheck } from 'lucide-react';

interface TrainerCardProps {
  name: string;
  role: string;
  imageColor: string; // Tailwind color class for the placeholder gradient
  stats: {
    strength: number;
    agility: number;
    endurance: number;
    mobility: number;
    motivation: number;
  };
  playlistVibe: string;
  onBookPT?: () => void;
}

export const TrainerCard: React.FC<TrainerCardProps> = ({ name, role, imageColor, stats, playlistVibe, onBookPT }) => {
  // SVG Radar Chart Logic
  const size = 120;
  const center = size / 2;
  const maxRadius = 45;
  const statValues = [stats.strength, stats.agility, stats.endurance, stats.mobility, stats.motivation];
  const totalStats = statValues.length;

  const getPoint = (value: number, index: number, total: number) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const r = (value / 100) * maxRadius;
    return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
  };

  const polygonPoints = statValues.map((val, i) => getPoint(val, i, totalStats)).join(' ');
  const outerPolygonPoints = statValues.map((_, i) => getPoint(100, i, totalStats)).join(' ');

  const labels = ['STR', 'AGI', 'END', 'MOB', 'MOT'];

  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      className="glass-card rounded-3xl border border-gray-800 overflow-hidden relative group"
    >
      {/* Background Gradient Image Placeholder */}
      <div className={`h-48 w-full bg-gradient-to-br ${imageColor} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20" />
        {/* Mock character silhouette */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-56 bg-black/40 rounded-t-[100px] blur-xl" />
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black tracking-widest text-white uppercase border border-white/10 flex items-center gap-1">
          <ShieldCheck className="h-3 w-3 text-brand-neon" />
          Elite
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-black text-white uppercase tracking-tight">{name}</h3>
        <p className="text-brand-neon text-sm font-bold uppercase tracking-widest mb-6">{role}</p>

        {/* Gamified Stats Radar */}
        <div className="flex items-center gap-6 mb-6">
          <div className="relative w-[120px] h-[120px] shrink-0">
            <svg width={size} height={size} className="overflow-visible">
              {/* Grid polygon */}
              <polygon points={outerPolygonPoints} fill="none" stroke="#374151" strokeWidth="1" />
              {/* Inner connecting lines */}
              {statValues.map((_, i) => (
                <line 
                  key={i}
                  x1={center} 
                  y1={center} 
                  x2={center + maxRadius * Math.cos((Math.PI * 2 * i) / totalStats - Math.PI / 2)} 
                  y2={center + maxRadius * Math.sin((Math.PI * 2 * i) / totalStats - Math.PI / 2)} 
                  stroke="#374151" 
                  strokeWidth="1" 
                />
              ))}
              {/* Actual Stats Polygon */}
              <motion.polygon 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                points={polygonPoints} 
                fill="#ccff00" 
                fillOpacity="0.2" 
                stroke="#ccff00" 
                strokeWidth="2" 
                style={{ transformOrigin: 'center' }}
              />
              {/* Labels */}
              {labels.map((lbl, i) => {
                const angle = (Math.PI * 2 * i) / totalStats - Math.PI / 2;
                const r = maxRadius + 15;
                const x = center + r * Math.cos(angle);
                const y = center + r * Math.sin(angle);
                return (
                  <text key={lbl} x={x} y={y} fill="#9ca3af" fontSize="10" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">
                    {lbl}
                  </text>
                );
              })}
            </svg>
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Top Stat</p>
              <p className="text-white text-sm font-bold">
                {labels[statValues.indexOf(Math.max(...statValues))]} ({Math.max(...statValues)})
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Vibe Playlist</p>
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-300">
                <Music className="h-3.5 w-3.5 text-brand-neon" />
                {playlistVibe}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
          <div className="flex gap-3">
            <Instagram className="h-4 w-4 text-gray-500 hover:text-white cursor-pointer transition-colors" />
            <Twitter className="h-4 w-4 text-gray-500 hover:text-white cursor-pointer transition-colors" />
          </div>
          <button
            onClick={onBookPT}
            className="text-xs font-bold uppercase tracking-wider text-brand-neon hover:text-white transition-colors"
          >
            Book PT Session →
          </button>
        </div>
      </div>
    </motion.div>
  );
};

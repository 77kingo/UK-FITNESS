import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Flame, ShieldCheck, Sparkles } from 'lucide-react';
import { FitnessCalculator } from '../components/tools/FitnessCalculator';
import { QuickWorkoutWOD } from '../components/tools/QuickWorkoutWOD';
import { HoloMemberPass } from '../components/tools/HoloMemberPass';
import { useAuthStore } from '../store/authStore';

export const FitnessHub: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'calculator' | 'wod' | 'pass'>('calculator');

  const tabs = [
    { id: 'calculator', label: 'TDEE & Macros', icon: <Calculator className="h-4 w-4" />, desc: 'Diet & Calorie Target' },
    { id: 'wod', label: 'WOD Interval Timer', icon: <Flame className="h-4 w-4" />, desc: 'HIIT & Circuit Timer' },
    { id: 'pass', label: '3D VIP Pass', icon: <ShieldCheck className="h-4 w-4" />, desc: 'Digital Holographic Badge' },
  ];

  return (
    <div className="py-16 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      {/* Header */}
      <section className="max-w-4xl mx-auto text-center space-y-4">
        <span className="inline-flex items-center gap-2 bg-brand-neon/10 border border-brand-neon/20 px-3.5 py-1.5 rounded-full text-brand-neon font-black text-xs uppercase tracking-widest">
          <Sparkles className="h-4 w-4" />
          <span>UK Fitness Athlete Matrix</span>
        </span>
        <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight">
          INTERACTIVE <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-neon via-lime-300 to-emerald-400">FITNESS SUITE</span>
        </h1>
        <p className="text-gray-400 text-base sm:text-lg leading-relaxed font-medium">
          Access high-performance athletic calculators, real-time HIIT workout interval timers, and custom 3D keyless access passes.
        </p>

        {/* Tab Switcher Pills */}
        <div className="flex flex-wrap justify-center gap-3 pt-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all border ${
                activeTab === tab.id
                  ? 'bg-brand-neon text-brand-dark border-brand-neon shadow-neon-glow scale-105'
                  : 'bg-brand-dark/80 text-gray-400 border-gray-800 hover:text-white hover:border-gray-700'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Active Tab Component */}
      <section>
        {activeTab === 'calculator' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <FitnessCalculator />
          </motion.div>
        )}

        {activeTab === 'wod' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <QuickWorkoutWOD />
          </motion.div>
        )}

        {activeTab === 'pass' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <HoloMemberPass initialName={user?.fullName || 'Apex Athlete'} />
          </motion.div>
        )}
      </section>
    </div>
  );
};

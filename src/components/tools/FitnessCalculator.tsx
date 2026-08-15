import React, { useState } from 'react';
import { Calculator, Sparkles, Droplets } from 'lucide-react';

export const FitnessCalculator: React.FC = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(25);
  const [weightKg, setWeightKg] = useState<number>(70);
  const [heightCm, setHeightCm] = useState<number>(175);
  const [activity, setActivity] = useState<number>(1.55); // Moderately active
  const [goal, setGoal] = useState<'fat_loss' | 'maintenance' | 'muscle_gain'>('fat_loss');

  // Calculations
  const bmr = Math.round(
    gender === 'male'
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161
  );

  const tdee = Math.round(bmr * activity);

  const goalCalories = Math.round(
    goal === 'fat_loss'
      ? tdee - 500
      : goal === 'muscle_gain'
      ? tdee + 350
      : tdee
  );

  // Macros calculation
  const proteinGrams = Math.round(weightKg * 2.2); // 2.2g per kg
  const proteinKcal = proteinGrams * 4;
  const fatKcal = Math.round(goalCalories * 0.25); // 25% of calories
  const fatGrams = Math.round(fatKcal / 9);
  const carbKcal = Math.max(0, goalCalories - (proteinKcal + fatKcal));
  const carbGrams = Math.round(carbKcal / 4);

  // Hydration calculation
  const waterLiters = (weightKg * 0.035 + 0.5).toFixed(1);

  return (
    <div className="glass-card rounded-3xl p-6 md:p-10 border border-gray-800 relative overflow-hidden max-w-5xl mx-auto w-full">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-neon/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <div className="inline-flex items-center gap-2 bg-brand-neon/10 border border-brand-neon/20 px-3.5 py-1.5 rounded-full text-brand-neon font-extrabold text-xs uppercase tracking-widest">
          <Calculator className="h-4 w-4" />
          <span>Interactive Fitness Tool</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-tight">TDEE & Macro Calculator</h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          Calculate your Total Daily Energy Expenditure (TDEE), target calories, macro split, and daily water goals.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* INPUTS COLUMN */}
        <div className="lg:col-span-6 space-y-6 bg-brand-dark/60 p-6 rounded-2xl border border-gray-800">
          <h3 className="text-white font-black text-sm uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-neon" />
            1. Your Metrics
          </h3>

          {/* Gender */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Gender</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`py-2.5 rounded-xl border text-xs font-bold uppercase transition-all ${
                  gender === 'male' ? 'bg-brand-neon text-brand-dark border-brand-neon font-black' : 'bg-gray-900 text-gray-400 border-gray-800 hover:text-white'
                }`}
              >
                Male ♂
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`py-2.5 rounded-xl border text-xs font-bold uppercase transition-all ${
                  gender === 'female' ? 'bg-brand-neon text-brand-dark border-brand-neon font-black' : 'bg-gray-900 text-gray-400 border-gray-800 hover:text-white'
                }`}
              >
                Female ♀
              </button>
            </div>
          </div>

          {/* Inputs Row */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Math.max(12, Math.min(90, Number(e.target.value))))}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-sm text-white font-bold text-center focus:border-brand-neon focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Weight (kg)</label>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(Math.max(30, Math.min(250, Number(e.target.value))))}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-sm text-white font-bold text-center focus:border-brand-neon focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Height (cm)</label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(Math.max(100, Math.min(230, Number(e.target.value))))}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-sm text-white font-bold text-center focus:border-brand-neon focus:outline-none"
              />
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Activity Level</label>
            <select
              value={activity}
              onChange={(e) => setActivity(Number(e.target.value))}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white font-bold focus:border-brand-neon focus:outline-none"
            >
              <option value={1.2}>Sedentary (Little or no exercise)</option>
              <option value={1.375}>Lightly Active (1–3 workouts/week)</option>
              <option value={1.55}>Moderately Active (3–5 workouts/week)</option>
              <option value={1.725}>Very Active (6–7 intense workouts/week)</option>
              <option value={1.9}>Extra Active (Athlete / physical job)</option>
            </select>
          </div>

          {/* Fitness Goal */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Primary Goal</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'fat_loss', label: 'Fat Loss', desc: '-500 kcal' },
                { id: 'maintenance', label: 'Maintain', desc: 'Baseline' },
                { id: 'muscle_gain', label: 'Build Muscle', desc: '+350 kcal' },
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGoal(g.id as any)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    goal === g.id
                      ? 'bg-brand-neon/15 border-brand-neon text-brand-neon shadow-neon-glow'
                      : 'bg-gray-900 text-gray-400 border-gray-800 hover:text-white'
                  }`}
                >
                  <span className="block text-xs font-black uppercase">{g.label}</span>
                  <span className="block text-[10px] opacity-70 mt-0.5">{g.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RESULTS COLUMN */}
        <div className="lg:col-span-6 space-y-6">
          {/* Main Calorie Summary Card */}
          <div className="glass-card p-6 rounded-2xl border border-brand-neon/20 bg-brand-neon/5 space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-brand-neon uppercase tracking-widest">Recommended Daily Target</span>
              <span className="text-xs text-gray-400 font-bold">BMR: {bmr} kcal</span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-white">{goalCalories.toLocaleString()}</span>
              <span className="text-lg font-bold text-brand-neon uppercase">kcal / day</span>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              Your estimated maintenance (TDEE) is <strong className="text-white">{tdee.toLocaleString()} kcal</strong>. Adjusted for your <strong className="text-brand-neon">{goal.replace('_', ' ')}</strong> goal.
            </p>
          </div>

          {/* Macro Breakdown */}
          <div className="glass-card p-6 rounded-2xl border border-gray-800 space-y-4">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center justify-between">
              <span>Daily Macro Split</span>
              <span className="text-gray-500 font-bold">100% Target</span>
            </h4>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-brand-dark/70 border border-blue-500/20 p-3 rounded-xl text-center">
                <span className="text-[10px] text-blue-400 font-bold uppercase block">Protein</span>
                <span className="text-xl font-black text-white">{proteinGrams}g</span>
                <span className="text-[10px] text-gray-500 block mt-0.5">{proteinKcal} kcal</span>
              </div>
              <div className="bg-brand-dark/70 border border-amber-500/20 p-3 rounded-xl text-center">
                <span className="text-[10px] text-amber-400 font-bold uppercase block">Carbs</span>
                <span className="text-xl font-black text-white">{carbGrams}g</span>
                <span className="text-[10px] text-gray-500 block mt-0.5">{carbKcal} kcal</span>
              </div>
              <div className="bg-brand-dark/70 border border-rose-500/20 p-3 rounded-xl text-center">
                <span className="text-[10px] text-rose-400 font-bold uppercase block">Fats</span>
                <span className="text-xl font-black text-white">{fatGrams}g</span>
                <span className="text-[10px] text-gray-500 block mt-0.5">{fatKcal} kcal</span>
              </div>
            </div>

            {/* Visual Macro Bar */}
            <div className="w-full bg-gray-900 rounded-full h-3 flex overflow-hidden">
              <div style={{ width: `${Math.round((proteinKcal / goalCalories) * 100)}%` }} className="bg-blue-500 h-full" title="Protein" />
              <div style={{ width: `${Math.round((carbKcal / goalCalories) * 100)}%` }} className="bg-amber-400 h-full" title="Carbs" />
              <div style={{ width: `${Math.round((fatKcal / goalCalories) * 100)}%` }} className="bg-rose-500 h-full" title="Fats" />
            </div>
          </div>

          {/* Hydration Goal Card */}
          <div className="glass-card p-4 rounded-2xl border border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Droplets className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block uppercase">Recommended Hydration</span>
                <span className="text-[11px] text-gray-400">Based on your weight & workout intensity</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-blue-400">{waterLiters}</span>
              <span className="text-xs font-bold text-gray-500 ml-1">L / day</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

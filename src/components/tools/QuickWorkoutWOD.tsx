import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Flame, Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { Button } from '../common/Button';

interface Exercise {
  id: string;
  name: string;
  reps: string;
  targetMuscle: string;
  tip: string;
}

interface Routine {
  id: string;
  title: string;
  difficulty: string;
  caloriesEst: string;
  rounds: number;
  workSec: number;
  restSec: number;
  exercises: Exercise[];
}

const WOD_ROUTINES: Routine[] = [
  {
    id: 'apex_burn',
    title: 'Apex Inferno Circuit',
    difficulty: 'High Intensity',
    caloriesEst: '320 kcal',
    rounds: 4,
    workSec: 40,
    restSec: 20,
    exercises: [
      { id: 'e1', name: 'Kettlebell Power Swings', reps: '18 Reps', targetMuscle: 'Glutes & Hamstrings', tip: 'Snap hips explosively at the top.' },
      { id: 'e2', name: 'Burpee Box Jump Overs', reps: '12 Reps', targetMuscle: 'Cardio & Full Body', tip: 'Land softly with knees slightly bent.' },
      { id: 'e3', name: 'Dumbbell Renegade Rows', reps: '16 Reps (Alt)', targetMuscle: 'Lats & Core', tip: 'Prevent hips from rotating.' },
      { id: 'e4', name: 'Wall Ball Shots', reps: '15 Reps', targetMuscle: 'Quads & Shoulders', tip: 'Hit full depth squat before pressing up.' },
    ],
  },
  {
    id: 'core_shred',
    title: 'Titan Core & Mobility Matrix',
    difficulty: 'Moderate Intensity',
    caloriesEst: '240 kcal',
    rounds: 3,
    workSec: 45,
    restSec: 15,
    exercises: [
      { id: 'c1', name: 'Hollow Body Rockers', reps: '40 Sec', targetMuscle: 'Deep Core / Transverse', tip: 'Keep lower back glued to floor.' },
      { id: 'c2', name: 'Plank Shoulder Taps', reps: '20 Taps', targetMuscle: 'Shoulders & Obliques', tip: 'Maintain a steady, rigid torso.' },
      { id: 'c3', name: 'Russian Plate Twists', reps: '24 Reps', targetMuscle: 'Rotational Core', tip: 'Follow plate with your eyes.' },
      { id: 'c4', name: 'Hanging Knee Raises', reps: '15 Reps', targetMuscle: 'Lower Abs', tip: 'Controlled eccentric descent.' },
    ],
  },
];

export const QuickWorkoutWOD: React.FC = () => {
  const [selectedRoutineIdx, setSelectedRoutineIdx] = useState(0);
  const routine = WOD_ROUTINES[selectedRoutineIdx];

  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [phase, setPhase] = useState<'work' | 'rest' | 'finished'>('work');
  const [timeLeft, setTimeLeft] = useState(routine.workSec);
  const [isActive, setIsActive] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const playBeep = (freq = 600, duration = 0.1) => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio fallback
    }
  };

  useEffect(() => {
    let timer: number;
    if (isActive && phase !== 'finished') {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 3 && prev > 1) {
            playBeep(440, 0.08); // Short countdown beep
          }

          if (prev <= 1) {
            playBeep(880, 0.25); // Phase shift long beep
            if (phase === 'work') {
              // Switch to rest
              setPhase('rest');
              return routine.restSec;
            } else {
              // Rest finished, move to next exercise
              if (currentExerciseIdx + 1 < routine.exercises.length) {
                setCurrentExerciseIdx((e) => e + 1);
                setPhase('work');
                return routine.workSec;
              } else {
                // Round completed
                if (currentRound + 1 <= routine.rounds) {
                  setCurrentRound((r) => r + 1);
                  setCurrentExerciseIdx(0);
                  setPhase('work');
                  return routine.workSec;
                } else {
                  // Entire routine completed
                  setPhase('finished');
                  setIsActive(false);
                  return 0;
                }
              }
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isActive, phase, currentExerciseIdx, currentRound, routine]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setPhase('work');
    setCurrentRound(1);
    setCurrentExerciseIdx(0);
    setTimeLeft(routine.workSec);
  };

  const skipNext = () => {
    if (currentExerciseIdx + 1 < routine.exercises.length) {
      setCurrentExerciseIdx((e) => e + 1);
      setPhase('work');
      setTimeLeft(routine.workSec);
    } else if (currentRound + 1 <= routine.rounds) {
      setCurrentRound((r) => r + 1);
      setCurrentExerciseIdx(0);
      setPhase('work');
      setTimeLeft(routine.workSec);
    }
  };

  const maxPhaseTime = phase === 'work' ? routine.workSec : routine.restSec;
  const progressPercent = maxPhaseTime > 0 ? ((maxPhaseTime - timeLeft) / maxPhaseTime) * 100 : 0;
  const currentExercise = routine.exercises[currentExerciseIdx];

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-10 border border-gray-800 max-w-5xl mx-auto relative overflow-hidden bg-brand-dark/95 shadow-2xl">
      {/* Visual background element */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-brand-neon/10 to-transparent blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 bg-brand-neon/10 border border-brand-neon/20 px-3.5 py-1.5 rounded-full text-brand-neon font-black text-xs uppercase tracking-widest">
          <Flame className="h-4 w-4" />
          <span>Interactive Workout Matrix</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
          Workout of the Day (WOD)
        </h2>
        <p className="text-gray-400 text-sm">
          Challenge your endurance with our real-time interval timer and curated circuit routines.
        </p>
      </div>

      {/* Routine Selector Tabs */}
      <div className="flex justify-center gap-3 mb-8">
        {WOD_ROUTINES.map((r, idx) => (
          <button
            key={r.id}
            onClick={() => {
              setSelectedRoutineIdx(idx);
              setIsActive(false);
              setPhase('work');
              setCurrentRound(1);
              setCurrentExerciseIdx(0);
              setTimeLeft(r.workSec);
            }}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all border ${
              selectedRoutineIdx === idx
                ? 'bg-brand-neon text-brand-dark border-brand-neon shadow-neon-glow'
                : 'bg-gray-900/60 text-gray-400 border-gray-800 hover:text-white'
            }`}
          >
            {r.title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* LEFT: Dynamic Circular Countdown Timer */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-black/40 rounded-3xl border border-gray-800 relative">
          <div className="relative w-56 h-56 flex items-center justify-center">
            {/* SVG Ring */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                stroke="currentColor"
                strokeWidth="6"
                className="text-gray-800"
                fill="transparent"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="44"
                stroke="currentColor"
                strokeWidth="6"
                strokeDasharray="276.46"
                strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
                strokeLinecap="round"
                className={phase === 'work' ? 'text-brand-neon' : 'text-amber-400'}
                fill="transparent"
                transition={{ duration: 0.5, ease: 'linear' }}
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span
                className={`text-xs font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-1 border ${
                  phase === 'work'
                    ? 'bg-brand-neon/15 text-brand-neon border-brand-neon/30 animate-pulse'
                    : phase === 'rest'
                    ? 'bg-amber-400/15 text-amber-400 border-amber-400/30'
                    : 'bg-emerald-400/15 text-emerald-400 border-emerald-400/30'
                }`}
              >
                {phase === 'work' ? 'WORK PHASE' : phase === 'rest' ? 'REST & BREATHE' : 'COMPLETED'}
              </span>
              <span className="text-5xl font-black text-white tracking-tighter">{timeLeft}s</span>
              <span className="text-[11px] text-gray-500 font-bold uppercase mt-1">
                Round {currentRound} of {routine.rounds}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 mt-6 w-full max-w-xs justify-center">
            <Button
              variant={isActive ? 'secondary' : 'primary'}
              size="md"
              onClick={toggleTimer}
              className="flex-1 font-black"
            >
              {isActive ? <Pause className="h-4 w-4 mr-1.5" /> : <Play className="h-4 w-4 mr-1.5 fill-current" />}
              <span>{isActive ? 'Pause' : 'Start WOD'}</span>
            </Button>
            <button
              onClick={skipNext}
              className="p-3 bg-gray-900 border border-gray-800 text-gray-400 hover:text-white rounded-xl hover:border-gray-700 transition-colors"
              title="Skip Exercise"
            >
              <SkipForward className="h-4 w-4" />
            </button>
            <button
              onClick={resetTimer}
              className="p-3 bg-gray-900 border border-gray-800 text-gray-400 hover:text-white rounded-xl hover:border-gray-700 transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* RIGHT: Current Exercise Card & Routine Queue */}
        <div className="lg:col-span-7 space-y-4">
          {/* Active Move Spotlight */}
          <div className="p-6 rounded-2xl bg-brand-neon/5 border border-brand-neon/30 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-brand-neon uppercase tracking-wider">
                Current Move • Exercise {currentExerciseIdx + 1}/{routine.exercises.length}
              </span>
              <span className="text-xs font-black text-white bg-black/50 px-3 py-1 rounded-full border border-white/10">
                {currentExercise.reps}
              </span>
            </div>
            <h3 className="text-2xl font-black text-white uppercase">{currentExercise.name}</h3>
            <p className="text-xs text-gray-300">
              <strong className="text-brand-neon">Focus:</strong> {currentExercise.targetMuscle}
            </p>
            <p className="text-xs text-gray-400 bg-black/40 p-3 rounded-xl border border-gray-800">
              💡 <strong>Coaching Cue:</strong> {currentExercise.tip}
            </p>
          </div>

          {/* Exercise Queue List */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              Circuit Exercise List:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {routine.exercises.map((ex, idx) => (
                <div
                  key={ex.id}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    currentExerciseIdx === idx
                      ? 'bg-brand-neon/15 border-brand-neon text-white font-bold shadow-sm'
                      : 'bg-black/30 border-gray-800 text-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-brand-neon">{idx + 1}.</span>
                    <span className="text-xs">{ex.name}</span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-bold">{ex.reps}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

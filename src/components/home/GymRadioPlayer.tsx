import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, SkipForward, Radio, ChevronUp, ChevronDown } from 'lucide-react';

interface Station {
  id: string;
  name: string;
  genre: string;
  bpm: number;
  vibe: string;
  color: string;
  toneFrequency: number;
}

const STATIONS: Station[] = [
  {
    id: 'phonk',
    name: 'UK Apex Phonk & Heavy PRs',
    genre: 'Drift Phonk / Hardstyle',
    bpm: 160,
    vibe: 'Maximum Aggression • Squats & Deadlifts',
    color: 'from-red-500 to-amber-500',
    toneFrequency: 120,
  },
  {
    id: 'synth',
    name: 'Cyberpunk Synthwave Pulse',
    genre: 'Dark Synth / High Cardio',
    bpm: 135,
    vibe: 'High Stamina • HIIT & Treadmill Runs',
    color: 'from-brand-neon to-emerald-400',
    toneFrequency: 140,
  },
  {
    id: 'house',
    name: 'Deep House Flow & Sauna',
    genre: 'Melodic House & Lo-Fi',
    bpm: 122,
    vibe: 'Mobility • Stretch & Cold Plunge',
    color: 'from-blue-500 to-cyan-400',
    toneFrequency: 95,
  },
  {
    id: 'hiphop',
    name: 'Golden Era 90s Boom-Bap',
    genre: 'Heavy Hip-Hop Beats',
    bpm: 92,
    vibe: 'Dumbbell Zone & Calisthenics',
    color: 'from-purple-500 to-pink-500',
    toneFrequency: 85,
  },
];

export const GymRadioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStationIdx, setCurrentStationIdx] = useState(0);
  const [volume, setVolume] = useState(0.6);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);

  const currentStation = STATIONS[currentStationIdx];

  // Synthesize workout background rhythm using Web Audio API
  const playRhythmBeep = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = currentStation.id === 'phonk' ? 'sawtooth' : currentStation.id === 'synth' ? 'square' : 'sine';
      osc.frequency.setValueAtTime(currentStation.toneFrequency, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.15);

      const targetVol = isMuted ? 0 : volume * 0.15;
      gain.gain.setValueAtTime(targetVol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {
      // Audio context might be restricted before user gesture
    }
  };

  useEffect(() => {
    if (isPlaying) {
      const beatMs = (60 / currentStation.bpm) * 1000;
      playRhythmBeep();
      intervalRef.current = window.setInterval(() => {
        playRhythmBeep();
      }, beatMs);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentStationIdx, volume, isMuted]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextStation = () => {
    setCurrentStationIdx((prev) => (prev + 1) % STATIONS.length);
  };

  return (
    <div className="glass-card rounded-3xl p-6 border border-gray-800 relative overflow-hidden bg-brand-dark/90 shadow-2xl backdrop-blur-xl">
      {/* Background visual glow */}
      <div className={`absolute -right-10 -top-10 w-48 h-48 bg-gradient-to-br ${currentStation.color} opacity-15 blur-[60px] rounded-full pointer-events-none transition-all duration-700`} />

      {/* Header bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-brand-neon/10 border border-brand-neon/30 text-brand-neon">
            <Radio className="h-4 w-4" />
            {isPlaying && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand-neon rounded-full animate-ping" />
            )}
          </div>
          <div>
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider flex items-center gap-1.5">
              <span>Live Gym Soundstage</span>
              <span className="text-[10px] bg-brand-neon/15 text-brand-neon px-2 py-0.5 rounded-full font-black">
                {currentStation.bpm} BPM
              </span>
            </h4>
            <p className="text-[11px] text-gray-400">Stream high-octane workout beats</p>
          </div>
        </div>

        {/* Dancing Visualizer EQ */}
        <div className="flex items-end gap-1 h-5 px-2 bg-black/40 rounded-lg border border-white/5">
          {[40, 90, 60, 100, 75].map((h, i) => (
            <motion.span
              key={i}
              className="w-1 bg-brand-neon rounded-full"
              animate={
                isPlaying
                  ? { height: [`${h * 0.2}%`, `${h}%`, `${h * 0.4}%`] }
                  : { height: '20%' }
              }
              transition={{
                duration: 0.4 + i * 0.1,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>

      {/* Current Station Info */}
      <div className="p-4 rounded-2xl bg-black/50 border border-gray-800/80 mb-4 relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-neon">
              {currentStation.genre}
            </span>
            <h5 className="text-white font-black text-base">{currentStation.name}</h5>
            <p className="text-xs text-gray-400 font-medium">{currentStation.vibe}</p>
          </div>
          <button
            onClick={nextStation}
            className="text-gray-400 hover:text-brand-neon p-2 rounded-xl hover:bg-white/5 transition-all text-xs font-bold flex items-center gap-1 shrink-0"
            title="Next Station"
          >
            <SkipForward className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={togglePlay}
          className={`flex-1 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-lg ${
            isPlaying
              ? 'bg-brand-neon text-brand-dark shadow-neon-glow hover:brightness-110'
              : 'bg-white/10 text-white hover:bg-brand-neon hover:text-brand-dark border border-white/10'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="h-4 w-4 fill-current" />
              <span>Pause Soundstage</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4 fill-current" />
              <span>Drop Gym Beat</span>
            </>
          )}
        </button>

        {/* Volume / Mute Button */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-3 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 hover:text-brand-neon hover:border-brand-neon/40 transition-colors"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>

        {/* Expand Stations List */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-3 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 hover:text-white transition-colors"
          title="Browse Channels"
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* Channel Drawer */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-4 pt-4 border-t border-gray-800 space-y-2 overflow-hidden"
          >
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
              Select Workout Channel:
            </span>
            {STATIONS.map((station, idx) => (
              <button
                key={station.id}
                onClick={() => {
                  setCurrentStationIdx(idx);
                  setIsPlaying(true);
                }}
                className={`w-full p-2.5 rounded-xl text-left border flex items-center justify-between transition-all ${
                  currentStationIdx === idx
                    ? 'bg-brand-neon/15 border-brand-neon/50 text-white shadow-sm'
                    : 'bg-black/30 border-gray-800 text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div>
                  <span className="text-xs font-bold block">{station.name}</span>
                  <span className="text-[10px] text-gray-500">{station.genre}</span>
                </div>
                <span className="text-[10px] font-black text-brand-neon px-2 py-0.5 rounded bg-brand-neon/10 border border-brand-neon/20">
                  {station.bpm} BPM
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

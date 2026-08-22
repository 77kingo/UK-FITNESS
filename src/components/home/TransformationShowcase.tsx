import React, { useState } from 'react';
import { Trophy } from 'lucide-react';

interface Story {
  id: string;
  name: string;
  age: number;
  duration: string;
  category: 'fat_loss' | 'muscle_gain' | 'powerlifting';
  achievement: string;
  stats: {
    weightChange: string;
    bodyFatChange: string;
    strengthPr: string;
  };
  quote: string;
  trainer: string;
  beforeImg: string;
  afterImg: string;
}

const STORIES: Story[] = [
  {
    id: '1',
    name: 'Aayush Karki',
    age: 26,
    duration: '16 Weeks',
    category: 'fat_loss',
    achievement: '18kg Fat Shred & 6-Pack Definition',
    stats: {
      weightChange: '-18.5 kg',
      bodyFatChange: '27% ➔ 11%',
      strengthPr: '+45kg Deadlift',
    },
    quote:
      'The structured HIIT circuits and personalized meal guides from UK Fitness completely transformed not just my body, but my daily discipline.',
    trainer: 'Marcus Thorne',
    beforeImg: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80',
    afterImg: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '2',
    name: 'Sunita Rawal',
    age: 29,
    duration: '24 Weeks',
    category: 'muscle_gain',
    achievement: 'Lean Athletic Hypertrophy & Core Power',
    stats: {
      weightChange: '+5.2 kg Lean Muscle',
      bodyFatChange: '22% ➔ 15%',
      strengthPr: 'Squat 110kg',
    },
    quote:
      'UK Fitness coaches pushed me past every mental ceiling. The infrared recovery sauna helped me train 5 days a week without burnout.',
    trainer: 'Elena Rostova',
    beforeImg: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
    afterImg: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '3',
    name: 'Bikram Thapa',
    age: 32,
    duration: '12 Weeks',
    category: 'powerlifting',
    achievement: 'Apex Powerlifting Total 520kg',
    stats: {
      weightChange: '+4.0 kg',
      bodyFatChange: 'Stable 13%',
      strengthPr: 'Bench 140kg / DL 230kg',
    },
    quote:
      'The calibrated Eleiko plates and coaching cues here are second to none in Nepal. Best decision I made for my athletic career.',
    trainer: 'Julian Vance',
    beforeImg: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    afterImg: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80',
  },
];

export const TransformationShowcase: React.FC = () => {
  const [selectedStoryIdx, setSelectedStoryIdx] = useState(0);
  const [sliderPos, setSliderPos] = useState(50);
  const story = STORIES[selectedStoryIdx];

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(percent);
  };

  return (
    <div className="space-y-12">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 bg-brand-neon/10 border border-brand-neon/30 px-3.5 py-1.5 rounded-full text-brand-neon font-black text-xs uppercase tracking-widest">
          <Trophy className="h-4 w-4" />
          <span>Proven Athlete Transformations</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
          Real People. <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-neon via-lime-300 to-emerald-400">Extraordinary Results.</span>
        </h2>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
          Drag the interactive comparison slider to witness verified member progress achieved inside UK Fitness.
        </p>
      </div>

      {/* Story Selectors */}
      <div className="flex flex-wrap justify-center gap-3">
        {STORIES.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => {
              setSelectedStoryIdx(idx);
              setSliderPos(50);
            }}
            className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all border ${
              selectedStoryIdx === idx
                ? 'bg-brand-neon text-brand-dark border-brand-neon shadow-neon-glow scale-105'
                : 'bg-brand-dark/70 text-gray-400 border-gray-800 hover:text-white hover:border-gray-700'
            }`}
          >
            {s.name} • {s.duration}
          </button>
        ))}
      </div>

      {/* Interactive Transformation Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-gray-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto relative overflow-hidden">
        {/* Visual Background Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-neon/5 blur-[100px] rounded-full pointer-events-none" />

        {/* LEFT: Split Image Drag Slider */}
        <div className="lg:col-span-6">
          <div
            className="relative h-[380px] sm:h-[420px] rounded-2xl overflow-hidden border border-gray-800 cursor-ew-resize select-none group shadow-2xl"
            onMouseMove={handleSliderMove}
            onTouchMove={handleSliderMove}
          >
            {/* After Image (Background) */}
            <img
              src={story.afterImg}
              alt="After Transformation"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-brand-neon text-brand-dark px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest shadow-neon-glow z-10">
              Week {story.duration.replace(/\D/g, '')} (Current)
            </div>

            {/* Before Image (Clipped Overlay) */}
            <div
              className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-brand-neon shadow-[0_0_15px_rgba(204,255,0,0.8)]"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src={story.beforeImg}
                alt="Before Transformation"
                className="absolute inset-0 h-full max-w-none object-cover"
                style={{ width: '100%', minWidth: '400px' }}
              />
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-white border border-white/20 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest">
                Day 1 (Start)
              </div>
            </div>

            {/* Drag Handle Indicator */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-brand-neon text-brand-dark flex items-center justify-center font-black shadow-neon-glow z-20 pointer-events-none text-xs"
              style={{ left: `${sliderPos}%` }}
            >
              ⟷
            </div>

            {/* Hint overlay */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-gray-300 font-bold uppercase tracking-wider border border-white/10 pointer-events-none">
              Drag to Compare
            </div>
          </div>
        </div>

        {/* RIGHT: Metric Cards & Testimonial */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-brand-neon">
                {story.category.replace('_', ' ')}
              </span>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-400 font-medium">Coach: {story.trainer}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              {story.achievement}
            </h3>
          </div>

          {/* 3 Metric Pills */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-brand-dark/80 border border-brand-neon/20 p-3.5 rounded-2xl text-center">
              <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Weight Delta</span>
              <span className="text-base sm:text-lg font-black text-brand-neon">{story.stats.weightChange}</span>
            </div>
            <div className="bg-brand-dark/80 border border-brand-neon/20 p-3.5 rounded-2xl text-center">
              <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Body Fat</span>
              <span className="text-base sm:text-lg font-black text-white">{story.stats.bodyFatChange}</span>
            </div>
            <div className="bg-brand-dark/80 border border-brand-neon/20 p-3.5 rounded-2xl text-center">
              <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Max PR</span>
              <span className="text-base sm:text-lg font-black text-emerald-400">{story.stats.strengthPr}</span>
            </div>
          </div>

          {/* Testimonial Quote */}
          <div className="p-5 rounded-2xl bg-black/40 border border-gray-800/80 relative">
            <p className="text-gray-300 text-sm italic leading-relaxed">
              "{story.quote}"
            </p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs font-black text-white uppercase">{story.name}, {story.age}</span>
              <span className="text-[10px] text-brand-neon font-black bg-brand-neon/10 px-2 py-0.5 rounded-full border border-brand-neon/20">
                Verified Member
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

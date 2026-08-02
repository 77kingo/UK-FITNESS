import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Brain, Heart, Zap, Coffee, Battery, Sparkles, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';

type Question = {
  id: string;
  question: string;
  options: { label: string; icon: React.ReactNode; value: string }[];
};

const QUESTIONS: Question[] = [
  {
    id: 'goal',
    question: "What's your primary goal?",
    options: [
      { label: 'Burn Fat & Sweat', icon: <Flame className="h-6 w-6 text-orange-400" />, value: 'HIIT' },
      { label: 'Build Raw Strength', icon: <Zap className="h-6 w-6 text-brand-neon" />, value: 'Strength' },
      { label: 'Destress & Align', icon: <Brain className="h-6 w-6 text-purple-400" />, value: 'Yoga' },
    ]
  },
  {
    id: 'vibe',
    question: "What's your preferred vibe?",
    options: [
      { label: 'High Energy Loud', icon: <Battery className="h-6 w-6 text-red-400" />, value: 'high' },
      { label: 'Intense Focus', icon: <Heart className="h-6 w-6 text-blue-400" />, value: 'focus' },
      { label: 'Chill & Zen', icon: <Coffee className="h-6 w-6 text-amber-400" />, value: 'chill' },
    ]
  },
  {
    id: 'time',
    question: "How much time do you have?",
    options: [
      { label: 'Quick 30m', icon: <Sparkles className="h-6 w-6 text-yellow-400" />, value: '30' },
      { label: 'Solid 45m', icon: <Sparkles className="h-6 w-6 text-teal-400" />, value: '45' },
      { label: 'Extended 60m+', icon: <Sparkles className="h-6 w-6 text-emerald-400" />, value: '60' },
    ]
  }
];

interface ClassMatchmakerProps {
  onBookClass?: (category: string) => void;
}

export const ClassMatchmaker: React.FC<ClassMatchmakerProps> = ({ onBookClass }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isCalculating, setIsCalculating] = useState(false);

  const handleSelect = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (step < QUESTIONS.length - 1) {
      setTimeout(() => setStep(step + 1), 300); // slight delay for visual feedback
    } else {
      // Finished
      setIsCalculating(true);
      setTimeout(() => {
        setIsCalculating(false);
        setStep(step + 1); // Move to result
      }, 1500); // Simulate processing
    }
  };

  const getResult = () => {
    const goal = answers['goal'];
    if (goal === 'Yoga') return { title: 'ZEN MOBILITY FLOW', category: 'Yoga', match: '98%', desc: 'Perfect for destressing and improving your alignment.' };
    if (goal === 'Strength') return { title: 'APEX POWER BUILD', category: 'Strength', match: '95%', desc: 'Ideal for raw strength building and intense focus.' };
    return { title: 'VOLT CONDITIONING', category: 'HIIT', match: '99%', desc: 'The ultimate high-energy fat burning session.' };
  };

  return (
    <div className="glass-card rounded-3xl p-6 md:p-10 border border-gray-800 relative overflow-hidden max-w-3xl mx-auto w-full">
      {/* Progress Bar */}
      {step < QUESTIONS.length && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-900">
          <motion.div
            className="h-full bg-brand-neon"
            initial={{ width: 0 }}
            animate={{ width: `${((step) / QUESTIONS.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      <div className="text-center mb-8">
        <h2 className="text-sm font-black text-brand-neon tracking-widest uppercase mb-2">Class Matchmaker</h2>
        <h3 className="text-2xl md:text-3xl font-extrabold text-white">Find Your Perfect Workout</h3>
      </div>

      <div className="min-h-[250px] relative">
        <AnimatePresence mode="wait">
          {step < QUESTIONS.length && !isCalculating && (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center"
            >
              <h4 className="text-xl font-bold text-white mb-6 text-center">{QUESTIONS[step].question}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                {QUESTIONS[step].options.map((opt) => {
                  const isSelected = answers[QUESTIONS[step].id] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(QUESTIONS[step].id, opt.value)}
                      className={`relative flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all duration-300 transform hover:scale-[1.02] ${
                        isSelected
                          ? 'bg-brand-neon/10 border-brand-neon text-brand-neon shadow-neon-glow'
                          : 'bg-brand-dark/50 border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white'
                      }`}
                    >
                      <div className={`p-3 rounded-xl ${isSelected ? 'bg-brand-neon/20' : 'bg-gray-900'}`}>
                        {opt.icon}
                      </div>
                      <span className="font-bold text-sm tracking-wide">{opt.label}</span>
                      {isSelected && (
                        <div className="absolute top-3 right-3 text-brand-neon">
                          <CheckCircle2 className="h-5 w-5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              
              {step > 0 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="mt-8 flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              )}
            </motion.div>
          )}

          {isCalculating && (
            <motion.div
              key="calculating"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="absolute inset-0 flex flex-col items-center justify-center space-y-4"
            >
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-gray-800" />
                <div className="absolute inset-0 rounded-full border-4 border-brand-neon border-t-transparent animate-spin" />
                <Zap className="absolute inset-0 m-auto h-6 w-6 text-brand-neon animate-pulse" />
              </div>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-sm animate-pulse">Analyzing your vibe...</p>
            </motion.div>
          )}

          {step === QUESTIONS.length && !isCalculating && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full text-center space-y-6"
            >
              <div className="inline-block bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-1.5 rounded-full text-sm font-extrabold uppercase tracking-wider mb-2">
                {getResult().match} Match Found
              </div>
              <h4 className="text-3xl font-black text-white">{getResult().title}</h4>
              <p className="text-gray-400 max-w-md mx-auto">{getResult().desc}</p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto text-lg px-10"
                  onClick={() => onBookClass?.(getResult().category)}
                >
                  Book This Class <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <button 
                  onClick={() => { setStep(0); setAnswers({}); }}
                  className="text-gray-500 hover:text-white font-bold text-sm underline-offset-4 hover:underline transition-all"
                >
                  Retake Quiz
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

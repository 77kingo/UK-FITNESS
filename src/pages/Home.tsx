import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dumbbell, ShieldCheck, Flame, Trophy, ChevronRight, Play, Sparkles, Zap, ArrowRight } from 'lucide-react';
import { Button } from '../components/common/Button';
import { ClassMatchmaker } from '../components/home/ClassMatchmaker';
import { GymVibeMeter } from '../components/home/GymVibeMeter';
import { GymRadioPlayer } from '../components/home/GymRadioPlayer';
import { PeakHoursHeatmap } from '../components/home/PeakHoursHeatmap';
import { TransformationShowcase } from '../components/home/TransformationShowcase';
import { Testimonials } from '../components/home/Testimonials';

interface HomeProps {
  onOpenAuth: () => void;
}

export const Home: React.FC<HomeProps> = ({ onOpenAuth }) => {
  const navigate = useNavigate();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const programs = [
    {
      icon: <Flame className="h-6 w-6 text-brand-neon" />,
      title: 'High-Octane HIIT',
      desc: 'Explosive, cardiac-focused circuit classes designed to test limits, shred calories, and maximize VO2 peak.',
      badge: 'Fat Shred',
    },
    {
      icon: <Dumbbell className="h-6 w-6 text-brand-neon" />,
      title: 'Apex Strength & Power',
      desc: 'Expert compound lift coaching, Eleiko platforms, and hypertrophy science to build raw functional muscle.',
      badge: 'Hypertrophy',
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-brand-neon" />,
      title: 'Athletic Recovery & Flow',
      desc: 'Infrared saunas, cold plunge tubs, and athletic yoga designed to accelerate muscle rebuilding and mobility.',
      badge: 'Recovery',
    },
  ];

  const stats = [
    { value: '50+', label: 'Eleiko Racks & Platforms' },
    { value: '35+', label: 'Weekly Group Classes' },
    { value: '100%', label: 'Certified Elite Coaches' },
    { value: '99.4%', label: 'Member Retention Rate' },
  ];

  return (
    <div className="relative overflow-hidden min-h-screen space-y-24 pb-16">
      {/* 1. Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-black overflow-hidden" aria-label="Welcome Banner">
        {/* Background Image with Dark Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 scale-105 transition-transform duration-1000" 
          style={{ backgroundImage: `url('/assets/gym_hero.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/60 to-transparent" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-neon/10 blur-[150px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 pt-12">
          <motion.div 
            initial="initial" 
            animate="animate" 
            variants={fadeIn}
            className="inline-flex items-center gap-2 bg-brand-neon/10 border border-brand-neon/30 px-4 py-1.5 rounded-full text-brand-neon font-black text-xs uppercase tracking-widest mb-2 shadow-[0_0_15px_rgba(204,255,0,0.2)]"
          >
            <Trophy className="h-4 w-4 shrink-0 text-brand-neon animate-bounce" />
            <span>Bhimdatta's Premier Athletic Training Center</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white uppercase leading-none"
          >
            NO SHORTCUTS.<br />
            JUST <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-neon via-lime-300 to-emerald-400 drop-shadow-[0_0_35px_rgba(204,255,0,0.3)]">UNMATCHED POWER</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-gray-300 font-medium leading-relaxed"
          >
            Experience Olympic-grade facilities, high-energy group workouts led by certified trainers, and structured athletic coaching designed to elevate your performance.
          </motion.p>

          {/* Action CTAs */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
          >
            <Link to="/schedule" className="w-full sm:w-auto">
              <Button variant="glow" size="lg" className="w-full group gap-2 shadow-neon-glow font-black">
                <span>Book a Class Slot</span>
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Link to="/tools" className="w-full sm:w-auto">
              <Button variant="cyber" size="lg" className="w-full gap-2 font-black">
                <Sparkles className="h-4 w-4 text-brand-neon" />
                <span>Interactive Fitness Hub</span>
              </Button>
            </Link>

            <button 
              onClick={onOpenAuth}
              className="w-full sm:w-auto flex items-center justify-center gap-2 text-gray-300 hover:text-white font-bold border border-gray-800 bg-black/50 hover:border-brand-neon/60 px-6 py-3.5 rounded-xl transition-all duration-300 text-sm uppercase tracking-wider"
            >
              <Play className="h-4 w-4 fill-current text-brand-neon shrink-0" />
              <span>Join As Member</span>
            </button>
          </motion.div>

          {/* Stat Ticker Row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-gray-900/80 max-w-4xl mx-auto"
          >
            {stats.map((stat, i) => (
              <div key={i} className="p-3 rounded-2xl bg-black/40 border border-gray-800/80 text-center">
                <span className="text-2xl sm:text-3xl font-black text-brand-neon block mb-0.5">{stat.value}</span>
                <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 2. Interactive Gym Floor Soundstage & Live Peak Hours Tracker */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6">
            <GymRadioPlayer />
          </div>
          <div className="lg:col-span-6">
            <PeakHoursHeatmap />
          </div>
        </div>
      </section>

      {/* 3. Class Matchmaker & Vibe Meter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-brand-neon/30 to-transparent" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pt-8">
          <div className="lg:col-span-7">
            <ClassMatchmaker onBookClass={() => navigate('/schedule')} />
          </div>
          <div className="lg:col-span-5 space-y-8">
            <GymVibeMeter />
            <div className="glass-card rounded-3xl p-6 border border-gray-800 text-center space-y-4">
              <h3 className="text-white font-bold tracking-widest uppercase text-sm">Download Our App</h3>
              <p className="text-gray-400 text-sm">Get real-time updates, track your stats, and manage bookings right from your phone.</p>
              <div className="flex gap-2 justify-center">
                <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 cursor-pointer hover:border-brand-neon transition-colors text-white font-bold text-xs uppercase tracking-wider">App Store</div>
                <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 cursor-pointer hover:border-brand-neon transition-colors text-white font-bold text-xs uppercase tracking-wider">Google Play</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Interactive Transformation Showcase with Drag Comparison */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TransformationShowcase />
      </section>

      {/* 5. Key Programs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-900 pt-20" aria-label="Key Programs">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-brand-neon text-sm font-extrabold uppercase tracking-widest">Our Programs</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            ENGAGE YOUR ATHLETIC POTENTIAL
          </h2>
          <p className="text-gray-400 font-medium text-sm sm:text-base">
            Choose from a diverse range of athletic and strength disciplines curated to build structural symmetry, mental discipline, and overall cardiac efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {programs.map((prog, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -6 }}
              className="glass-card p-8 rounded-3xl flex flex-col justify-between border border-gray-800 hover:border-brand-neon/40 transition-all duration-300 relative group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-neon/5 blur-2xl rounded-full group-hover:bg-brand-neon/10 transition-colors" />
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="bg-brand-neon/15 w-12 h-12 flex items-center justify-center rounded-2xl border border-brand-neon/20 text-brand-neon">
                    {prog.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-black/60 text-brand-neon px-3 py-1 rounded-full border border-brand-neon/20">
                    {prog.badge}
                  </span>
                </div>
                <h3 className="text-xl font-black text-white mb-3 uppercase tracking-wide">
                  {prog.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {prog.desc}
                </p>
              </div>
              <Link to="/services" className="text-brand-neon hover:text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors">
                <span>Explore Packages</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. Interactive Fitness Suite Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-8 sm:p-14 border border-brand-neon/30 bg-gradient-to-r from-brand-dark via-zinc-950 to-brand-dark relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-brand-neon/10 border border-brand-neon/20 px-3 py-1 rounded-full text-brand-neon text-xs font-black uppercase tracking-wider">
              <Zap className="h-3.5 w-3.5" />
              <span>Free Athlete Tools</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              Test Your Fitness Metrics & WOD Timer
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Calculate your exact TDEE macro targets, run customizable interval HIIT circuits, and generate your 3D digital holographic member pass.
            </p>
          </div>

          <Link to="/tools" className="shrink-0">
            <Button variant="glow" size="lg" className="font-black px-8 py-4">
              <span>Launch Fitness Suite</span>
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* 7. Luxury Callout Banner */}
      <section className="relative py-24 bg-brand-accent/20 border-y border-gray-900 overflow-hidden" aria-label="Gym Membership Banner">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            BECOME A MEMBER TODAY
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Gain unlimited access to recovery facilities, towel services, premium locks, body scanning assessments, and personal workout routines designed by our certified coaching team.
          </p>
          <div className="pt-4">
            <Link to="/services">
              <Button variant="primary" size="lg" className="inline-flex font-black px-10 py-4">
                View Membership Packages
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Testimonials Slider */}
      <Testimonials />
    </div>
  );
};

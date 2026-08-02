import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dumbbell, ShieldCheck, Flame, Trophy, ChevronRight, Play } from 'lucide-react';
import { Button } from '../components/common/Button';
import { ClassMatchmaker } from '../components/home/ClassMatchmaker';
import { GymVibeMeter } from '../components/home/GymVibeMeter';
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
      desc: 'Explosive, cardiac-focused circuit classes designed to test limits, shred calories, and increase stamina.',
    },
    {
      icon: <Dumbbell className="h-6 w-6 text-brand-neon" />,
      title: 'Apex Strength & Power',
      desc: 'Expert compound lift coaching, squats, deadlifts, and hypertrophy training to build raw functional muscle.',
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-brand-neon" />,
      title: 'Athletic Recovery & Flow',
      desc: 'Premium yoga, mobility, and cold plunge cycles to optimize range of motion and muscle rebuilding.',
    },
  ];

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center bg-black" aria-label="Welcome Banner">
        {/* Background Image with Dark Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40" 
          style={{ backgroundImage: `url('/assets/gym_hero.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/50 to-transparent" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <motion.div 
            initial="initial" 
            animate="animate" 
            variants={fadeIn}
            className="inline-flex items-center gap-2 bg-brand-neon/10 border border-brand-neon/30 px-3.5 py-1.5 rounded-full text-brand-neon font-bold text-xs uppercase tracking-widest mb-2"
          >
            <Trophy className="h-4 w-4 shrink-0" />
            <span>Bhimdatta's Premier Fitness Center</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white uppercase leading-none"
          >
            NO SHORTCUTS.<br />
            JUST <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-neon via-lime-300 to-emerald-400">UNMATCHED POWER</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-gray-300 font-medium"
          >
            Experience premium facilities, group workouts led by elite trainers, and structured athletic training programs designed to transform your performance.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6"
          >
            <Link to="/schedule" className="w-full sm:w-auto">
              <Button size="lg" className="w-full group gap-2">
                <span>Book a Class</span>
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <button 
              onClick={onOpenAuth}
              className="w-full sm:w-auto flex items-center justify-center gap-2 text-white hover:text-brand-neon font-bold border border-gray-700 bg-brand-dark/50 hover:border-brand-neon px-8 py-3.5 rounded-md transition-all duration-300"
            >
              <Play className="h-4 w-4 fill-current shrink-0" />
              <span>Join As Member</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Gamification Interactive Features Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-brand-neon/30 to-transparent" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-7">
            <ClassMatchmaker onBookClass={() => navigate('/schedule')} />
          </div>
          <div className="lg:col-span-5 space-y-8">
            <GymVibeMeter />
            <div className="glass-card rounded-3xl p-6 border border-gray-800 text-center space-y-4">
              <h3 className="text-white font-bold tracking-widest uppercase text-sm">Download Our App</h3>
              <p className="text-gray-400 text-sm">Get real-time updates, track your stats, and manage bookings right from your phone.</p>
              <div className="flex gap-2 justify-center">
                <div className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 cursor-pointer hover:border-brand-neon transition-colors text-white font-bold text-xs uppercase tracking-wider">App Store</div>
                <div className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 cursor-pointer hover:border-brand-neon transition-colors text-white font-bold text-xs uppercase tracking-wider">Google Play</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Programs Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-900" aria-label="Key Programs">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-neon text-sm font-extrabold uppercase tracking-widest">Our Programs</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 mb-4 uppercase">
            ENGAGE YOUR ATHLETIC POTENTIAL
          </h2>
          <p className="text-gray-400 font-medium">
            Choose from a diverse range of athletic and strength disciplines curated to build structural symmetry, mental discipline, and overall cardiac efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {programs.map((prog, idx) => (
            <div 
              key={idx} 
              className="glass-card p-8 rounded-xl flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300"
            >
              <div>
                <div className="bg-brand-neon/15 w-12 h-12 flex items-center justify-center rounded-lg mb-6 border border-brand-neon/20">
                  {prog.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wide">
                  {prog.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {prog.desc}
                </p>
              </div>
              <Link to="/services" className="text-brand-neon hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <span>Learn Details</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Luxury Callout Banner */}
      <section className="relative py-24 bg-brand-accent/30 border-y border-gray-900 overflow-hidden" aria-label="Gym Membership Banner">
        <div className="absolute right-0 top-0 bottom-0 opacity-15 pointer-events-none hidden md:block">
          <svg className="w-[500px] h-[500px] text-brand-neon" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
            <polygon points="50,10 90,90 10,90" />
            <polygon points="50,20 80,80 20,80" />
          </svg>
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-tight">
            BECOME A MEMBER TODAY
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Gain unlimited access to recovery facilities, towel services, premium locks, body scanning assessments, and personal workout routines designed by our certified coaching team.
          </p>
          <div className="pt-4">
            <Link to="/services">
              <Button size="lg" className="inline-flex">
                View Membership Packages
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Testimonials Slider */}
      <Testimonials />
    </div>
  );
};

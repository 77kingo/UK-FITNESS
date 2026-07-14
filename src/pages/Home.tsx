import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dumbbell, ShieldCheck, Flame, Trophy, ChevronRight, Play } from 'lucide-react';
import { Button } from '../components/common/Button';

interface HomeProps {
  onOpenAuth: () => void;
}

export const Home: React.FC<HomeProps> = ({ onOpenAuth }) => {
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
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="User Reviews">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-brand-neon text-sm font-extrabold uppercase tracking-widest text-center block">TESTIMONIALS</span>
          <h2 className="text-3xl font-extrabold text-white uppercase mt-2">WHAT OUR ATHLETES SAY</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="glass-card p-8 rounded-xl relative flex flex-col justify-between">
            <div>
              <span className="absolute top-6 right-8 text-brand-neon/15 font-serif text-8xl pointer-events-none">“</span>
              <p className="text-gray-300 text-sm italic leading-relaxed mb-6">
                "Great place for full body exercises! UK FITNESS provides top-tier training space and top-class equipment. Highly recommend this fitness hub to everyone in Mahendranagar."
              </p>
            </div>
            <div className="border-t border-gray-900 pt-4">
              <h4 className="font-bold text-white text-sm uppercase">Aade Kunwar</h4>
              <p className="text-gray-500 text-xs">Verified Local Reviewer (4.8★)</p>
            </div>
          </div>

          <div className="glass-card p-8 rounded-xl relative flex flex-col justify-between">
            <div>
              <span className="absolute top-6 right-8 text-brand-neon/15 font-serif text-8xl pointer-events-none">“</span>
              <p className="text-gray-300 text-sm italic leading-relaxed mb-6">
                "Best gym and fitness center in the Bhimdatta area. Pristine machines, welcoming workout space, and highly structured coaching options."
              </p>
            </div>
            <div className="border-t border-gray-900 pt-4">
              <h4 className="font-bold text-white text-sm uppercase">Kailash Saaud</h4>
              <p className="text-gray-500 text-xs">Fitness Athlete (5.0★)</p>
            </div>
          </div>

          <div className="glass-card p-8 rounded-xl relative flex flex-col justify-between">
            <div>
              <span className="absolute top-6 right-8 text-brand-neon/15 font-serif text-8xl pointer-events-none">“</span>
              <p className="text-gray-300 text-sm italic leading-relaxed mb-6">
                "Amazing atmosphere for training. High-energy coaches and clean workout facilities. Absolutely love the workout environment here!"
              </p>
            </div>
            <div className="border-t border-gray-900 pt-4">
              <h4 className="font-bold text-white text-sm uppercase">Deeps Single</h4>
              <p className="text-gray-500 text-xs">Active Club Member (4.8★)</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

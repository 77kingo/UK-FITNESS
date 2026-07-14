import React from 'react';
import { Check, Dumbbell, Shield, Trophy, Activity, Heart, Flame } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useAuthStore } from '../store/authStore';

interface ServicesProps {
  onOpenAuth: () => void;
}

export const Services: React.FC<ServicesProps> = ({ onOpenAuth }) => {
  const { user } = useAuthStore();

  const packages = [
    {
      name: 'Base Performance',
      price: '£59',
      period: 'month',
      desc: 'Access to general strength zones, state-of-the-art weights, and changing facilities.',
      features: [
        'Full access to all Strength & Cardio zones',
        'Modern locker storage & showers',
        '2 general class bookings per week',
        'Mobile app keyless access',
      ],
      cta: 'Choose Base',
      isPopular: false,
    },
    {
      name: 'Premium Athlete',
      price: '£89',
      period: 'month',
      desc: 'Our most popular tier. Unlimited access to classes, premium coaching reviews, and recovery recovery facilities.',
      features: [
        'Everything in Base Performance tier',
        'Unlimited group class bookings',
        'Access to recovery zone (Infrared Sauna & Steam)',
        '1 complimentary trainer review session',
        'Towel services & premium toiletries',
      ],
      cta: 'Become Premium Athlete',
      isPopular: true,
    },
    {
      name: 'Elite Recovery',
      price: '£139',
      period: 'month',
      desc: 'The ultimate athletic optimization. Unlimited classes, dedicated health tracking, and custom nutrition programs.',
      features: [
        'Everything in Premium Athlete tier',
        'Unlimited access to Cold Plunge pools & Saunas',
        'Personal nutritional planning & assessment',
        'Monthly body composition tracking (InBody)',
        '1 private personal training hour per month',
        'Priority booking waitlists',
      ],
      cta: 'Unlock Elite Access',
      isPopular: false,
    },
  ];

  const clubZones = [
    {
      icon: <Dumbbell className="h-5 w-5 text-brand-neon" />,
      title: 'Strength Zone',
      desc: 'Equipped with Eleiko plates, premium Hammer Strength racks, 3 lift platforms, and customized dumbbells up to 70kg.',
    },
    {
      icon: <Flame className="h-5 w-5 text-brand-neon" />,
      title: 'HIIT & Group Studio',
      desc: 'Dynamic group training spaces utilizing woodway curves, airbikes, heavy punching bags, and custom lighting states.',
    },
    {
      icon: <Heart className="h-5 w-5 text-brand-neon" />,
      title: 'Recovery Sanctuary',
      desc: 'Optimized muscle recovery featuring infrared saunas, steam spaces, cold plunge tubs, and compression therapy wraps.',
    },
    {
      icon: <Activity className="h-5 w-5 text-brand-neon" />,
      title: 'Coaching Suite',
      desc: 'Private rooms for body metric monitoring, physiological profiling, and nutrition planning with certified coaches.',
    },
  ];

  return (
    <div className="py-16 space-y-24">
      {/* 1. Page Header */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <span className="text-brand-neon text-sm font-extrabold uppercase tracking-widest">MEMBERSHIPS & PACKAGES</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-3 mb-6 uppercase tracking-tight">
          CHOOSE YOUR LEVEL
        </h1>
        <p className="text-gray-400 text-base sm:text-lg leading-relaxed font-medium">
          Select the performance package that matches your fitness objectives. All memberships include an initial coaching assessment and full keyless locker entry.
        </p>
      </section>

      {/* 2. Pricing Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg, idx) => (
            <div
              key={idx}
              className={`glass-card p-8 rounded-2xl flex flex-col justify-between relative transition-all duration-300 ${
                pkg.isPopular ? 'border-brand-neon glow-border' : 'border-gray-800'
              }`}
            >
              {pkg.isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-neon text-brand-dark text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-neon-glow">
                  Most Popular
                </span>
              )}

              <div>
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white uppercase tracking-wider">{pkg.name}</h3>
                  <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">{pkg.desc}</p>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-extrabold text-white">{pkg.price}</span>
                  <span className="text-gray-400 text-sm font-medium">/{pkg.period}</span>
                </div>

                {/* Features List */}
                <ul className="space-y-4 mb-10">
                  {pkg.features.map((feat, fidx) => (
                    <li key={fidx} className="flex items-start gap-3 text-sm text-gray-300">
                      <Check className="h-5 w-5 text-brand-neon shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Purchase Trigger CTA */}
              <div>
                {user ? (
                  <Button
                    variant={pkg.isPopular ? 'primary' : 'outline'}
                    className="w-full text-sm font-bold uppercase tracking-wider py-3"
                    onClick={() => alert(`Membership registration simulated for ${pkg.name}. Complete setup in Phase 3.`)}
                  >
                    {pkg.cta}
                  </Button>
                ) : (
                  <Button
                    variant={pkg.isPopular ? 'primary' : 'outline'}
                    className="w-full text-sm font-bold uppercase tracking-wider py-3"
                    onClick={onOpenAuth}
                  >
                    Sign In to Purchase
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Gym Infrastructure Sections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-900 pt-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-neon text-sm font-extrabold uppercase tracking-widest">FACILITIES & EQUIPMENT</span>
          <h2 className="text-3xl font-extrabold text-white mt-3 uppercase">PREMIUM CLUB INFRASTRUCTURE</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {clubZones.map((zone, idx) => (
            <div key={idx} className="bg-brand-accent/30 border border-gray-900 p-6 rounded-xl space-y-4 hover:border-gray-800 transition-colors duration-300">
              <div className="w-10 h-10 bg-brand-neon/10 border border-brand-neon/20 rounded-lg flex items-center justify-center">
                {zone.icon}
              </div>
              <h3 className="text-lg font-bold text-white uppercase">{zone.title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{zone.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

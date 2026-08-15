import React, { useState } from 'react';
import { Check, Dumbbell, Activity, Heart, Flame } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useAuthStore } from '../store/authStore';
import { TrainerCard } from '../components/trainers/TrainerCard';
import { QRPaymentModal } from '../components/payment/QRPaymentModal';
import { FitnessCalculator } from '../components/tools/FitnessCalculator';
import { PTBookingModal } from '../components/pt/PTBookingModal';

interface ServicesProps {
  onOpenAuth?: () => void;
}

export const Services: React.FC<ServicesProps> = ({ onOpenAuth: _onOpenAuth }) => {
  const { user } = useAuthStore();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [ptModalOpen, setPtModalOpen] = useState(false);
  const [selectedTrainerName, setSelectedTrainerName] = useState('Marcus Thorne');
  const [selectedPackage, setSelectedPackage] = useState<{ name: string; priceNum: number }>({ name: '', priceNum: 0 });

  const handleJoinClick = (pkgName: string, priceStr: string) => {
    const priceNum = parseInt(priceStr.replace(/[^0-9]/g, ''), 10) || 0;
    setSelectedPackage({ name: pkgName, priceNum });
    setPaymentModalOpen(true);
  };

  const handleBookPT = (trainerName: string) => {
    setSelectedTrainerName(trainerName);
    setPtModalOpen(true);
  };

  const packages = [
    {
      name: 'Base Performance',
      price: 'Rs. 1,500',
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
      price: 'Rs. 3,500',
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
      price: 'Rs. 5,000',
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
                <Button
                  variant={pkg.isPopular ? 'primary' : 'outline'}
                  className="w-full text-sm font-bold uppercase tracking-wider py-3"
                  onClick={() => handleJoinClick(pkg.name, pkg.price)}
                >
                  Pay via QR & Join ({pkg.name})
                </Button>
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

      {/* Fitness Calculator Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-gray-900">
        <FitnessCalculator />
      </section>

      {/* Gamified Trainers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-gray-900">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-neon text-sm font-extrabold uppercase tracking-widest">The Best in the Business</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 uppercase tracking-tight">Meet the Elite Coaches</h2>
          <p className="text-gray-400 mt-4 leading-relaxed font-medium">Our certified trainers bring unique specialties and vibes to the floor. Check their stats and find your perfect match.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <TrainerCard
            name="Marcus Thorne"
            role="Head Strength Coach"
            imageColor="from-red-900 to-black"
            stats={{ strength: 98, agility: 65, endurance: 80, mobility: 60, motivation: 95 }}
            playlistVibe="Heavy Metal & Phonk"
            onBookPT={() => handleBookPT('Marcus Thorne')}
          />
          <TrainerCard
            name="Elena Rostova"
            role="HIIT & Condition Specialist"
            imageColor="from-emerald-900 to-black"
            stats={{ strength: 75, agility: 95, endurance: 98, mobility: 85, motivation: 90 }}
            playlistVibe="'90s Hip Hop & D&B"
            onBookPT={() => handleBookPT('Elena Rostova')}
          />
          <TrainerCard
            name="Julian Vance"
            role="Mobility & Yoga Director"
            imageColor="from-indigo-900 to-black"
            stats={{ strength: 70, agility: 80, endurance: 85, mobility: 100, motivation: 85 }}
            playlistVibe="Deep House & Lo-Fi"
            onBookPT={() => handleBookPT('Julian Vance')}
          />
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-gray-900 bg-black py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight leading-none">
            READY TO JOIN<br />
            <span className="text-brand-neon">THE ELITE?</span>
          </h2>
          <Button size="lg" className="w-full sm:w-auto px-12 py-4 text-lg" onClick={() => handleJoinClick('Base Performance', 'Rs. 1,500')}>
            <span className="tracking-widest">START YOUR JOURNEY</span>
          </Button>
        </div>
      </section>

      {/* QR Code Payment Modal for Members */}
      <QRPaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        membershipTier={selectedPackage.name}
        amount={selectedPackage.priceNum}
        initialName={user?.fullName || ''}
        initialEmail={user?.email || ''}
      />

      {/* PT Booking Modal */}
      <PTBookingModal
        isOpen={ptModalOpen}
        onClose={() => setPtModalOpen(false)}
        preselectedTrainer={selectedTrainerName}
        memberName={user?.fullName || ''}
      />
    </div>
  );
};


import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Sparkles, Download, Copy, Check, Dumbbell, Zap, Crown } from 'lucide-react';
import { Button } from '../common/Button';

interface HoloMemberPassProps {
  initialName?: string;
}

export const HoloMemberPass: React.FC<HoloMemberPassProps> = ({ initialName = 'Apex Athlete' }) => {
  const [name, setName] = useState(initialName || 'Apex Athlete');
  const [tier, setTier] = useState<'Elite' | 'Volt' | 'Base'>('Elite');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const memberId = `UKF-${name.replace(/\s+/g, '').substring(0, 3).toUpperCase()}-9402`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const copyCode = () => {
    navigator.clipboard.writeText(memberId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const triggerDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  const tierColors = {
    Elite: {
      gradient: 'from-amber-400/20 via-brand-neon/20 to-emerald-400/20',
      border: 'border-brand-neon/60',
      badge: 'bg-brand-neon text-brand-dark',
      icon: <Crown className="h-5 w-5 text-brand-neon" />,
      tag: 'Apex VIP Access',
    },
    Volt: {
      gradient: 'from-cyan-400/20 via-blue-500/20 to-indigo-500/20',
      border: 'border-cyan-400/60',
      badge: 'bg-cyan-400 text-brand-dark',
      icon: <Zap className="h-5 w-5 text-cyan-400" />,
      tag: 'Performance Athlete',
    },
    Base: {
      gradient: 'from-zinc-500/20 via-gray-700/20 to-zinc-900/40',
      border: 'border-gray-600',
      badge: 'bg-gray-300 text-brand-dark',
      icon: <Dumbbell className="h-5 w-5 text-gray-300" />,
      tag: 'Standard Member',
    },
  };

  const curTier = tierColors[tier];

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-10 border border-gray-800 max-w-5xl mx-auto relative overflow-hidden bg-brand-dark/95 shadow-2xl">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-neon/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <div className="inline-flex items-center gap-2 bg-brand-neon/10 border border-brand-neon/20 px-3.5 py-1.5 rounded-full text-brand-neon font-black text-xs uppercase tracking-widest">
          <Sparkles className="h-4 w-4" />
          <span>Interactive Member Artifact</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
          3D Holographic Digital Pass
        </h2>
        <p className="text-gray-400 text-sm">
          Customize your official UK Fitness keyless entry pass. Tilt with your mouse for real-time holographic shimmer.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* LEFT: Controls Form */}
        <div className="lg:col-span-5 space-y-5 bg-black/40 p-6 rounded-2xl border border-gray-800">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
              Passholder Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:border-brand-neon focus:outline-none"
              placeholder="Your Full Name"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
              Membership Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Elite', 'Volt', 'Base'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTier(t)}
                  className={`py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border transition-all ${
                    tier === t
                      ? 'bg-brand-neon text-brand-dark border-brand-neon shadow-neon-glow'
                      : 'bg-gray-900 text-gray-400 border-gray-800 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 space-y-3">
            <Button variant="primary" className="w-full justify-center" onClick={triggerDownload}>
              <Download className="h-4 w-4 mr-2" />
              <span>{downloaded ? 'Pass Saved to Device!' : 'Download Digital Wallet Pass'}</span>
            </Button>
            <button
              onClick={copyCode}
              className="w-full py-2.5 rounded-xl border border-gray-800 bg-gray-900/60 hover:bg-gray-800 text-gray-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              {copied ? <Check className="h-4 w-4 text-brand-neon" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? 'Keyless Access ID Copied!' : `Copy Access Code (${memberId})`}</span>
            </button>
          </div>
        </div>

        {/* RIGHT: 3D Holographic Card Display */}
        <div
          className="lg:col-span-7 flex justify-center perspective-1000 py-4"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            style={{
              transformStyle: 'preserve-3d',
            }}
            animate={{
              rotateY: mousePos.x * 25,
              rotateX: -mousePos.y * 25,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`relative w-full max-w-sm sm:max-w-md h-[240px] sm:h-[270px] rounded-3xl p-6 sm:p-8 border-2 ${curTier.border} shadow-2xl overflow-hidden bg-gradient-to-br from-zinc-900/90 via-black/95 to-zinc-950/90 select-none`}
          >
            {/* Holographic Sheen Layer */}
            <div
              className={`absolute inset-0 bg-gradient-to-tr ${curTier.gradient} opacity-40 pointer-events-none`}
              style={{
                transform: `translateX(${mousePos.x * 40}px) translateY(${mousePos.y * 40}px)`,
              }}
            />

            {/* Glowing Corner Accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-neon/10 blur-2xl rounded-full pointer-events-none" />

            {/* Card Content Top */}
            <div className="relative z-10 flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-black/60 border border-white/10 text-white">
                  {curTier.icon}
                </div>
                <div>
                  <h4 className="text-lg font-black tracking-wider text-white uppercase leading-none">
                    UK <span className="text-brand-neon">FITNESS</span>
                  </h4>
                  <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                    Keyless Access Pass
                  </span>
                </div>
              </div>

              <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${curTier.badge} shadow-md`}>
                {curTier.tag}
              </span>
            </div>

            {/* Middle: Member Name */}
            <div className="relative z-10 my-4 sm:my-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-0.5">
                Authorized Athlete
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight truncate">
                {name || 'Apex Member'}
              </h3>
            </div>

            {/* Bottom Bar: Access ID & Micro QR */}
            <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-500 font-bold block uppercase">Member Code</span>
                <span className="text-xs sm:text-sm font-mono font-black text-brand-neon tracking-wider">
                  {memberId}
                </span>
              </div>

              <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-xl border border-white/10">
                <QrCode className="h-6 w-6 text-brand-neon" />
                <span className="text-[9px] font-bold text-gray-300 uppercase leading-tight">
                  TAP AT<br />GATE
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

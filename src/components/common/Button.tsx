import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'glow' | 'cyber';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  ...props
}) => {
  const baseStyle =
    'relative overflow-hidden font-bold rounded-xl transition-all duration-300 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark flex items-center justify-center btn-shimmer tracking-wider uppercase select-none';

  const variants = {
    primary:
      'bg-brand-neon text-brand-dark hover:shadow-neon-glow hover:brightness-105 focus:ring-brand-neon border border-brand-neon/80 font-black',
    secondary:
      'bg-brand-accent text-white border border-gray-800 hover:bg-gray-800 hover:border-gray-600 focus:ring-gray-700 shadow-md',
    outline:
      'border-2 border-brand-neon/40 bg-transparent text-brand-neon hover:bg-brand-neon/10 hover:border-brand-neon focus:ring-brand-neon',
    glow:
      'bg-gradient-to-r from-brand-neon to-emerald-400 text-brand-dark hover:shadow-[0_0_25px_rgba(204,255,0,0.6)] focus:ring-brand-neon font-black',
    cyber:
      'bg-gradient-to-r from-black via-zinc-900 to-black text-white border border-brand-neon/60 hover:border-brand-neon hover:shadow-neon-glow hover:text-brand-neon',
    danger:
      'bg-red-600 text-white hover:bg-red-700 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] focus:ring-red-500',
  };

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
    xl: 'px-9 py-4 text-lg font-black',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.025, y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
};

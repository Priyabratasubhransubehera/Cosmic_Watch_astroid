import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface AlertBannerProps {
  message: string;
  type: 'high' | 'medium' | 'low' | 'info';
}

export default function AlertBanner({ message, type }: AlertBannerProps) {
  const getAlertStyles = () => {
    switch (type) {
      case 'high':
        return {
          bg: 'bg-high-risk-red/10',
          border: 'border-high-risk-red',
          text: 'text-high-risk-red',
          icon: AlertTriangle,
          glow: 'shadow-[0_0_30px_rgba(255,0,0,0.3)]',
        };
      case 'medium':
        return {
          bg: 'bg-medium-risk-amber/10',
          border: 'border-medium-risk-amber',
          text: 'text-medium-risk-amber',
          icon: AlertCircle,
          glow: 'shadow-[0_0_30px_rgba(255,191,0,0.3)]',
        };
      case 'low':
        return {
          bg: 'bg-low-risk-green/10',
          border: 'border-low-risk-green',
          text: 'text-low-risk-green',
          icon: Info,
          glow: 'shadow-[0_0_30px_rgba(57,255,20,0.3)]',
        };
      case 'info':
      default:
        return {
          bg: 'bg-accent-cyan/10',
          border: 'border-accent-cyan',
          text: 'text-accent-cyan',
          icon: Info,
          glow: 'shadow-[0_0_30px_rgba(0,188,212,0.3)]',
        };
    }
  };

  const styles = getAlertStyles();
  const Icon = styles.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-[100rem] mx-auto px-6 mb-8"
    >
      <div
        className={`${styles.bg} ${styles.glow} border-2 ${styles.border} rounded-xl p-6 flex items-center gap-4`}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Icon className={`w-6 h-6 ${styles.text} flex-shrink-0`} />
        </motion.div>
        <div className="flex-1">
          <p className={`font-paragraph text-base font-semibold ${styles.text}`}>
            {message}
          </p>
        </div>
        <motion.div
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className={`px-4 py-2 rounded-lg border ${styles.border} ${styles.text} font-paragraph text-sm font-bold tracking-wider`}
        >
          ALERT
        </motion.div>
      </div>
    </motion.div>
  );
}

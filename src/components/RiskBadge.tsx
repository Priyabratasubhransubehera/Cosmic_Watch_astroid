import { motion } from 'framer-motion';

interface RiskBadgeProps {
  risk: string;
}

export default function RiskBadge({ risk }: RiskBadgeProps) {
  const riskLower = risk.toLowerCase();

  const getRiskStyles = () => {
    switch (riskLower) {
      case 'high':
        return {
          bg: 'bg-high-risk-red',
          text: 'text-high-risk-red-foreground',
          border: 'border-high-risk-red',
          glow: 'shadow-[0_0_20px_rgba(255,0,0,0.5)]',
        };
      case 'medium':
        return {
          bg: 'bg-medium-risk-amber',
          text: 'text-medium-risk-amber-foreground',
          border: 'border-medium-risk-amber',
          glow: 'shadow-[0_0_20px_rgba(255,191,0,0.5)]',
        };
      case 'low':
      default:
        return {
          bg: 'bg-low-risk-green',
          text: 'text-low-risk-green-foreground',
          border: 'border-low-risk-green',
          glow: 'shadow-[0_0_20px_rgba(57,255,20,0.5)]',
        };
    }
  };

  const styles = getRiskStyles();

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`inline-flex items-center px-3 py-1 rounded-full ${styles.bg} ${styles.text} border ${styles.border} ${styles.glow} font-paragraph text-xs font-bold tracking-wider`}
    >
      <motion.span
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-2 h-2 rounded-full bg-current mr-2"
      />
      {risk.toUpperCase()}
    </motion.div>
  );
}

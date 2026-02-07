import { motion } from 'framer-motion';
import { Satellite } from 'lucide-react';

export default function Header() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-accent-cyan/20"
    >
      <div className="max-w-[100rem] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 group">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="relative"
            >
              <Satellite className="w-8 h-8 text-accent-electric-blue" />
              <motion.div
                className="absolute inset-0 rounded-full bg-accent-electric-blue/20 blur-xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-primary-foreground group-hover:text-accent-electric-blue transition-colors">
                Cosmic Watch
              </h1>
              <p className="font-paragraph text-xs text-secondary-foreground tracking-wider">
                ASTEROID RISK TRACKER
              </p>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#dashboard"
              className="font-paragraph text-sm text-secondary-foreground hover:text-accent-electric-blue transition-colors tracking-wide"
            >
              DASHBOARD
            </a>
            <a
              href="#about"
              className="font-paragraph text-sm text-secondary-foreground hover:text-accent-electric-blue transition-colors tracking-wide"
            >
              ABOUT
            </a>
            <a
              href="#alerts"
              className="font-paragraph text-sm text-secondary-foreground hover:text-accent-electric-blue transition-colors tracking-wide"
            >
              ALERTS
            </a>
          </nav>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-accent-electric-blue text-background rounded-lg font-paragraph font-semibold text-sm hover:bg-accent-cyan transition-colors"
          >
            MISSION CONTROL
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}

import { motion } from 'framer-motion';
import { Satellite, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-secondary border-t border-accent-cyan/20 mt-20">
      <div className="max-w-[100rem] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Satellite className="w-8 h-8 text-accent-electric-blue" />
              </motion.div>
              <div>
                <h3 className="font-heading text-xl font-bold text-primary-foreground">
                  Cosmic Watch
                </h3>
                <p className="font-paragraph text-xs text-secondary-foreground tracking-wider">
                  ASTEROID RISK TRACKER
                </p>
              </div>
            </div>
            <p className="font-paragraph text-sm text-secondary-foreground leading-relaxed">
              Real-time monitoring of near-Earth objects with precision telemetry and risk analysis powered by NASA NeoWs API.
            </p>
          </div>

          {/* Mission */}
          <div>
            <h4 className="font-heading text-lg font-bold text-primary-foreground mb-4">
              Mission
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#dashboard" className="font-paragraph text-sm text-secondary-foreground hover:text-accent-electric-blue transition-colors">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#about" className="font-paragraph text-sm text-secondary-foreground hover:text-accent-electric-blue transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#alerts" className="font-paragraph text-sm text-secondary-foreground hover:text-accent-electric-blue transition-colors">
                  Alerts
                </a>
              </li>
              <li>
                <a href="#tracking" className="font-paragraph text-sm text-secondary-foreground hover:text-accent-electric-blue transition-colors">
                  Tracking
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-heading text-lg font-bold text-primary-foreground mb-4">
              Resources
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#api" className="font-paragraph text-sm text-secondary-foreground hover:text-accent-electric-blue transition-colors">
                  API Documentation
                </a>
              </li>
              <li>
                <a href="#data" className="font-paragraph text-sm text-secondary-foreground hover:text-accent-electric-blue transition-colors">
                  Data Sources
                </a>
              </li>
              <li>
                <a href="#research" className="font-paragraph text-sm text-secondary-foreground hover:text-accent-electric-blue transition-colors">
                  Research
                </a>
              </li>
              <li>
                <a href="#faq" className="font-paragraph text-sm text-secondary-foreground hover:text-accent-electric-blue transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-heading text-lg font-bold text-primary-foreground mb-4">
              Connect
            </h4>
            <p className="font-paragraph text-sm text-secondary-foreground mb-4">
              Follow our mission and stay updated on celestial threats.
            </p>
            <div className="flex gap-4">
              <motion.a
                href="#twitter"
                whileHover={{ scale: 1.1, y: -2 }}
                className="p-2 bg-background/50 rounded-lg border border-accent-cyan/30 hover:border-accent-cyan transition-colors"
              >
                <Twitter className="w-5 h-5 text-accent-cyan" />
              </motion.a>
              <motion.a
                href="#github"
                whileHover={{ scale: 1.1, y: -2 }}
                className="p-2 bg-background/50 rounded-lg border border-accent-cyan/30 hover:border-accent-cyan transition-colors"
              >
                <Github className="w-5 h-5 text-accent-cyan" />
              </motion.a>
              <motion.a
                href="#linkedin"
                whileHover={{ scale: 1.1, y: -2 }}
                className="p-2 bg-background/50 rounded-lg border border-accent-cyan/30 hover:border-accent-cyan transition-colors"
              >
                <Linkedin className="w-5 h-5 text-accent-cyan" />
              </motion.a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-accent-cyan/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-paragraph text-sm text-secondary-foreground">
              © 2026 Cosmic Watch. Powered by NASA NeoWs API. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#privacy" className="font-paragraph text-sm text-secondary-foreground hover:text-accent-electric-blue transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="font-paragraph text-sm text-secondary-foreground hover:text-accent-electric-blue transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

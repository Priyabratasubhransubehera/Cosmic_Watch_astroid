import { motion } from 'framer-motion';
import { Calendar, Gauge, AlertTriangle } from 'lucide-react';
import { Asteroids } from '@/entities';
import RiskBadge from './RiskBadge';

interface AsteroidCardProps {
  asteroid: Asteroids;
  onClick: () => void;
}

export default function AsteroidCard({ asteroid, onClick }: AsteroidCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="bg-secondary rounded-xl p-6 border border-accent-cyan/30 shadow-lg cursor-pointer hover:border-accent-cyan transition-all relative overflow-hidden group"
    >
      {/* Glow Effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${
            asteroid.riskLevel?.toLowerCase() === 'high'
              ? 'rgba(255, 0, 0, 0.1)'
              : asteroid.riskLevel?.toLowerCase() === 'medium'
              ? 'rgba(255, 191, 0, 0.1)'
              : 'rgba(57, 255, 20, 0.1)'
          }, transparent 70%)`,
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="font-heading text-xl font-bold text-primary-foreground pr-4 line-clamp-2">
            {asteroid.asteroidName || 'Unknown Asteroid'}
          </h3>
          <RiskBadge risk={asteroid.riskLevel || 'low'} />
        </div>

        {/* Data Grid */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-accent-cyan flex-shrink-0" />
            <div className="flex-1">
              <div className="text-xs font-paragraph text-secondary-foreground">
                Close Approach
              </div>
              <div className="text-sm font-paragraph font-semibold text-primary-foreground">
                {asteroid.closeApproachDate
                  ? new Date(asteroid.closeApproachDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'N/A'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Gauge className="w-4 h-4 text-accent-cyan flex-shrink-0" />
            <div className="flex-1">
              <div className="text-xs font-paragraph text-secondary-foreground">
                Miss Distance
              </div>
              <div className="text-sm font-paragraph font-semibold text-primary-foreground">
                {asteroid.missDistance
                  ? `${asteroid.missDistance.toLocaleString()} km`
                  : 'N/A'}
              </div>
            </div>
          </div>

          {asteroid.isPotentiallyHazardous && (
            <div className="flex items-center gap-2 bg-high-risk-red/10 rounded-lg px-3 py-2 border border-high-risk-red/30">
              <AlertTriangle className="w-4 h-4 text-high-risk-red flex-shrink-0" />
              <span className="text-xs font-paragraph font-semibold text-high-risk-red">
                Potentially Hazardous
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-accent-cyan/20">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-xs font-paragraph text-secondary-foreground mb-1">
                Diameter
              </div>
              <div className="text-sm font-paragraph font-semibold text-accent-electric-blue">
                {asteroid.estimatedDiameter
                  ? `${asteroid.estimatedDiameter.toFixed(2)} km`
                  : 'N/A'}
              </div>
            </div>
            <div>
              <div className="text-xs font-paragraph text-secondary-foreground mb-1">
                Velocity
              </div>
              <div className="text-sm font-paragraph font-semibold text-accent-electric-blue">
                {asteroid.relativeVelocity
                  ? `${Math.round(asteroid.relativeVelocity).toLocaleString()} km/h`
                  : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

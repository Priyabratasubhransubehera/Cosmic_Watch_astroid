import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Asteroids } from '@/entities';

interface RadarSystemProps {
  asteroids: Asteroids[];
  selectedAsteroid?: Asteroids | null;
  onAsteroidSelect?: (asteroid: Asteroids) => void;
}

export default function RadarSystem({ asteroids, selectedAsteroid, onAsteroidSelect }: RadarSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Normalize asteroid data to radar coordinates
  const getRadarPosition = (asteroid: Asteroids, radius: number) => {
    // Use hash of asteroid ID to create consistent positioning
    const hash = asteroid._id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const angle = (hash % 360) * (Math.PI / 180);
    
    // Use risk level to determine distance from center
    const riskMultiplier = asteroid.riskLevel?.toLowerCase() === 'high' 
      ? 0.8 
      : asteroid.riskLevel?.toLowerCase() === 'medium' 
      ? 0.6 
      : 0.4;
    
    const distance = radius * riskMultiplier;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    
    return { x, y, angle, distance };
  };

  const getRiskColor = (riskLevel?: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'high':
        return '#FF0000';
      case 'medium':
        return '#FFBF00';
      case 'low':
        return '#39FF14';
      default:
        return '#00FFFF';
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 2 - 20;

    // Clear canvas
    ctx.fillStyle = '#05070D';
    ctx.fillRect(0, 0, width, height);

    // Draw concentric circles
    ctx.strokeStyle = 'rgba(0, 188, 212, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 4; i++) {
      const radius = (maxRadius / 4) * i;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw radial lines
    ctx.strokeStyle = 'rgba(0, 188, 212, 0.1)';
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * maxRadius;
      const y = centerY + Math.sin(angle) * maxRadius;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    // Draw rotating scan line
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    const scanAngle = (rotation * Math.PI) / 180;
    const scanX = centerX + Math.cos(scanAngle) * maxRadius;
    const scanY = centerY + Math.sin(scanAngle) * maxRadius;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(scanX, scanY);
    ctx.stroke();

    // Draw outer circle
    ctx.strokeStyle = 'rgba(0, 188, 212, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Draw asteroids
    asteroids.forEach((asteroid) => {
      const pos = getRadarPosition(asteroid, maxRadius);
      const screenX = centerX + pos.x;
      const screenY = centerY + pos.y;
      const color = getRiskColor(asteroid.riskLevel);
      const isSelected = selectedAsteroid?._id === asteroid._id;
      const isHovered = hoveredId === asteroid._id;

      // Draw glow for selected/hovered
      if (isSelected || isHovered) {
        ctx.fillStyle = color + '40';
        ctx.beginPath();
        ctx.arc(screenX, screenY, 12, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw asteroid point
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(screenX, screenY, isSelected ? 6 : isHovered ? 5 : 4, 0, Math.PI * 2);
      ctx.fill();

      // Draw pulse for high-risk
      if (asteroid.riskLevel?.toLowerCase() === 'high') {
        ctx.strokeStyle = color + '80';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(screenX, screenY, 8, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    // Draw center point
    ctx.fillStyle = '#00FFFF';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
    ctx.fill();
  }, [rotation, asteroids, selectedAsteroid, hoveredId]);

  // Animate rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = Math.min(canvas.width, canvas.height) / 2 - 20;

    // Check if click is on any asteroid
    asteroids.forEach((asteroid) => {
      const pos = getRadarPosition(asteroid, maxRadius);
      const screenX = centerX + pos.x;
      const screenY = centerY + pos.y;
      const distance = Math.sqrt((x - screenX) ** 2 + (y - screenY) ** 2);

      if (distance < 10) {
        onAsteroidSelect?.(asteroid);
      }
    });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = Math.min(canvas.width, canvas.height) / 2 - 20;

    let found = false;
    asteroids.forEach((asteroid) => {
      const pos = getRadarPosition(asteroid, maxRadius);
      const screenX = centerX + pos.x;
      const screenY = centerY + pos.y;
      const distance = Math.sqrt((x - screenX) ** 2 + (y - screenY) ** 2);

      if (distance < 10) {
        setHoveredId(asteroid._id);
        found = true;
      }
    });

    if (!found) {
      setHoveredId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative w-full"
    >
      <div className="relative holographic-card p-8 rounded-2xl border-t-4 border-t-accent-cyan overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-accent-cyan font-heading text-2xl">RADAR SYSTEM</h3>
            <p className="text-xs text-secondary-foreground uppercase tracking-widest">Real-time Object Detection</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-low-risk-green rounded-full animate-pulse" />
            <span className="text-xs text-secondary-foreground font-mono">ACTIVE</span>
          </div>
        </div>

        {/* Canvas Container */}
        <div className="relative bg-black/40 rounded-lg overflow-hidden border border-white/10 aspect-square">
          <canvas
            ref={canvasRef}
            width={500}
            height={500}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            onMouseLeave={() => setHoveredId(null)}
            className="w-full h-full cursor-crosshair"
          />
        </div>

        {/* Legend */}
        <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-high-risk-red rounded-full" />
            <span className="text-xs text-secondary-foreground">High Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-medium-risk-amber rounded-full" />
            <span className="text-xs text-secondary-foreground">Medium Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-low-risk-green rounded-full" />
            <span className="text-xs text-secondary-foreground">Low Risk</span>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 flex justify-between items-center text-xs text-secondary-foreground font-mono">
          <span>OBJECTS: {asteroids.length}</span>
          <span>SCAN: {rotation}°</span>
        </div>
      </div>
    </motion.div>
  );
}

// HPI 1.7-G
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Rocket, AlertTriangle, Shield, TrendingUp, Activity, Radar, Globe, ChevronDown, Satellite, Radio } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { Asteroids } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AsteroidCard from '@/components/AsteroidCard';
import RiskBadge from '@/components/RiskBadge';
import AlertBanner from '@/components/AlertBanner';
import StarfieldBackground from '@/components/StarfieldBackground';
import RadarSystem from '@/components/RadarSystem';
import { Image } from '@/components/ui/image';

// --- Types ---
type RiskFilter = 'all' | 'high' | 'medium' | 'low';

// --- Utility Components ---

const SectionDivider = () => (
  <div className="w-full flex items-center justify-center py-12 opacity-30">
    <div className="h-px w-full max-w-xs bg-gradient-to-r from-transparent via-accent-cyan to-transparent" />
    <div className="mx-4 text-accent-cyan text-xs tracking-[0.2em]">SYSTEM_CHECK</div>
    <div className="h-px w-full max-w-xs bg-gradient-to-r from-transparent via-accent-cyan to-transparent" />
  </div>
);

const GlitchText = ({ text }: { text: string }) => (
  <span className="relative inline-block group">
    <span className="relative z-10">{text}</span>
    <span className="absolute top-0 left-0 -z-10 w-full h-full text-accent-electric-blue opacity-0 group-hover:opacity-70 animate-pulse translate-x-[2px]">
      {text}
    </span>
    <span className="absolute top-0 left-0 -z-10 w-full h-full text-high-risk-red opacity-0 group-hover:opacity-70 animate-pulse -translate-x-[2px]">
      {text}
    </span>
  </span>
);

export default function HomePage() {
  // --- Canonical Data Sources ---
  const [asteroids, setAsteroids] = useState<Asteroids[]>([]);
  const [filteredAsteroids, setFilteredAsteroids] = useState<Asteroids[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRisk, setSelectedRisk] = useState<RiskFilter>('all');
  const [selectedAsteroid, setSelectedAsteroid] = useState<Asteroids | null>(null);

  // --- Scroll Hooks ---
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 50]);

  // --- Data Fetching (Preserved) ---
  useEffect(() => {
    loadAsteroids();
  }, []);

  useEffect(() => {
    if (selectedRisk === 'all') {
      setFilteredAsteroids(asteroids);
    } else {
      setFilteredAsteroids(asteroids.filter(a => a.riskLevel?.toLowerCase() === selectedRisk));
    }
  }, [selectedRisk, asteroids]);

  const loadAsteroids = async () => {
    try {
      const result = await BaseCrudService.getAll<Asteroids>('asteroids');
      setAsteroids(result.items);
      setFilteredAsteroids(result.items);
    } catch (error) {
      console.error('Failed to load asteroids:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Derived Stats ---
  const highRiskCount = asteroids.filter(a => a.riskLevel?.toLowerCase() === 'high').length;
  const mediumRiskCount = asteroids.filter(a => a.riskLevel?.toLowerCase() === 'medium').length;
  const lowRiskCount = asteroids.filter(a => a.riskLevel?.toLowerCase() === 'low').length;

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground relative overflow-clip selection:bg-accent-cyan/30 selection:text-accent-cyan">
      <style>{`
        .grid-overlay {
          background-size: 40px 40px;
          background-image: linear-gradient(to right, rgba(0, 188, 212, 0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0, 188, 212, 0.05) 1px, transparent 1px);
          mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
        }
        .scan-line {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: rgba(0, 255, 255, 0.3);
          box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
          animation: scan 4s linear infinite;
          pointer-events: none;
          z-index: 0;
        }
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .holographic-card {
          background: rgba(5, 7, 13, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0, 188, 212, 0.2);
          box-shadow: 0 0 20px rgba(0, 188, 212, 0.05), inset 0 0 20px rgba(0, 188, 212, 0.05);
        }
      `}</style>

      <StarfieldBackground />
      
      {/* Global Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 grid-overlay" />
      
      {/* Progress Line */}
      <motion.div 
        className="fixed top-0 left-0 h-1 bg-accent-electric-blue z-[100] shadow-[0_0_10px_#00FFFF]"
        style={{ width: useTransform(smoothProgress, (v) => `${v * 100}%`) }}
      />

      <Header />

      {/* --- HERO SECTION --- */}
      <section className="relative w-full min-h-[95vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
           {/* Hero Background Image with Parallax */}
           <motion.div 
             style={{ y: heroY, scale: heroScale }}
             className="absolute inset-0 opacity-40"
           >
             <Image 
               src="https://static.wixstatic.com/media/d5a106_e58a401e4f884e7f89579deebbfc6f9d~mv2.png?originWidth=1600&originHeight=768" 
               alt="Cosmic Background" 
               className="w-full h-full object-cover object-center filter brightness-50 contrast-125 saturate-50"
             />
             <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
             <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
           </motion.div>
        </div>

        <div className="relative z-10 w-full max-w-[120rem] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Content */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center gap-4"
            >
              <div className="h-px w-12 bg-accent-cyan" />
              <span className="text-accent-cyan font-paragraph tracking-[0.3em] text-sm uppercase">
                System Online • Monitoring Active
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-heading text-7xl md:text-8xl lg:text-9xl font-bold leading-[0.9] text-primary-foreground tracking-tighter"
            >
              COSMIC<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-electric-blue to-accent-neon-purple">
                WATCH
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="font-paragraph text-xl md:text-2xl text-secondary-foreground/80 max-w-2xl leading-relaxed border-l-2 border-accent-cyan/30 pl-6"
            >
              Advanced telemetry for Near-Earth Object detection. 
              Analyzing trajectories, calculating impact probabilities, and securing planetary defense.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap gap-4 mt-4"
            >
              <button 
                onClick={() => document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative px-8 py-4 bg-accent-cyan/10 border border-accent-cyan text-accent-cyan font-paragraph font-bold uppercase tracking-wider hover:bg-accent-cyan hover:text-background transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Radar className="w-5 h-5" />
                  Initialize Scan
                </span>
                <div className="absolute inset-0 bg-accent-cyan transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 z-0" />
              </button>
              
              <div className="flex items-center gap-4 px-6 py-4 border border-white/10 bg-secondary/50 backdrop-blur-sm">
                <div className="flex flex-col">
                  <span className="text-xs text-secondary-foreground uppercase tracking-wider">Active Sensors</span>
                  <span className="text-accent-electric-blue font-mono font-bold">ONLINE</span>
                </div>
                <Activity className="w-5 h-5 text-accent-electric-blue animate-pulse" />
              </div>
            </motion.div>
          </div>

          {/* Hero Visual / Stats Preview */}
          <div className="lg:col-span-5 relative hidden lg:block">
             <motion.div
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 1, delay: 0.5 }}
               className="relative z-10"
             >
               <div className="absolute inset-0 bg-accent-electric-blue/20 blur-[100px] rounded-full" />
               <div className="relative holographic-card p-8 rounded-2xl border-t-4 border-t-accent-cyan">
                 <div className="flex justify-between items-start mb-8">
                   <div>
                     <h3 className="text-accent-cyan font-heading text-2xl">THREAT LEVEL</h3>
                     <p className="text-xs text-secondary-foreground uppercase tracking-widest">Global Assessment</p>
                   </div>
                   <Globe className="w-8 h-8 text-accent-cyan opacity-50 animate-spin-slow" style={{ animationDuration: '20s' }} />
                 </div>
                 
                 <div className="space-y-6">
                   <div className="flex items-center justify-between p-4 bg-high-risk-red/10 border border-high-risk-red/30 rounded-lg">
                     <div className="flex items-center gap-3">
                       <AlertTriangle className="w-5 h-5 text-high-risk-red" />
                       <span className="text-high-risk-red font-bold tracking-wider">CRITICAL</span>
                     </div>
                     <span className="font-mono text-2xl text-high-risk-red font-bold">{highRiskCount}</span>
                   </div>
                   
                   <div className="flex items-center justify-between p-4 bg-medium-risk-amber/10 border border-medium-risk-amber/30 rounded-lg">
                     <div className="flex items-center gap-3">
                       <TrendingUp className="w-5 h-5 text-medium-risk-amber" />
                       <span className="text-medium-risk-amber font-bold tracking-wider">MODERATE</span>
                     </div>
                     <span className="font-mono text-2xl text-medium-risk-amber font-bold">{mediumRiskCount}</span>
                   </div>

                   <div className="flex items-center justify-between p-4 bg-low-risk-green/10 border border-low-risk-green/30 rounded-lg">
                     <div className="flex items-center gap-3">
                       <Shield className="w-5 h-5 text-low-risk-green" />
                       <span className="text-low-risk-green font-bold tracking-wider">NOMINAL</span>
                     </div>
                     <span className="font-mono text-2xl text-low-risk-green font-bold">{lowRiskCount}</span>
                   </div>
                 </div>

                 <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center text-xs text-secondary-foreground font-mono">
                   <span>SYNC: AUTO</span>
                   <span>LAT: 28.5721° N</span>
                 </div>
               </div>
             </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-accent-cyan">Scroll to Scan</span>
          <ChevronDown className="w-4 h-4 text-accent-cyan" />
        </motion.div>
      </section>

      {/* --- ALERT BANNER (Sticky) --- */}
      <div className="sticky top-0 z-40 w-full">
        <AnimatePresence>
          {highRiskCount > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <AlertBanner
                message={`WARNING: ${highRiskCount} HAZARDOUS OBJECTS DETECTED ON APPROACH VECTOR`}
                type="high"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- TELEMETRY STRIP --- */}
      <section className="w-full border-y border-white/10 bg-secondary/30 backdrop-blur-md overflow-hidden">
        <div className="max-w-[120rem] mx-auto">
          <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="flex-1 p-6 flex items-center justify-between group hover:bg-white/5 transition-colors">
              <div>
                <div className="text-xs text-accent-cyan uppercase tracking-widest mb-1">Total Objects</div>
                <div className="text-3xl font-heading font-bold text-white">{asteroids.length}</div>
              </div>
              <Satellite className="w-8 h-8 text-white/20 group-hover:text-accent-cyan transition-colors" />
            </div>
            <div className="flex-1 p-6 flex items-center justify-between group hover:bg-white/5 transition-colors">
              <div>
                <div className="text-xs text-accent-cyan uppercase tracking-widest mb-1">Data Source</div>
                <div className="text-3xl font-heading font-bold text-white">NASA NeoWs</div>
              </div>
              <Radio className="w-8 h-8 text-white/20 group-hover:text-accent-cyan transition-colors" />
            </div>
            <div className="flex-1 p-6 flex items-center justify-between group hover:bg-white/5 transition-colors">
              <div>
                <div className="text-xs text-accent-cyan uppercase tracking-widest mb-1">Last Update</div>
                <div className="text-3xl font-heading font-bold text-white">T-MINUS 00:00</div>
              </div>
              <Activity className="w-8 h-8 text-white/20 group-hover:text-accent-cyan transition-colors" />
            </div>
          </div>
        </div>
      </section>

      {/* --- MAIN DASHBOARD SECTION --- */}
      <section id="dashboard" className="relative w-full max-w-[120rem] mx-auto px-6 py-24">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="w-2 h-2 bg-accent-electric-blue rounded-full animate-ping" />
              <span className="text-accent-electric-blue font-mono text-sm tracking-widest">LIVE FEED</span>
            </motion.div>
            <h2 className="font-heading text-5xl md:text-6xl font-bold text-white mb-4">
              <GlitchText text="OBJECT TRACKING" />
            </h2>
            <p className="font-paragraph text-secondary-foreground max-w-xl text-lg">
              Real-time visualization of Near-Earth Objects. Select a target for detailed telemetry analysis.
            </p>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-2 p-1 bg-secondary/50 border border-white/10 rounded-lg backdrop-blur-sm">
            {(['all', 'high', 'medium', 'low'] as const).map((risk) => (
              <button
                key={risk}
                onClick={() => setSelectedRisk(risk)}
                className={`
                  px-6 py-3 rounded-md font-paragraph text-sm font-medium uppercase tracking-wider transition-all duration-300
                  ${selectedRisk === risk 
                    ? 'bg-accent-cyan text-background shadow-[0_0_15px_rgba(0,188,212,0.4)]' 
                    : 'text-secondary-foreground hover:text-white hover:bg-white/5'}
                `}
              >
                {risk}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Content */}
        <div className="min-h-[600px] relative">
          {/* Scan Line Effect */}
          <div className="scan-line" />
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-[400px] gap-4">
              <div className="w-16 h-16 border-4 border-accent-cyan border-t-transparent rounded-full animate-spin" />
              <div className="text-accent-cyan font-mono animate-pulse">ESTABLISHING UPLINK...</div>
            </div>
          ) : filteredAsteroids.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredAsteroids.map((asteroid, index) => (
                  <motion.div
                    key={asteroid._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group"
                  >
                    <div className="relative h-full transition-transform duration-300 group-hover:-translate-y-2">
                      {/* Decorative Corners */}
                      <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-accent-cyan/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-accent-cyan/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-accent-cyan/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-accent-cyan/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <AsteroidCard
                        asteroid={asteroid}
                        onClick={() => setSelectedAsteroid(asteroid)}
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32 border border-dashed border-white/10 rounded-2xl bg-secondary/20"
            >
              <Shield className="w-24 h-24 text-accent-cyan/20 mb-6" />
              <h3 className="text-2xl font-heading text-white mb-2">SECTOR CLEAR</h3>
              <p className="font-paragraph text-secondary-foreground">No objects detected matching current filter parameters.</p>
            </motion.div>
          )}
        </div>
      </section>

      <SectionDivider />

      {/* --- RADAR SYSTEM SECTION --- */}
      <section className="relative w-full max-w-[120rem] mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-4"
        >
          <div className="w-2 h-2 bg-accent-electric-blue rounded-full animate-ping" />
          <span className="text-accent-electric-blue font-mono text-sm tracking-widest">DETECTION ARRAY</span>
        </motion.div>
        <h2 className="font-heading text-5xl md:text-6xl font-bold text-white mb-12">
          <GlitchText text="RADAR TRACKING" />
        </h2>
        
        <RadarSystem 
          asteroids={filteredAsteroids}
          selectedAsteroid={selectedAsteroid}
          onAsteroidSelect={setSelectedAsteroid}
        />
      </section>

      <SectionDivider />

      {/* --- VISUAL BREATHER / MISSION SECTION --- */}
      <section className="relative w-full py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://static.wixstatic.com/media/d5a106_9b4ed2fbabb4453eb3a707464d2ee9ac~mv2.png?originWidth=768&originHeight=768" 
            alt="Deep Space" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />
        </div>

        <div className="relative z-10 max-w-[120rem] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-heading text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              PLANETARY<br />
              <span className="text-accent-cyan">DEFENSE</span><br />
              INITIATIVE
            </h2>
            <div className="space-y-6 font-paragraph text-lg text-secondary-foreground/90">
              <p>
                The Cosmic Watch network utilizes advanced radar cross-section analysis and orbital determination algorithms to predict potential impact events with 99.9% accuracy.
              </p>
              <p>
                Our mission is constant vigilance. By monitoring the Near-Earth Object (NEO) population, we provide the critical lead time necessary for planetary defense measures.
              </p>
            </div>
            
            <div className="mt-12 grid grid-cols-2 gap-8">
              <div>
                <div className="text-4xl font-heading font-bold text-white mb-2">24/7</div>
                <div className="text-sm text-accent-cyan uppercase tracking-wider">Surveillance</div>
              </div>
              <div>
                <div className="text-4xl font-heading font-bold text-white mb-2">100%</div>
                <div className="text-sm text-accent-cyan uppercase tracking-wider">Coverage</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-square rounded-full border border-accent-cyan/20 relative flex items-center justify-center">
              <div className="absolute inset-0 border border-accent-cyan/10 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-4 border border-dashed border-accent-cyan/30 rounded-full animate-spin-slow" />
              <div className="w-3/4 h-3/4 rounded-full bg-gradient-to-br from-accent-electric-blue/10 to-transparent backdrop-blur-md flex items-center justify-center border border-white/10">
                 <Rocket className="w-24 h-24 text-accent-cyan" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- MODAL (Holographic Style) --- */}
      <AnimatePresence>
        {selectedAsteroid && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedAsteroid(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-[#0A0C14] w-full max-w-4xl border border-accent-cyan/30 shadow-[0_0_50px_rgba(0,188,212,0.15)] relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-secondary/50 p-6 border-b border-white/10 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <RiskBadge risk={selectedAsteroid.riskLevel || 'low'} />
                    <span className="text-xs font-mono text-secondary-foreground uppercase">ID: {selectedAsteroid._id}</span>
                  </div>
                  <h3 className="font-heading text-4xl font-bold text-white tracking-tight">
                    {selectedAsteroid.asteroidName}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedAsteroid(null)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-secondary/30 p-4 rounded border-l-2 border-accent-cyan">
                    <div className="text-xs text-accent-cyan uppercase tracking-widest mb-1">Approach Date</div>
                    <div className="text-2xl font-mono text-white">
                      {selectedAsteroid.closeApproachDate
                        ? new Date(selectedAsteroid.closeApproachDate).toLocaleDateString()
                        : 'N/A'}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-secondary/30 p-4 rounded">
                      <div className="text-xs text-secondary-foreground uppercase mb-1">Diameter</div>
                      <div className="text-xl font-mono text-white">
                        {selectedAsteroid.estimatedDiameter?.toFixed(2) || 'N/A'} <span className="text-sm text-secondary-foreground">km</span>
                      </div>
                    </div>
                    <div className="bg-secondary/30 p-4 rounded">
                      <div className="text-xs text-secondary-foreground uppercase mb-1">Velocity</div>
                      <div className="text-xl font-mono text-white">
                        {selectedAsteroid.relativeVelocity?.toLocaleString() || 'N/A'} <span className="text-sm text-secondary-foreground">km/h</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-secondary/30 p-4 rounded">
                    <div className="text-xs text-secondary-foreground uppercase mb-1">Miss Distance</div>
                    <div className="text-xl font-mono text-white">
                      {selectedAsteroid.missDistance?.toLocaleString() || 'N/A'} <span className="text-sm text-secondary-foreground">km</span>
                    </div>
                    <div className="w-full h-1 bg-white/10 mt-3 rounded-full overflow-hidden">
                      <div className="h-full bg-accent-cyan w-[45%]" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between">
                  <div className="bg-black/40 p-6 rounded-lg border border-white/5 h-full flex flex-col items-center justify-center text-center">
                    <div className="mb-4">
                      {selectedAsteroid.isPotentiallyHazardous ? (
                        <AlertTriangle className="w-16 h-16 text-high-risk-red animate-pulse" />
                      ) : (
                        <Shield className="w-16 h-16 text-low-risk-green" />
                      )}
                    </div>
                    <div className="text-lg font-bold text-white mb-2">
                      {selectedAsteroid.isPotentiallyHazardous ? 'POTENTIALLY HAZARDOUS' : 'NON-HAZARDOUS'}
                    </div>
                    <p className="text-sm text-secondary-foreground">
                      {selectedAsteroid.isPotentiallyHazardous 
                        ? 'Object trajectory intersects Earth orbit within hazardous parameters. Continued monitoring required.'
                        : 'Object poses no immediate threat to planetary safety. Routine tracking maintained.'}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => setSelectedAsteroid(null)}
                    className="mt-6 w-full bg-accent-electric-blue text-background px-6 py-4 font-heading font-bold uppercase tracking-wider hover:bg-accent-cyan transition-colors"
                  >
                    Acknowledge & Close
                  </button>
                </div>
              </div>
              
              {/* Decorative Modal Footer */}
              <div className="h-2 w-full bg-gradient-to-r from-transparent via-accent-cyan/50 to-transparent" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
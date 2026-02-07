import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function MoonAsteroidScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const moonRef = useRef<THREE.Mesh | null>(null);
  const asteroidRef = useRef<THREE.Mesh | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const moonGlowRef = useRef<THREE.Mesh | null>(null);
  const asteroidGlowRef = useRef<THREE.Mesh | null>(null);
  const ringsRef = useRef<THREE.Group | null>(null);
  const pointLight1Ref = useRef<THREE.PointLight | null>(null);
  const pointLight2Ref = useRef<THREE.PointLight | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00ffff, 1.5);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    pointLight1Ref.current = pointLight;

    const pointLight2 = new THREE.PointLight(0xbf00ff, 0.8);
    pointLight2.position.set(-5, -5, 3);
    scene.add(pointLight2);
    pointLight2Ref.current = pointLight2;

    // Create Moon
    const moonGeometry = new THREE.SphereGeometry(1.2, 64, 64);
    const moonMaterial = new THREE.MeshPhongMaterial({
      color: 0xcccccc,
      emissive: 0x333333,
      shininess: 5,
    });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set(-1.5, 0, 0);
    scene.add(moon);
    moonRef.current = moon;

    // Add glow effect to moon
    const moonGlowGeometry = new THREE.SphereGeometry(1.3, 32, 32);
    const moonGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
    });
    const moonGlow = new THREE.Mesh(moonGlowGeometry, moonGlowMaterial);
    moonGlow.position.copy(moon.position);
    scene.add(moonGlow);
    moonGlowRef.current = moonGlow;

    // Add moon craters (bumps)
    const craterGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const craterMaterial = new THREE.MeshPhongMaterial({
      color: 0x999999,
      emissive: 0x222222,
    });
    const craters = [
      { x: 0.3, y: 0.4, z: 1 },
      { x: -0.5, y: -0.3, z: 1 },
      { x: 0.1, y: -0.8, z: 0.8 },
      { x: -0.8, y: 0.2, z: 0.9 },
    ];
    craters.forEach((crater) => {
      const craterMesh = new THREE.Mesh(craterGeometry, craterMaterial);
      craterMesh.position.set(
        moon.position.x + crater.x,
        moon.position.y + crater.y,
        moon.position.z + crater.z
      );
      craterMesh.scale.set(0.6, 0.6, 0.3);
      scene.add(craterMesh);
    });

    // Create Asteroid (irregular shape)
    const asteroidGeometry = new THREE.IcosahedronGeometry(0.6, 4);
    // Add some noise to make it irregular
    const positionAttribute = asteroidGeometry.getAttribute('position');
    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const y = positionAttribute.getY(i);
      const z = positionAttribute.getZ(i);
      const noise = 0.1;
      positionAttribute.setXYZ(
        i,
        x + (Math.random() - 0.5) * noise,
        y + (Math.random() - 0.5) * noise,
        z + (Math.random() - 0.5) * noise
      );
    }
    positionAttribute.needsUpdate = true;
    asteroidGeometry.computeVertexNormals();

    const asteroidMaterial = new THREE.MeshPhongMaterial({
      color: 0x8b4513,
      emissive: 0x4a2511,
      shininess: 3,
      wireframe: false,
    });
    const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
    asteroid.position.set(1.8, 0.5, -0.5);
    scene.add(asteroid);
    asteroidRef.current = asteroid;

    // Add glow effect to asteroid
    const asteroidGlowGeometry = new THREE.IcosahedronGeometry(0.7, 4);
    const asteroidGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0xff6600,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide,
    });
    const asteroidGlow = new THREE.Mesh(asteroidGlowGeometry, asteroidGlowMaterial);
    asteroidGlow.position.copy(asteroid.position);
    scene.add(asteroidGlow);
    asteroidGlowRef.current = asteroidGlow;

    // Create particle field
    const particleCount = 150;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 12;
      particlePositions[i + 1] = (Math.random() - 0.5) * 12;
      particlePositions[i + 2] = (Math.random() - 0.5) * 12;

      particleVelocities[i] = (Math.random() - 0.5) * 0.02;
      particleVelocities[i + 1] = (Math.random() - 0.5) * 0.02;
      particleVelocities[i + 2] = (Math.random() - 0.5) * 0.02;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x00ffff,
      size: 0.05,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // Create orbital rings
    const ringsGroup = new THREE.Group();
    ringsRef.current = ringsGroup;

    // Multiple rotating rings
    for (let r = 0; r < 3; r++) {
      const ringGeometry = new THREE.BufferGeometry();
      const ringPoints = [];
      const radius = 2.5 + r * 0.8;
      const segments = 128;
      
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        ringPoints.push(
          Math.cos(angle) * radius,
          Math.sin(angle) * (0.2 + r * 0.1),
          Math.sin(angle) * radius
        );
      }
      
      ringGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(ringPoints), 3));
      const ringColor = r === 0 ? 0x00bcd4 : r === 1 ? 0x00ffff : 0xbf00ff;
      const ringMaterial = new THREE.LineBasicMaterial({ 
        color: ringColor, 
        linewidth: 1,
        transparent: true,
        opacity: 0.6 - r * 0.15,
      });
      const ring = new THREE.Line(ringGeometry, ringMaterial);
      ring.rotation.x = r * 0.3;
      ring.rotation.z = r * 0.2;
      ringsGroup.add(ring);
    }
    
    scene.add(ringsGroup);

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Rotate moon
      if (moonRef.current) {
        moonRef.current.rotation.x += 0.0005;
        moonRef.current.rotation.y += 0.0008;
      }

      // Pulse moon glow
      if (moonGlowRef.current) {
        moonGlowRef.current.position.copy(moonRef.current!.position);
        const glowPulse = Math.sin(Date.now() * 0.003) * 0.05 + 0.15;
        (moonGlowRef.current.material as THREE.MeshBasicMaterial).opacity = glowPulse;
      }

      // Rotate and orbit asteroid
      if (asteroidRef.current) {
        asteroidRef.current.rotation.x += 0.008;
        asteroidRef.current.rotation.y += 0.012;
        asteroidRef.current.rotation.z += 0.006;

        // Orbital motion
        const time = Date.now() * 0.0005;
        asteroidRef.current.position.x = 1.8 + Math.cos(time) * 0.8;
        asteroidRef.current.position.y = 0.5 + Math.sin(time * 0.7) * 0.6;
        asteroidRef.current.position.z = -0.5 + Math.sin(time * 0.5) * 0.4;
      }

      // Pulse asteroid glow
      if (asteroidGlowRef.current) {
        asteroidGlowRef.current.position.copy(asteroidRef.current!.position);
        const asteroidGlowPulse = Math.sin(Date.now() * 0.004 + 1) * 0.08 + 0.1;
        (asteroidGlowRef.current.material as THREE.MeshBasicMaterial).opacity = asteroidGlowPulse;
      }

      // Rotate orbital rings
      if (ringsRef.current) {
        ringsRef.current.rotation.x += 0.0002;
        ringsRef.current.rotation.y += 0.0003;
        ringsRef.current.rotation.z += 0.0001;
      }

      // Animate lights
      if (pointLight1Ref.current) {
        const lightTime = Date.now() * 0.001;
        pointLight1Ref.current.position.x = 5 + Math.sin(lightTime) * 2;
        pointLight1Ref.current.position.y = 5 + Math.cos(lightTime * 0.7) * 2;
        pointLight1Ref.current.intensity = 1.5 + Math.sin(lightTime * 0.5) * 0.5;
      }

      if (pointLight2Ref.current) {
        const lightTime = Date.now() * 0.0008;
        pointLight2Ref.current.position.x = -5 + Math.cos(lightTime) * 2;
        pointLight2Ref.current.position.y = -5 + Math.sin(lightTime * 0.6) * 2;
        pointLight2Ref.current.intensity = 0.8 + Math.cos(lightTime * 0.4) * 0.4;
      }

      // Update particles
      if (particlesRef.current) {
        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i] += particleVelocities[i];
          positions[i + 1] += particleVelocities[i + 1];
          positions[i + 2] += particleVelocities[i + 2];

          // Wrap around
          if (positions[i] > 6) positions[i] = -6;
          if (positions[i] < -6) positions[i] = 6;
          if (positions[i + 1] > 6) positions[i + 1] = -6;
          if (positions[i + 1] < -6) positions[i + 1] = 6;
          if (positions[i + 2] > 6) positions[i + 2] = -6;
          if (positions[i + 2] < -6) positions[i + 2] = 6;
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      renderer.dispose();
      moonGeometry.dispose();
      moonMaterial.dispose();
      moonGlowGeometry.dispose();
      moonGlowMaterial.dispose();
      asteroidGeometry.dispose();
      asteroidMaterial.dispose();
      asteroidGlowGeometry.dispose();
      asteroidGlowMaterial.dispose();
      craterGeometry.dispose();
      craterMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full rounded-2xl overflow-hidden border border-accent-cyan/30 bg-black/40 backdrop-blur-sm"
      style={{ minHeight: '500px' }}
    />
  );
}

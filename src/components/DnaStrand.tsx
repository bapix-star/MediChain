"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export function DnaStrand() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    
    // Scene setup
    const scene = new THREE.Scene();
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const dnaGroup = new THREE.Group();

    // Holographic/Sci-fi Materials
    const backboneMat = new THREE.MeshPhongMaterial({ 
      color: 0x00f0ff, 
      emissive: 0x00aaff,
      emissiveIntensity: 1.2,
      shininess: 100,
      transparent: true,
      opacity: 0.9,
    });
    
    const bondMat = new THREE.MeshPhongMaterial({ 
      color: 0x0088ff,
      emissive: 0x0044ff,
      emissiveIntensity: 0.8,
      transparent: true, 
      opacity: 0.5 
    });

    camera.position.z = 25;
    const vFOV = THREE.MathUtils.degToRad(camera.fov);
    const visibleHeight = 2 * Math.tan(vFOV / 2) * camera.position.z;
    
    // Generate high-density DNA pairs
    const numPairs = 120; // Increased density
    const spacingY = visibleHeight / numPairs;
    const radius = 1.5;
    const frequency = 0.15; 

    const sphereGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const cylinderGeo = new THREE.CylinderGeometry(0.02, 0.02, radius * 2, 8);

    for (let i = 0; i < numPairs; i++) {
      const y = (i * spacingY) - (visibleHeight / 2);
      const angle = i * frequency;

      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;

      const x2 = Math.cos(angle + Math.PI) * radius;
      const z2 = Math.sin(angle + Math.PI) * radius;

      // Backbone nodes
      const atom1 = new THREE.Mesh(sphereGeo, backboneMat);
      atom1.position.set(x1, y, z1);
      dnaGroup.add(atom1);

      const atom2 = new THREE.Mesh(sphereGeo, backboneMat);
      atom2.position.set(x2, y, z2);
      dnaGroup.add(atom2);

      // Only draw connecting bonds occasionally for a tech/data look
      if (i % 3 === 0) {
        const bond = new THREE.Mesh(cylinderGeo, bondMat);
        bond.position.set(0, y, 0);
        bond.rotation.x = Math.PI / 2; 
        bond.rotation.z = angle;       
        dnaGroup.add(bond);
      }
    }

    // Blockchain Data Particles (Floating dust/data around DNA)
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    
    for(let i = 0; i < particleCount * 3; i+=3) {
      // Random positions around the DNA cylinder
      const r = radius + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * visibleHeight;
      
      particlePositions[i] = Math.cos(theta) * r;
      particlePositions[i+1] = y;
      particlePositions[i+2] = Math.sin(theta) * r;
    }
    
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    // Small glowing square particles
    const particleMat = new THREE.PointsMaterial({
      color: 0x00ffff,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    dnaGroup.add(particleSystem);

    scene.add(dnaGroup);

    // Dynamic Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0x00ffff, 4, 20);
    pointLight1.position.set(2, 0, 5);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x0088ff, 4, 20);
    pointLight2.position.set(-2, 0, 5);
    scene.add(pointLight2);

    // Animation & Scroll Sync
    let frameId: number;
    let targetRotation = 0;
    
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollFactor = -rect.top * 0.005; 
      targetRotation = scrollFactor;
    };

    window.addEventListener("scroll", handleScroll);

    let autoRotation = 0;
    let time = 0;

    function animate() {
      frameId = requestAnimationFrame(animate);
      
      autoRotation += 0.003;
      time += 0.01;
      
      // Smooth scroll rotation
      dnaGroup.rotation.y += ((targetRotation + autoRotation) - dnaGroup.rotation.y) * 0.1;
      
      // Float DNA slightly up and down
      dnaGroup.position.y = Math.sin(time) * 0.5;
      
      // Slowly rotate particles independently
      particleSystem.rotation.y = -time * 0.2;
      
      // Pulse particle opacity for "data transmission" effect
      particleMat.opacity = 0.3 + (Math.sin(time * 5) * 0.3);
      
      renderer.render(scene, camera);
    }

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);
    
    // Initial calls
    handleScroll();
    animate();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[120px] -ml-[60px] pointer-events-none z-0"
    >
      {/* ThreeJS Canvas will be injected here */}
    </div>
  );
}

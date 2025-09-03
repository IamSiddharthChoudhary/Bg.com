"use client";

import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { vertexShader, godRaysShader } from "@/app/lib/shders";
import { hexToRgb } from "@/app/lib/helpFuncs";
import Controls from "@/components/controls";
import type { GodRaysArgs } from "@/app/lib/designs";

export default function GodRaysComponent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [rayIntensity, setRayIntensity] = useState(1.0);
  const [animationSpeed, setAnimationSpeed] = useState(1.0);
  const [rayCount, setRayCount] = useState(12);
  const [lightRadius, setLightRadius] = useState(1.5);
  const [backgroundColor1, setBackgroundColor1] = useState("#0d1a33");
  const [backgroundColor2, setBackgroundColor2] = useState("#334d80");
  const [rayColor, setRayColor] = useState("#fff9cc");
  const [cloudDensity, setCloudDensity] = useState(0.3);
  const [showCodeModal, setShowCodeModal] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    canvasRef.current.innerHTML = "";

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    canvasRef.current.appendChild(renderer.domElement);

    const rect = canvasRef.current.getBoundingClientRect();
    renderer.setSize(rect.width || 800, rect.height || 600);

    const [bgR1, bgG1, bgB1] = hexToRgb(backgroundColor1);
    const [bgR2, bgG2, bgB2] = hexToRgb(backgroundColor2);
    const [rayR, rayG, rayB] = hexToRgb(rayColor);

    const godRaysMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: godRaysShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: {
          value: new THREE.Vector2(rect.width || 800, rect.height || 600),
        },
        uRayIntensity: { value: rayIntensity },
        uAnimationSpeed: { value: animationSpeed },
        uRayCount: { value: rayCount },
        uLightRadius: { value: lightRadius },
        uBackgroundColor1: { value: new THREE.Vector3(bgR1, bgG1, bgB1) },
        uBackgroundColor2: { value: new THREE.Vector3(bgR2, bgG2, bgB2) },
        uRayColor: { value: new THREE.Vector3(rayR, rayG, rayB) },
        uCloudDensity: { value: cloudDensity },
      },
    });

    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), godRaysMaterial);
    scene.add(quad);

    let frame = 0;
    const animate = () => {
      frame++;
      godRaysMaterial.uniforms.iTime.value = frame * 0.01;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height);
      godRaysMaterial.uniforms.iResolution.value.set(rect.width, rect.height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      godRaysMaterial.dispose();
      if (canvasRef.current) canvasRef.current.innerHTML = "";
    };
  }, [
    rayIntensity,
    animationSpeed,
    rayCount,
    lightRadius,
    backgroundColor1,
    backgroundColor2,
    rayColor,
    cloudDensity,
  ]);

  const states: GodRaysArgs = {
    rayIntensity,
    animationSpeed,
    rayCount,
    lightRadius,
    backgroundColor1,
    backgroundColor2,
    rayColor,
    cloudDensity,
    setRayIntensity,
    setAnimationSpeed,
    setRayCount,
    setLightRadius,
    setBackgroundColor1,
    setBackgroundColor2,
    setRayColor,
    setCloudDensity,
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-black"
    >
      <div ref={canvasRef} className="fixed top-0 left-0 w-full h-full" />
      <Controls index={1} states={states} />
    </div>
  );
}

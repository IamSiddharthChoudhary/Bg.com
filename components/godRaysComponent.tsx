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

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const animationIdRef = useRef<number | null>(null);

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

    sceneRef.current = scene;
    rendererRef.current = renderer;
    materialRef.current = godRaysMaterial;

    let frame = 0;
    const animate = () => {
      frame++;
      if (materialRef.current) {
        materialRef.current.uniforms.iTime.value = frame * 0.01;
      }
      if (rendererRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, camera);
      }
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!canvasRef.current || !rendererRef.current || !materialRef.current)
        return;
      const rect = canvasRef.current.getBoundingClientRect();
      rendererRef.current.setSize(rect.width, rect.height);
      materialRef.current.uniforms.iResolution.value.set(
        rect.width,
        rect.height
      );
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (materialRef.current) {
        materialRef.current.dispose();
      }
      if (canvasRef.current) {
        canvasRef.current.innerHTML = "";
      }
    };
  }, []);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uRayIntensity.value = rayIntensity;
    }
  }, [rayIntensity]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uAnimationSpeed.value = animationSpeed;
    }
  }, [animationSpeed]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uRayCount.value = rayCount;
    }
  }, [rayCount]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uLightRadius.value = lightRadius;
    }
  }, [lightRadius]);

  useEffect(() => {
    if (materialRef.current) {
      const [bgR1, bgG1, bgB1] = hexToRgb(backgroundColor1);
      materialRef.current.uniforms.uBackgroundColor1.value.set(
        bgR1,
        bgG1,
        bgB1
      );
    }
  }, [backgroundColor1]);

  useEffect(() => {
    if (materialRef.current) {
      const [bgR2, bgG2, bgB2] = hexToRgb(backgroundColor2);
      materialRef.current.uniforms.uBackgroundColor2.value.set(
        bgR2,
        bgG2,
        bgB2
      );
    }
  }, [backgroundColor2]);

  useEffect(() => {
    if (materialRef.current) {
      const [rayR, rayG, rayB] = hexToRgb(rayColor);
      materialRef.current.uniforms.uRayColor.value.set(rayR, rayG, rayB);
    }
  }, [rayColor]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uCloudDensity.value = cloudDensity;
    }
  }, [cloudDensity]);

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

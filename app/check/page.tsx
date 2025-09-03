"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return [r, g, b];
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const godRaysShader = `
  precision highp float;
  uniform float iTime;
  uniform vec2 iResolution;
  uniform float uRayIntensity;
  uniform float uAnimationSpeed;
  uniform float uRayCount;
  uniform float uLightRadius;
  uniform vec3 uBackgroundColor1;
  uniform vec3 uBackgroundColor2;
  uniform vec3 uRayColor;
  uniform float uCloudDensity;
  varying vec2 vUv;

  float noise(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      for (int i = 0; i < 4; i++) {
          value += amplitude * noise(p);
          p *= 2.0;
          amplitude *= 0.5;
      }
      return value;
  }

  float volumetricRays(vec2 uv, vec2 lightPos, float time) {
      vec2 dir = normalize(lightPos - uv);
      float dist = length(lightPos - uv);
      float rayIntensity = 0.0;
      for (int i = 0; i < 16; i++) {
          float t = float(i) / 16.0;
          vec2 samplePos = uv + dir * t * dist;
          float noiseVal = fbm(samplePos * 3.0 + time * 0.1);
          float rayAngle = atan(samplePos.y - lightPos.y, samplePos.x - lightPos.x);
          float rayPattern = sin(rayAngle * uRayCount + time) * 0.5 + 0.5;
          rayPattern = pow(rayPattern, 3.0);
          float falloff = 1.0 - smoothstep(0.0, dist, length(samplePos - lightPos));
          rayIntensity += rayPattern * noiseVal * falloff * 0.04 * uRayIntensity;
      }
      return rayIntensity;
  }

  void main() {
      vec2 uv = (vUv - 0.5) * vec2(iResolution.x / iResolution.y, 1.0);
      float time = iTime * uAnimationSpeed;
      float lightAngle = time * 0.2;
      vec2 lightPos = vec2(
          cos(lightAngle) * uLightRadius,
          sin(lightAngle) * uLightRadius * 0.8 + 0.3
      );
      vec3 backgroundColor = mix(uBackgroundColor1, uBackgroundColor2, 1.0 - length(uv));
      float clouds = fbm(uv * 2.0 + time * 0.05);
      backgroundColor = mix(backgroundColor, vec3(0.4, 0.4, 0.6), clouds * uCloudDensity);
      float rays = volumetricRays(uv, lightPos, time);
      vec3 color = backgroundColor + uRayColor * rays;
      gl_FragColor = vec4(color, 1.0);
  }
`;

export default function GodRaysComponent() {
  const canvasRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    canvasRef.current.innerHTML = ""; // clear hot-reload leftovers
    canvasRef.current.appendChild(renderer.domElement);

    // Scene & camera
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Size
    const rect = canvasRef.current.getBoundingClientRect();
    renderer.setSize(rect.width || 800, rect.height || 600);

    // Colors
    const [r1, g1, b1] = hexToRgb("#0d1a33");
    const [r2, g2, b2] = hexToRgb("#334d80");

    // Shader
    const godRaysMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: godRaysShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(rect.width, rect.height) },
        uRayIntensity: { value: 1.0 },
        uAnimationSpeed: { value: 1.0 },
        uRayCount: { value: 12.0 },
        uLightRadius: { value: 1.5 },
        uBackgroundColor1: { value: new THREE.Vector3(r1, g1, b1) },
        uBackgroundColor2: { value: new THREE.Vector3(r2, g2, b2) },
        uRayColor: { value: new THREE.Vector3(1, 1, 1) },
        uCloudDensity: { value: 0.3 },
      },
    });

    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), godRaysMaterial);
    scene.add(quad);

    // Animate
    let frame = 0;
    const animate = () => {
      frame++;
      godRaysMaterial.uniforms.iTime.value = frame * 0.01;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // Resize
    const handleResize = () => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height);
      godRaysMaterial.uniforms.iResolution.value.set(rect.width, rect.height);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      godRaysMaterial.dispose();
      if (canvasRef.current) {
        canvasRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full bg-black"
    />
  );
}

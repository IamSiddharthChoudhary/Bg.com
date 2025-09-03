"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { displayShader, fluidShader, vertexShader } from "@/app/lib/shders";
import Controls from "@/components/controls";
import type { SilkArgs } from "@/app/lib/designs";

function hexToRgb(hex: string) {
  const r = Number.parseInt(hex.slice(1, 3), 16) / 255;
  const g = Number.parseInt(hex.slice(3, 5), 16) / 255;
  const b = Number.parseInt(hex.slice(5, 7), 16) / 255;
  return [r, g, b] as const;
}

export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  const materialsRef = useRef<{
    fluidMaterial: THREE.ShaderMaterial | null;
    displayMaterial: THREE.ShaderMaterial | null;
  }>({ fluidMaterial: null, displayMaterial: null });

  const mouseRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0, lastMoveTime: 0 });

  const [brushSize, setBrushSize] = useState(25);
  const [brushStrength, setBrushStrength] = useState(0.5);
  const [distortionAmount, setDistortionAmount] = useState(2.5);
  const [color1, setColor1] = useState("#b8fff7");
  const [color2, setColor2] = useState("#6e3466");
  const [color3, setColor3] = useState("#0133ff");
  const [color4, setColor4] = useState("#66d1fe");
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [isMouseDistortionOn, setIsMouseDistortionOn] = useState(true);

  useEffect(() => {
    if (materialsRef.current.fluidMaterial) {
      materialsRef.current.fluidMaterial.uniforms.uBrushSize.value = brushSize;
    }
  }, [brushSize]);

  useEffect(() => {
    if (materialsRef.current.fluidMaterial) {
      materialsRef.current.fluidMaterial.uniforms.uBrushStrength.value =
        brushStrength;
    }
  }, [brushStrength]);

  useEffect(() => {
    if (materialsRef.current.displayMaterial) {
      materialsRef.current.displayMaterial.uniforms.uDistortionAmount.value =
        distortionAmount;
    }
  }, [distortionAmount]);

  useEffect(() => {
    if (materialsRef.current.displayMaterial) {
      materialsRef.current.displayMaterial.uniforms.uColor1.value.set(
        ...hexToRgb(color1)
      );
    }
  }, [color1]);

  useEffect(() => {
    if (materialsRef.current.displayMaterial) {
      materialsRef.current.displayMaterial.uniforms.uColor2.value.set(
        ...hexToRgb(color2)
      );
    }
  }, [color2]);

  useEffect(() => {
    if (materialsRef.current.displayMaterial) {
      materialsRef.current.displayMaterial.uniforms.uColor3.value.set(
        ...hexToRgb(color3)
      );
    }
  }, [color3]);

  useEffect(() => {
    if (materialsRef.current.displayMaterial) {
      materialsRef.current.displayMaterial.uniforms.uColor4.value.set(
        ...hexToRgb(color4)
      );
    }
  }, [color4]);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current = renderer;

    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasRef.current.appendChild(renderer.domElement);

    const fluidTarget1 = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight,
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
      }
    );

    const fluidTarget2 = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight,
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
      }
    );

    let currentFluidTarget = fluidTarget1;
    let previousFluidTarget = fluidTarget2;
    let frameCount = 0;

    const fluidMaterial = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        iMouse: { value: new THREE.Vector4(0, 0, 0, 0) },
        iFrame: { value: 0 },
        iPreviousFrame: { value: null },
        uBrushSize: { value: brushSize },
        uBrushStrength: { value: brushStrength },
        uFluidDecay: { value: 0.98 },
        uTrailLength: { value: 0.8 },
        uStopDecay: { value: 0.85 },
      },
      vertexShader: vertexShader,
      fragmentShader: fluidShader,
    });

    const displayMaterial = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        iFluid: { value: null },
        uDistortionAmount: { value: distortionAmount },
        uColor1: { value: new THREE.Vector3(...hexToRgb(color1)) },
        uColor2: { value: new THREE.Vector3(...hexToRgb(color2)) },
        uColor3: { value: new THREE.Vector3(...hexToRgb(color3)) },
        uColor4: { value: new THREE.Vector3(...hexToRgb(color4)) },
        uColorIntensity: { value: 1.0 },
        uSoftness: { value: 1.0 },
      },
      vertexShader: vertexShader,
      fragmentShader: displayShader,
    });

    materialsRef.current = { fluidMaterial, displayMaterial };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const fluidPlane = new THREE.Mesh(geometry, fluidMaterial);
    const displayPlane = new THREE.Mesh(geometry, displayMaterial);

    function animate() {
      requestAnimationFrame(animate);

      const time = performance.now() * 0.001;
      fluidMaterial.uniforms.iTime.value = time;
      displayMaterial.uniforms.iTime.value = time;
      fluidMaterial.uniforms.iFrame.value = frameCount;

      if (performance.now() - mouseRef.current.lastMoveTime > 100) {
        fluidMaterial.uniforms.iMouse.value.set(0, 0, 0, 0);
      }

      fluidMaterial.uniforms.iPreviousFrame.value = previousFluidTarget.texture;

      renderer.setRenderTarget(currentFluidTarget);
      renderer.render(fluidPlane, camera);

      displayMaterial.uniforms.iFluid.value = currentFluidTarget.texture;

      renderer.setRenderTarget(null);
      renderer.render(displayPlane, camera);

      const temp = currentFluidTarget;
      currentFluidTarget = previousFluidTarget;
      previousFluidTarget = temp;

      frameCount++;
    }

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      renderer.setSize(width, height);
      fluidMaterial.uniforms.iResolution.value.set(width, height);
      displayMaterial.uniforms.iResolution.value.set(width, height);

      fluidTarget1.setSize(width, height);
      fluidTarget2.setSize(width, height);
      frameCount = 0;
    };

    window.addEventListener("resize", handleResize);
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      fluidTarget1.dispose();
      fluidTarget2.dispose();
      geometry.dispose();
      fluidMaterial.dispose();
      displayMaterial.dispose();
      materialsRef.current = { fluidMaterial: null, displayMaterial: null };
      rendererRef.current = null;
    };
  }, []);

  useEffect(() => {
    const canvas = rendererRef.current?.domElement;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isMouseDistortionOn || !materialsRef.current.fluidMaterial) return;

      const rect = canvas.getBoundingClientRect();

      mouseRef.current.prevX = mouseRef.current.x;
      mouseRef.current.prevY = mouseRef.current.y;

      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = rect.height - (e.clientY - rect.top);
      mouseRef.current.lastMoveTime = performance.now();

      materialsRef.current.fluidMaterial.uniforms.iMouse.value.set(
        mouseRef.current.x,
        mouseRef.current.y,
        mouseRef.current.prevX,
        mouseRef.current.prevY
      );
    };

    const handleMouseLeave = () => {
      if (materialsRef.current.fluidMaterial) {
        materialsRef.current.fluidMaterial.uniforms.iMouse.value.set(
          0,
          0,
          0,
          0
        );
      }
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    if (!isMouseDistortionOn && materialsRef.current.fluidMaterial) {
      materialsRef.current.fluidMaterial.uniforms.iMouse.value.set(0, 0, 0, 0);
    }

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isMouseDistortionOn]);

  const states: SilkArgs = {
    brushSize,
    brushStrength,
    distortionAmount,
    color1,
    color2,
    color3,
    color4,
    showCodeModal,
    isMouseDistortionOn,
    setBrushSize,
    setBrushStrength,
    setDistortionAmount,
    setColor1,
    setColor2,
    setColor3,
    setColor4,
    setShowCodeModal,
    setIsMouseDistortionOn,
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-black"
    >
      <div ref={canvasRef} className="fixed top-0 left-0 w-full h-full" />
      <Controls index={0} states={states} />
    </div>
  );
}

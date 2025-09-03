import { Dispatch, SetStateAction } from "react";

export type silkConfig = {
  brushSize: string;
  brushStrength: string;
  distortionAmount: string;
  color1: string;
  color2: string;
  color3: string;
  color4: string;
  colorIntensity?: string;
  softness?: string;
};

export function hexToRgb(hex: string) {
  const r = Number.parseInt(hex.slice(1, 3), 16) / 255;
  const g = Number.parseInt(hex.slice(3, 5), 16) / 255;
  const b = Number.parseInt(hex.slice(5, 7), 16) / 255;
  return [r, g, b];
}

export const generateGodRaysCode = (
  rayIntensity: number,
  animationSpeed: number,
  rayCount: number,
  lightRadius: number,
  backgroundColor1: string,
  backgroundColor2: string,
  rayColor: string,
  cloudDensity: number
) => {
  const [bg1r, bg1g, bg1b] = hexToRgb(backgroundColor1);
  const [bg2r, bg2g, bg2b] = hexToRgb(backgroundColor2);
  const [rayR, rayG, rayB] = hexToRgb(rayColor);

  const componentCode = [
    '"use client";',
    'import { useEffect, useRef } from "react";',
    'import * as THREE from "three";',
    "",
    "const vertexShader = `",
    "  varying vec2 vUv;",
    "  void main() {",
    "    vUv = uv;",
    "    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
    "  }",
    "`;",
    "",
    "const godRaysShader = `",
    "  precision highp float;",
    "  uniform float iTime;",
    "  uniform vec2 iResolution;",
    "  uniform float uRayIntensity;",
    "  uniform float uAnimationSpeed;",
    "  uniform float uRayCount;",
    "  uniform float uLightRadius;",
    "  uniform vec3 uBackgroundColor1;",
    "  uniform vec3 uBackgroundColor2;",
    "  uniform vec3 uRayColor;",
    "  uniform float uCloudDensity;",
    "  varying vec2 vUv;",
    "",
    "  float noise(vec2 p) {",
    "      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);",
    "  }",
    "",
    "  float fbm(vec2 p) {",
    "      float value = 0.0;",
    "      float amplitude = 0.5;",
    "      for (int i = 0; i < 4; i++) {",
    "          value += amplitude * noise(p);",
    "          p *= 2.0;",
    "          amplitude *= 0.5;",
    "      }",
    "      return value;",
    "  }",
    "",
    "  float volumetricRays(vec2 uv, vec2 lightPos, float time) {",
    "      vec2 dir = normalize(lightPos - uv);",
    "      float dist = length(lightPos - uv);",
    "      float rayIntensity = 0.0;",
    "      for (int i = 0; i < 16; i++) {",
    "          float t = float(i) / 16.0;",
    "          vec2 samplePos = uv + dir * t * dist;",
    "          float noiseVal = fbm(samplePos * 3.0 + time * 0.1);",
    "          float rayAngle = atan(samplePos.y - lightPos.y, samplePos.x - lightPos.x);",
    "          float rayPattern = sin(rayAngle * uRayCount + time) * 0.5 + 0.5;",
    "          rayPattern = pow(rayPattern, 3.0);",
    "          float falloff = 1.0 - smoothstep(0.0, dist, length(samplePos - lightPos));",
    "          rayIntensity += rayPattern * noiseVal * falloff * 0.04 * uRayIntensity;",
    "      }",
    "      return rayIntensity;",
    "  }",
    "",
    "  void main() {",
    "      vec2 uv = (vUv - 0.5) * vec2(iResolution.x / iResolution.y, 1.0);",
    "      float time = iTime * uAnimationSpeed;",
    "      float lightAngle = time * 0.2;",
    "      vec2 lightPos = vec2(",
    "          cos(lightAngle) * uLightRadius,",
    "          sin(lightAngle) * uLightRadius * 0.8 + 0.3",
    "      );",
    "      vec3 backgroundColor = mix(uBackgroundColor1, uBackgroundColor2, 1.0 - length(uv));",
    "      float clouds = fbm(uv * 2.0 + time * 0.05);",
    "      backgroundColor = mix(backgroundColor, vec3(0.4, 0.4, 0.6), clouds * uCloudDensity);",
    "      float rays = volumetricRays(uv, lightPos, time);",
    "      vec3 color = backgroundColor + uRayColor * rays;",
    "      gl_FragColor = vec4(color, 1.0);",
    "  }",
    "`;",
    "",
    "export default function GodRaysComponent() {",
    "  const containerRef = useRef(null);",
    "  const canvasRef = useRef(null);",
    "",
    "  useEffect(() => {",
    "    if (!containerRef.current || !canvasRef.current) return;",
    '    canvasRef.current.innerHTML = "";',
    "    const scene = new THREE.Scene();",
    "    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);",
    "    const renderer = new THREE.WebGLRenderer({ antialias: true });",
    "    const canvas = renderer.domElement;",
    "    canvasRef.current.appendChild(canvas);",
    "    const rect = canvasRef.current?.getBoundingClientRect();",
    "    if (!rect) return;",
    "    renderer.setSize(rect.width || 800, rect.height || 600);",
    "",
    "    const godRaysMaterial = new THREE.ShaderMaterial({",
    "      vertexShader,",
    "      fragmentShader: godRaysShader,",
    "      uniforms: {",
    `        iTime: { value: 0 },`,
    `        iResolution: { value: new THREE.Vector2(rect.width || 800, rect.height || 600) },`,
    `        uRayIntensity: { value: ${rayIntensity} },`,
    `        uAnimationSpeed: { value: ${animationSpeed} },`,
    `        uRayCount: { value: ${rayCount} },`,
    `        uLightRadius: { value: ${lightRadius} },`,
    `        uBackgroundColor1: { value: new THREE.Vector3(${bg1r}, ${bg1g}, ${bg1b}) },`,
    `        uBackgroundColor2: { value: new THREE.Vector3(${bg2r}, ${bg2g}, ${bg2b}) },`,
    `        uRayColor: { value: new THREE.Vector3(${rayR}, ${rayG}, ${rayB}) },`,
    `        uCloudDensity: { value: ${cloudDensity} },`,
    "      },",
    "    });",
    "",
    "    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), godRaysMaterial);",
    "    scene.add(quad);",
    "",
    "    let frame = 0;",
    "    const animate = () => {",
    "      frame++;",
    "      godRaysMaterial.uniforms.iTime.value = frame * 0.01;",
    "      renderer.render(scene, camera);",
    "      requestAnimationFrame(animate);",
    "    };",
    "    animate();",
    "",
    "    const handleResize = () => {",
    "      if (!canvasRef.current) return;",
    "      const rect = canvasRef.current.getBoundingClientRect();",
    "      if (!rect) return;",
    "      renderer.setSize(rect.width, rect.height);",
    "      godRaysMaterial.uniforms.iResolution.value.set(rect.width, rect.height);",
    "    };",
    "",
    '    window.addEventListener("resize", handleResize);',
    "",
    "    return () => {",
    '      window.removeEventListener("resize", handleResize);',
    "      renderer.dispose();",
    "      godRaysMaterial.dispose();",
    "      if (canvasRef.current) {",
    '        canvasRef.current.innerHTML = "";',
    "      }",
    "    };",
    "  }, []);",
    "",
    "  return (",
    '    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-black">',
    '      <div ref={canvasRef} className="fixed top-0 left-0 w-full h-full" />',
    "    </div>",
    "  );",
    "}",
  ];

  return componentCode.join("\n");
};

export function getSilkCode(
  currentConfig: silkConfig,
  isMouseDistortionOn: boolean
) {
  const colorIntensity = currentConfig.colorIntensity || "1.0";
  const softness = currentConfig.softness || "1.0";

  return `\"use client\"

import { useEffect, useRef } from "react"
import * as THREE from "three"

function hexToRgb(hex: string) {
  const r = Number.parseInt(hex.slice(1, 3), 16) / 255
  const g = Number.parseInt(hex.slice(3, 5), 16) / 255
  const b = Number.parseInt(hex.slice(5, 7), 16) / 255
  return [r, g, b]
}

export function BgComponent() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  
  const materialsRef = useRef<{
    fluidMaterial: THREE.ShaderMaterial | null;
    displayMaterial: THREE.ShaderMaterial | null;
  }>({ fluidMaterial: null, displayMaterial: null })
  
  const mouseRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0, lastMoveTime: 0 })

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return

    const vertexShader = \`
      varying vec2 vUv;
      void main(){
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    \`

    const fluidShader = \`
      uniform float iTime;
      uniform vec2 iResolution;
      uniform vec4 iMouse;
      uniform int iFrame;
      uniform sampler2D iPreviousFrame;
      uniform float uBrushSize;
      uniform float uBrushStrength;
      uniform float uFluidDecay;
      uniform float uTrailLength;
      uniform float uStopDecay;
      varying vec2 vUv;

      vec2 ur, U;

      float ln(vec2 p, vec2 a, vec2 b) {
        return length(p - a - (b - a) * clamp(dot(p - a, b - a) / dot(b - a, b - a), 0.0, 1.0));
      }
      
      vec4 t(vec2 v, int a, int b) {
        return texture2D(iPreviousFrame, fract((v + vec2(float(a), float(b))) / ur));
      }
      
      vec4 t(vec2 v) {
        return texture2D(iPreviousFrame, fract(v / ur));
      }

      float area(vec2 a, vec2 b, vec2 c) {
        float A = length(b - c), B = length(c - a), C = length(a - b), s = 0.5 * (A + B + C);
        return sqrt(max(0.0, s * (s - A) * (s - B) * (s - C))); 
      }

      void main() {
        U = vUv * iResolution;
        ur = iResolution.xy;

        if (iFrame < 1) {
          float w = 0.5 + sin(0.2 * U.x) * 0.5;
          float q = length(U - 0.5 * ur);
          gl_FragColor = vec4(0.1 * exp(-0.001 * q), 0.0, w, 1.0);
        } else {
          vec2 v = U;
          vec2 A = v + vec2(1, 1);
          vec2 B = v + vec2(1, -1);
          vec2 C = v + vec2(-1, 1);
          vec2 D = v + vec2(-1, -1);

          for (int i = 0; i < 8; i++) {
            v -= t(v).xy;
            A -= t(A).xy;
            B -= t(B).xy;
            C -= t(C).xy;
            D -= t(D).xy;
          }

          vec4 me = t(v);
          vec4 n = t(v, 0, 1);
          vec4 e = t(v, 1, 0);
          vec4 s = t(v, 0, -1);
          vec4 w = t(v, -1, 0);
          vec4 ne = 0.25 * (n + e + s + w);
          me = mix(t(v), ne, vec4(0.15, 0.15, 0.95, 0.0));
          me.z = me.z - 0.01 * ((area(A, B, C) + area(B, C, D)) - 4.0);

          vec4 pr = vec4(e.z, w.z, n.z, s.z);
          me.xy = me.xy + 100.0 * vec2(pr.x - pr.y, pr.z - pr.w) / ur;

          me.xy *= uFluidDecay;
          me.z *= uTrailLength;
          
          if (iMouse.z > 0.0) {
            vec2 mousePos = iMouse.xy;
            vec2 mousePrev = iMouse.zw;
            vec2 mouseVel = mousePos - mousePrev;
            float velMagnitude = length(mouseVel);
            float q = ln(U, mousePos, mousePrev);
            vec2 m = mousePos - mousePrev;
            float l = length(m);
            if (l > 0.0) m = min(10.0, 10.0) * m / l;

            float brushSizeFactor = 1e-4 / uBrushSize;
            float strengthFactor = 0.03 * uBrushStrength;

            float falloff = exp(-brushSizeFactor * q * q * q);
            falloff = pow(falloff, 0.5);

            me.xyz += strengthFactor * falloff * vec3(m, 10.0);

            if (velMagnitude < 2.0) {
              float distToCursor = length(U - mousePos);
              float influence = exp(-distToCursor * 0.01);
              float cursorDecay = mix(1.0, uStopDecay, influence);
              me.xy *= cursorDecay;
              me.z *= cursorDecay;
            }
          }

          gl_FragColor = clamp(me, -0.4, 0.4);
        }
      }
    \`

    const displayShader = \`
      uniform float iTime;
      uniform vec2 iResolution;
      uniform sampler2D iFluid;
      uniform float uDistortionAmount;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform vec3 uColor3;
      uniform vec3 uColor4;
      uniform float uColorIntensity;
      uniform float uSoftness;
      varying vec2 vUv;

      void main() {
        vec2 fragCoord = vUv * iResolution;

        vec4 fluid = texture2D(iFluid, vUv);
        vec2 fluidVel = fluid.xy;

        float mr = min(iResolution.x, iResolution.y);
        vec2 uv = (fragCoord * 2.0 - iResolution.xy) / mr;

        uv += fluidVel * (0.5 * uDistortionAmount);

        float d = -iTime * 0.5;
        float a = 0.0;
        for (float i = 0.0; i < 8.0; ++i) {
          a += cos(i - d - a * uv.x);
          d += sin(uv.y * i + a);
        }

        d += iTime * 0.5;

        float mixer1 = cos(uv.x * d) * 0.5 + 0.5;
        float mixer2 = cos(uv.y * a) * 0.5 + 0.5;
        float mixer3 = sin(d + a) * 0.5 + 0.5;

        float smoothAmount = clamp(uSoftness * 0.1, 0.0, 0.9);
        mixer1 = mix(mixer1, 0.5, smoothAmount);
        mixer2 = mix(mixer2, 0.5, smoothAmount);
        mixer3 = mix(mixer3, 0.5, smoothAmount);

        vec3 col = mix(uColor1, uColor2, mixer1);
        col = mix(col, uColor3, mixer2);
        col = mix(col, uColor4, mixer3 * 0.4);

        col *= uColorIntensity;

        gl_FragColor = vec4(col, 1.0);
      }
    \`

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    rendererRef.current = renderer

    renderer.setSize(window.innerWidth, window.innerHeight)
    canvasRef.current.appendChild(renderer.domElement)

    const fluidTarget1 = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight,
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
      }
    )

    const fluidTarget2 = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight,
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
      }
    )

    let currentFluidTarget = fluidTarget1
    let previousFluidTarget = fluidTarget2
    let frameCount = 0

    const fluidMaterial = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        iMouse: { value: new THREE.Vector4(0, 0, 0, 0) },
        iFrame: { value: 0 },
        iPreviousFrame: { value: null },
        uBrushSize: { value: ${currentConfig.brushSize} },
        uBrushStrength: { value: ${currentConfig.brushStrength} },
        uFluidDecay: { value: 0.98 },
        uTrailLength: { value: 0.8 },
        uStopDecay: { value: 0.85 },
      },
      vertexShader,
      fragmentShader: fluidShader,
    })

    const displayMaterial = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        iFluid: { value: null },
        uDistortionAmount: { value: ${currentConfig.distortionAmount} },
        uColor1: { value: new THREE.Vector3(${hexToRgb(
          currentConfig.color1
        ).join(", ")}) },
        uColor2: { value: new THREE.Vector3(${hexToRgb(
          currentConfig.color2
        ).join(", ")}) },
        uColor3: { value: new THREE.Vector3(${hexToRgb(
          currentConfig.color3
        ).join(", ")}) },
        uColor4: { value: new THREE.Vector3(${hexToRgb(
          currentConfig.color4
        ).join(", ")}) },
        uColorIntensity: { value: ${colorIntensity} },
        uSoftness: { value: ${softness} }
      },
      vertexShader,
      fragmentShader: displayShader,
    })

    materialsRef.current = { fluidMaterial, displayMaterial }

    const geometry = new THREE.PlaneGeometry(2, 2)
    const fluidPlane = new THREE.Mesh(geometry, fluidMaterial)
    const displayPlane = new THREE.Mesh(geometry, displayMaterial)

    function animate() {
      requestAnimationFrame(animate)

      const time = performance.now() * 0.001
      fluidMaterial.uniforms.iTime.value = time
      displayMaterial.uniforms.iTime.value = time
      fluidMaterial.uniforms.iFrame.value = frameCount

      if (performance.now() - mouseRef.current.lastMoveTime > 100) {
        fluidMaterial.uniforms.iMouse.value.set(0, 0, 0, 0)
      }

      fluidMaterial.uniforms.iPreviousFrame.value = previousFluidTarget.texture

      renderer.setRenderTarget(currentFluidTarget)
      renderer.render(fluidPlane, camera)

      displayMaterial.uniforms.iFluid.value = currentFluidTarget.texture

      renderer.setRenderTarget(null)
      renderer.render(displayPlane, camera)

      const temp = currentFluidTarget
      currentFluidTarget = previousFluidTarget
      previousFluidTarget = temp

      frameCount++
    }

    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      renderer.setSize(width, height)
      fluidMaterial.uniforms.iResolution.value.set(width, height)
      displayMaterial.uniforms.iResolution.value.set(width, height)

      fluidTarget1.setSize(width, height)
      fluidTarget2.setSize(width, height)
      frameCount = 0
    }

    window.addEventListener("resize", handleResize)
    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
      renderer.dispose()
      fluidTarget1.dispose()
      fluidTarget2.dispose()
      geometry.dispose()
      fluidMaterial.dispose()
      displayMaterial.dispose()
      materialsRef.current = { fluidMaterial: null, displayMaterial: null }
      rendererRef.current = null
    }
  }, [])

  useEffect(() => {
    const canvas = rendererRef.current?.domElement
    if (!canvas) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!${isMouseDistortionOn} || !materialsRef.current.fluidMaterial) return

      const rect = canvas.getBoundingClientRect()

      mouseRef.current.prevX = mouseRef.current.x
      mouseRef.current.prevY = mouseRef.current.y

      mouseRef.current.x = e.clientX - rect.left
      mouseRef.current.y = rect.height - (e.clientY - rect.top)
      mouseRef.current.lastMoveTime = performance.now()

      materialsRef.current.fluidMaterial.uniforms.iMouse.value.set(
        mouseRef.current.x,
        mouseRef.current.y,
        mouseRef.current.prevX,
        mouseRef.current.prevY
      )
    }

    const handleMouseLeave = () => {
      if (materialsRef.current.fluidMaterial) {
        materialsRef.current.fluidMaterial.uniforms.iMouse.value.set(
          0,
          0,
          0,
          0
        )
      }
    }

    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseleave", handleMouseLeave)

    if (!${isMouseDistortionOn} && materialsRef.current.fluidMaterial) {
      materialsRef.current.fluidMaterial.uniforms.iMouse.value.set(0, 0, 0, 0)
    }

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-black">
      <div ref={canvasRef} className="fixed top-0 left-0 w-full h-full" />
    </div>
  )
}`;
}

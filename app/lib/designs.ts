import type { Dispatch, SetStateAction } from "react";
import Silk from "@/components/silk";
import GodRaysComponent from "@/components/godRaysComponent";

export type SilkArgs = {
  brushSize: number;
  brushStrength: number;
  distortionAmount: number;
  color1: string;
  color2: string;
  color3: string;
  color4: string;
  showCodeModal: boolean;
  isMouseDistortionOn: boolean;
  setBrushSize: Dispatch<SetStateAction<number>>;
  setBrushStrength: Dispatch<SetStateAction<number>>;
  setDistortionAmount: Dispatch<SetStateAction<number>>;
  setColor1: Dispatch<SetStateAction<string>>;
  setColor2: Dispatch<SetStateAction<string>>;
  setColor3: Dispatch<SetStateAction<string>>;
  setColor4: Dispatch<SetStateAction<string>>;
  setShowCodeModal: Dispatch<SetStateAction<boolean>>;
  setIsMouseDistortionOn: Dispatch<SetStateAction<boolean>>;
};

export type GodRaysArgs = {
  rayIntensity: number;
  animationSpeed: number;
  rayCount: number;
  lightRadius: number;
  backgroundColor1: string;
  backgroundColor2: string;
  rayColor: string;
  cloudDensity: number;

  setRayIntensity: Dispatch<SetStateAction<number>>;
  setAnimationSpeed: Dispatch<SetStateAction<number>>;
  setRayCount: Dispatch<SetStateAction<number>>;
  setLightRadius: Dispatch<SetStateAction<number>>;
  setBackgroundColor1: Dispatch<SetStateAction<string>>;
  setBackgroundColor2: Dispatch<SetStateAction<string>>;
  setRayColor: Dispatch<SetStateAction<string>>;
  setCloudDensity: Dispatch<SetStateAction<number>>;
};

export const typeArr: [SilkArgs, GodRaysArgs] = [
  {
    brushSize: 25,
    brushStrength: 0.5,
    distortionAmount: 2.5,
    color1: "#b8fff7",
    color2: "#6e3466",
    color3: "#0133ff",
    color4: "#66d1fe",
    showCodeModal: false,
    isMouseDistortionOn: true,
    setBrushSize: () => {},
    setBrushStrength: () => {},
    setDistortionAmount: () => {},
    setColor1: () => {},
    setColor2: () => {},
    setColor3: () => {},
    setColor4: () => {},
    setShowCodeModal: () => {},
    setIsMouseDistortionOn: () => {},
  },
  {
    rayIntensity: 1.0,
    animationSpeed: 1.0,
    rayCount: 12,
    lightRadius: 1.5,
    backgroundColor1: "#0d1a33",
    backgroundColor2: "#334d80",
    rayColor: "#fff9cc",
    cloudDensity: 0.3,
    setRayIntensity: () => {},
    setAnimationSpeed: () => {},
    setRayCount: () => {},
    setLightRadius: () => {},
    setBackgroundColor1: () => {},
    setBackgroundColor2: () => {},
    setRayColor: () => {},
    setCloudDensity: () => {},
  },
];

export const designs = [
  {
    name: "Silk",
    settingsName: "Brush",
    mousedistortion: true,
    component: Silk,
  },
  {
    name: "God Rays",
    settingsName: "Rays",
    mousedistortion: false,
    component: GodRaysComponent,
  },
] as const;

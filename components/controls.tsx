"use client";
import { designs } from "@/app/lib/designs";
import { Tooltip } from "./tooltip";
import { type Dispatch, type SetStateAction, useMemo, useState } from "react";
import {
  Check,
  Code2,
  Copy,
  MousePointerClick,
  Palette,
  Settings2,
  Sparkles,
  X,
} from "lucide-react";
import type { typeArr, SilkArgs, GodRaysArgs } from "@/app/lib/designs";
import {
  generateGodRaysCode,
  getSilkCode,
  silkConfig,
} from "@/app/lib/helpFuncs";

type TypeArr = typeof typeArr;

type expand = {
  settings: boolean;
  colors: boolean;
  effects: boolean;
};

const dafault: expand = {
  settings: false,
  colors: false,
  effects: false,
};

type ControlPair<T> = {
  id: string;
  value: T;
  set: Dispatch<SetStateAction<T>>;
};

export default function Controls<I extends keyof TypeArr & number>({
  index,
  states,
}: {
  index: number;
  states: TypeArr[I];
}) {
  let st = states as SilkArgs;
  let stGod = states as GodRaysArgs;

  const [expandedSections, setExpandedSections] = useState<expand>(dafault);
  const [showCodeModal, setShowCodeModal] = useState<boolean>(false);
  const [copied1, setCopied1] = useState<boolean>(false);
  const [copied2, setCopied2] = useState<boolean>(false);
  const [copied3, setCopied3] = useState<boolean>(false);
  const [isBusyS1, setIsBusyS1] = useState<boolean>(false);
  const [isBusyS2, setIsBusyS2] = useState<boolean>(false);
  const [isBusyS3, setIsBusyS3] = useState<boolean>(false);

  const getCode = () => {
    if (index == 0) {
      const args: silkConfig = {
        brushSize: st.brushSize.toString(),
        brushStrength: st.brushStrength.toString(),
        color1: st.color1,
        color2: st.color2,
        color3: st.color3,
        color4: st.color4,
        distortionAmount: st.distortionAmount.toString(),
      };

      return getSilkCode(args, st.isMouseDistortionOn);
    } else if (index == 1) {
      return generateGodRaysCode(
        stGod.rayIntensity,
        stGod.animationSpeed,
        stGod.rayCount,
        stGod.lightRadius,
        stGod.backgroundColor1,
        stGod.backgroundColor2,
        stGod.rayColor,
        stGod.cloudDensity
      );
    }
  };

  const toggleSection = (section: keyof expand) => {
    setExpandedSections((prev) => ({
      ...dafault,
      [section]: !prev[section],
    }));
  };

  const copyToClipboard = async (text: string, step: number) => {
    if (step == 1) {
      if (isBusyS1) return;
      setIsBusyS1(true);
    } else if (step == 2) {
      if (isBusyS2) return;
      setIsBusyS2(true);
    } else {
      if (isBusyS3) return;
      setIsBusyS3(true);
    }
    try {
      await navigator.clipboard.writeText(text);
      if (step == 1) {
        setCopied1(true);
        setTimeout(() => {
          setCopied1(false);
        }, 3000);
      } else if (step == 2) {
        setCopied2(true);
        setTimeout(() => {
          setCopied2(false);
        }, 3000);
      } else {
        setCopied3(true);
        setTimeout(() => {
          setCopied3(false);
        }, 3000);
      }
    } catch (err) {
      console.error("Failed to copy text: ", err);
    } finally {
      if (step == 1) window.setTimeout(() => setIsBusyS1(false), 300);
      else if (step == 2) window.setTimeout(() => setIsBusyS2(false), 300);
      else window.setTimeout(() => setIsBusyS3(false), 300);
    }
  };

  const {
    liveSettings,
    liveColors,
    liveEffects,
    hasMouseToggle,
  }: {
    liveSettings: ControlPair<number>[];
    liveColors: ControlPair<string>[];
    liveEffects: ControlPair<number>[];
    hasMouseToggle: boolean;
  } = useMemo(() => {
    if (index === 0) {
      const s = states as unknown as SilkArgs;
      return {
        liveSettings: [
          { id: "Size", value: s.brushSize, set: s.setBrushSize },
          { id: "Strength", value: s.brushStrength, set: s.setBrushStrength },
        ],
        liveColors: [
          { id: "Color1", value: s.color1, set: s.setColor1 },
          { id: "Color2", value: s.color2, set: s.setColor2 },
          { id: "Color3", value: s.color3, set: s.setColor3 },
          { id: "Color4", value: s.color4, set: s.setColor4 },
        ],
        liveEffects: [
          {
            id: "Distortion",
            value: s.distortionAmount,
            set: s.setDistortionAmount,
          },
        ],
        hasMouseToggle: true,
      };
    } else {
      const g = states as unknown as GodRaysArgs;
      return {
        liveSettings: [
          { id: "Intensity", value: g.rayIntensity, set: g.setRayIntensity },
          { id: "Ray Count", value: g.rayCount, set: g.setRayCount },
          { id: "Light Radius", value: g.lightRadius, set: g.setLightRadius },
          {
            id: "Cloud Density",
            value: g.cloudDensity,
            set: g.setCloudDensity,
          },
        ],
        liveColors: [
          {
            id: "Background 1",
            value: g.backgroundColor1,
            set: g.setBackgroundColor1,
          },
          {
            id: "Background 2",
            value: g.backgroundColor2,
            set: g.setBackgroundColor2,
          },
          { id: "Ray Color", value: g.rayColor, set: g.setRayColor },
        ],
        liveEffects: [
          {
            id: "Animation Speed",
            value: g.animationSpeed,
            set: g.setAnimationSpeed,
          },
        ],
        hasMouseToggle: false,
      };
    }
  }, [index, states]);

  return (
    <div>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800/80 backdrop-blur-xl border border-gray-400 rounded-full shadow-2xl z-50 px-6 py-4">
        <div className="flex items-center gap-6">
          <Tooltip text={`${designs[index].settingsName} Settings`} side="top">
            <button
              onClick={() => toggleSection("settings")}
              className={`p-3 rounded-full transition-all duration-300 ${
                expandedSections.settings
                  ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                  : "bg-gray-700/50 text-orange-400 border border-gray-600/30 hover:bg-gray-600/50"
              }`}
            >
              <Settings2 />
            </button>
          </Tooltip>

          {/* colors */}
          <Tooltip text="Colors" side="top">
            <button
              onClick={() => toggleSection("colors")}
              className={`p-3 rounded-full transition-all duration-300 ${
                expandedSections.colors
                  ? "bg-pink-500/20 text-pink-400 border border-pink-500/30"
                  : "bg-gray-700/50 text-pink-400 border border-gray-600/30 hover:bg-gray-600/50"
              }`}
            >
              <Palette />
            </button>
          </Tooltip>

          {/* effects */}
          <Tooltip text="Effects" side="top">
            <button
              onClick={() => toggleSection("effects")}
              className={`p-3 rounded-full transition-all duration-300 ${
                expandedSections.effects
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-gray-700/50 text-green-400 border border-gray-600/30 hover:bg-gray-600/50"
              }`}
            >
              <Sparkles />
            </button>
          </Tooltip>

          {hasMouseToggle && (
            <Tooltip text="Mouse Distortion" side="top">
              <button
                onClick={() => {
                  st.setIsMouseDistortionOn((prev) => !prev);
                }}
                className={`p-3 rounded-full transition-all duration-300 ${
                  st.isMouseDistortionOn
                    ? "bg-blue-500 text-blue-900 border border-blue-500/30"
                    : "bg-gray-700/50 text-blue-400 border border-gray-600/30 hover:bg-gray-600/50"
                }`}
              >
                <MousePointerClick />
              </button>
            </Tooltip>
          )}

          <div className="w-px h-6 bg-gray-600/50"></div>

          {/* code gen */}
          <Tooltip text="Export Code" side="top">
            <button
              onClick={() => setShowCodeModal(true)}
              className="p-3 rounded-full transition-all duration-300 border-none bg-sky-500 text-black  hover:bg-violet-600 hover:text-white"
            >
              <Code2 />
            </button>
          </Tooltip>

          {(expandedSections.settings ||
            expandedSections.colors ||
            expandedSections.effects) && (
            <div className="z-50 fixed bottom-full mb-4 left-1/2 transform -translate-x-1/2 bg-black backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl p-6 min-w-[400px]">
              {/* Settings */}
              {expandedSections.settings && (
                <div className="space-y-4">
                  {liveSettings.map((setItem, idx) => (
                    <div key={idx}>
                      <label className="flex items-center justify-between mb-2">
                        <span className="text-sm text-white">{setItem.id}</span>
                        <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs font-mono">
                          {setItem.value}
                        </span>
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={setItem.value as number}
                        onChange={(e) =>
                          setItem.set(Number(e.target.value) as number)
                        }
                        className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Colors */}
              {expandedSections.colors && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    {liveColors.map((colorItem, idx) => (
                      <div className="flex items-center gap-2" key={idx}>
                        <span className="text-xs text-white">
                          {colorItem.id}
                        </span>
                        <input
                          type="color"
                          value={colorItem.value}
                          onChange={(e) => colorItem.set(e.target.value)}
                          className="w-full h-8 border border-gray-600 rounded cursor-pointer bg-transparent"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {expandedSections.effects && (
                <div className="space-y-4">
                  {liveEffects.map((effItem, idx) => (
                    <div key={idx}>
                      <label className="flex items-center justify-between mb-2">
                        <span className="text-sm text-white">{effItem.id}</span>
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-mono">
                          {typeof effItem.value === "number"
                            ? (effItem.value as number).toFixed(1)
                            : effItem.value}
                        </span>
                      </label>
                      <input
                        type="range"
                        min="0.5"
                        max="5"
                        step="0.1"
                        value={effItem.value as number}
                        onChange={(e) =>
                          effItem.set(Number(e.target.value) as number)
                        }
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {showCodeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[100]">
          <div className="bg-gray-900 border border-gray-600 rounded-xl shadow-2xl w-[80vw] h-[80vh] p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Export Code</h2>
              <button
                onClick={() => setShowCodeModal(false)}
                className="p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-col bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 h-[calc(100%-4rem)] overflow-auto shadow-2xl">
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                    1
                  </div>
                  <h2 className="text-xl font-semibold text-white">
                    Install Dependencies
                  </h2>
                </div>
                <div className="ml-11 bg-gray-950 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-colors">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-gray-400 text-sm mr-3">$</span>
                      <code className="text-green-400 font-mono text-sm">
                        npm i three @types/three
                      </code>
                    </div>
                    <button
                      className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 hover:bg-gray-800 ${
                        copied1
                          ? "text-green-400 bg-green-400/10"
                          : "text-gray-400 hover:text-white"
                      }`}
                      onClick={() =>
                        copyToClipboard("npm i three @types/three", 1)
                      }
                      disabled={isBusyS1}
                      aria-label="Copy npm install command"
                    >
                      {copied1 ? (
                        <Check
                          size={18}
                          className="transition-all duration-300"
                        />
                      ) : (
                        <Copy
                          size={18}
                          className="transition-all duration-300"
                        />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                    2
                  </div>
                  <h2 className="text-xl font-semibold text-white">
                    Component Code
                  </h2>
                </div>
                <div className="ml-11 bg-gray-950 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-colors">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-blue-400 mr-2">📄</span>
                      <span className="text-gray-300 text-sm italic">
                        React component with Three.js setup
                      </span>
                    </div>
                    <button
                      className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 hover:bg-gray-800 ${
                        copied2
                          ? "text-green-400 bg-green-400/10"
                          : "text-gray-400 hover:text-white"
                      }`}
                      onClick={() => copyToClipboard(getCode() || "", 2)}
                      disabled={isBusyS2}
                      aria-label="Copy component code"
                    >
                      {copied2 ? (
                        <Check
                          size={18}
                          className="transition-all duration-300"
                        />
                      ) : (
                        <Copy
                          size={18}
                          className="transition-all duration-300"
                        />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                    3
                  </div>
                  <h2 className="text-xl font-semibold text-white">Usage</h2>
                </div>
                <div className="ml-11 bg-gray-950 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-colors">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-gray-400 mr-2">&lt;</span>
                      <span className="text-blue-400 font-mono">
                        BgComponent
                      </span>
                      <span className="text-gray-400">/&gt;</span>
                    </div>
                    <button
                      className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 hover:bg-gray-800 ${
                        copied3
                          ? "text-green-400 bg-green-400/10"
                          : "text-gray-400 hover:text-white"
                      }`}
                      onClick={() => copyToClipboard("<BgComponent/>", 3)}
                      disabled={isBusyS3}
                      aria-label="Copy component usage"
                    >
                      {copied3 ? (
                        <Check
                          size={18}
                          className="transition-all duration-300"
                        />
                      ) : (
                        <Copy
                          size={18}
                          className="transition-all duration-300"
                        />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

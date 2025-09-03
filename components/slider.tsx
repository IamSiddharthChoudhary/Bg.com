"use client";
import { ChevronLeft, ChevronRight, Github } from "lucide-react";
import { useState } from "react";
import Hero from "./hero";
import { Tooltip } from "./tooltip";
import { useRouter } from "next/navigation";
import { designs } from "@/app/lib/designs";

export default function Slider() {
  const router = useRouter();
  const [index, setIndex] = useState<number>(1);
  const size = designs.length;

  const ahead = () => {
    setIndex((prev) => (prev + 1) % size);
  };

  const back = () => {
    setIndex((prev) => (prev - 1 + size) % size);
  };

  const BgComponent = designs[index].component;

  return (
    <>
      <div className="flex z-40 overflow-hidden justify-between absolute top-0 left-0 items-center h-screen w-full transition-transform px-2 sm:px-4 md:px-6">
        <button
          className="text-gray-400 hover:text-white hover:scale-110 transition-all duration-200 p-2 sm:p-3 md:p-4"
          onClick={back}
        >
          <ChevronLeft className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24" />
        </button>
        <button
          className="text-gray-400 hover:text-white hover:scale-110 transition-all duration-200 p-2 sm:p-3 md:p-4"
          onClick={ahead}
        >
          <ChevronRight className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24" />
        </button>
        <div className="absolute right-0 bottom-0 m-10 group">
          <Tooltip text="⭐ Give star on GitHub" side="left">
            <button
              className="hover:scale-130 transition-transform bg-amber-50 p-2 rounded-full"
              onClick={() =>
                router.push("https://github.com/IamSiddharthChoudhary/Bg.com")
              }
            >
              <Github color="black" />
            </button>
          </Tooltip>
        </div>
      </div>

      <BgComponent />

      <Hero name={designs[index].name} />
    </>
  );
}

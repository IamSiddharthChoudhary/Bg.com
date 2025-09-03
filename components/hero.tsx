export default function Hero({ name }: { name: string }) {
  return (
    <div className="absolute top-0 left-0 z-20 h-screen w-full text-white flex flex-col items-center justify-center p-5 md:p-8">
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
        <img
          className="h-16 md:h-20 hover:scale-110 transition-transform duration-300"
          src="/logo.png"
          alt="Logo"
        />
      </div>

      <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto space-y-16">
        <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[12rem] xl:text-[14rem] great-vibes-regular mb-0 md:mb-0 leading-none">
          {name}
        </h1>

        <div className="space-y-4 md:space-y-1 max-w-2xl dm-serif-text-regular">
          <p className="text-sm md:text-base lg:text-lg font-medium leading-relaxed text-white/90">
            Transform your website with stunning shader backgrounds.
          </p>

          <p className="text-sm md:text-base lg:text-lg font-medium leading-relaxed text-white/90">
            Simply customize our beautiful effects and integrate them into your
            project
          </p>

          <p className="text-sm md:text-base lg:text-lg font-medium leading-relaxed text-white/90">
            The easiest way avaiable to add professional shader backgrounds to
            your website
          </p>
        </div>
      </div>
    </div>
  );
}

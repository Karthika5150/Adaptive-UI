import { IntroductionData, PrerequisitesData } from "@/data/data";
import { InstallTabs } from "@/components/ui/install-tabs";

export default function InstalltionPage() {
  return (
    <main className="px-10 py-5 ">
      <div className="text-gray-500 font-plex text-[14px]">
        Documentation / <span className="text-gray-200">Installation</span>
      </div>
      <h1 className="text-[clamp(1rem,5vw,1.8rem)] pt-4 font-bold font-inter text-gray-200">
        Installation
      </h1>

      <p className="mt-4 md:max-w-1/2 text-[14px] leading-7 text-gray-400 font-inter">
        Get started with Adaptive UI and bring your interfaces to life with
        beautifully crafted components and interactive animations. Follow this
        guide to set up your project and start building stunning user
        experiences.
      </p>

      <h1 className="text-[clamp(1rem,5vw,1.8rem)] font-bold font-inter text-gray-200 pt-6">
        What is Adaptive UI?
      </h1>

      <p className="mt-4 md:max-w-1/2 text-[14px] leading-7 text-gray-400 font-inter">
        Adaptive UI is a collection of beautifully crafted componenets ,
        interactive animations and reusable elements designed for modern web
        applications.
      </p>

      <div>
        <div className="grid grid-cols-2 grid-rows-2 gap-6 w-4xl pt-6">
          {IntroductionData.map((val) => (
            <div
              key={val.id}
              className="flex flex-col gap-2 border-2 border-gray-500 p-4 rounded-lg"
            >
              <p className="text-[clamp(1rem,1.5vw,1.25rem)] leading-7 text-gray-200 font-inter">
                {val.title}
              </p>
              <p className="text-[14px] leading-7 text-gray-400 font-plex">
                {val.content}
              </p>
            </div>
          ))}
        </div>
      </div>

      <h1 className="text-[clamp(1rem,5vw,1.8rem)] font-bold font-inter text-gray-200 pt-6">
        Prerequisites
      </h1>

      <p className="mt-4 md:max-w-1/2 text-[14px] leading-7 text-gray-400 font-inter">
        Before getting started with Adaptive UI, make sure your development
        environment is ready.
      </p>

      <div>
        <div className="grid grid-cols-2 grid-rows-2 gap-6 w-4xl pt-6">
          {PrerequisitesData.map((val) => (
            <div
              key={val.id}
              className="flex flex-col gap-2 border-2 border-gray-500 p-4 rounded-lg"
            >
              <p className="text-[clamp(1rem,1.5vw,1.25rem)] leading-7 text-gray-200 font-inter">
                {val.title}
              </p>
              <p className="text-[14px] leading-7 text-gray-400 font-plex">
                {val.content}
              </p>
            </div>
          ))}
        </div>
      </div>

      <h1 className="text-[clamp(1rem,5vw,1.8rem)] font-bold font-inter text-gray-200 pt-6">
        Installation
      </h1>

      <p className="mt-4 md:max-w-1/2 text-[14px] leading-7 text-gray-400 font-inter">
        Choose your preferred package manager to get started.
      </p>

      <div className="w-1/2 mt-6">
        <InstallTabs packages="adaptive-ui" />
      </div>

      <h1 className="text-[clamp(1rem,5vw,1.8rem)] font-bold font-inter text-gray-200 pt-6">
        Choose your Frame work.
      </h1>

      <div className="grid grid-cols-2 gap-5 w-4xl pt-6">
        {["Next.js", "Vite"].map((vals, index) => (
          <div
            key={index}
            className="border border-gray-500 relative rounded-lg px-3 py-6 flex items-center justify-center font-plex text-[clamp(1rem,5vw,1.2rem)] font-bold text-gray-400"
          >
            {vals}

            <p className="text-green-400 font-plex text-[12px] absolute top-2 right-5">
              {index === 0 ? "available" : "coming soon"}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}

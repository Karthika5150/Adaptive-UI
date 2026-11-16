import { frameWorkDaa } from "@/app/data/data";
import React from "react";

export default function FrameWorkSetup() {
  return (
    <main className="px-10 py-5 w-full!">
      <h1 className="text-[clamp(1rem,5vw,1.8rem)] font-bold font-inter text-gray-200 pt-6">
        Framework Setup
      </h1>

      <p className="mt-4 md:max-w-1/2 text-[14px] leading-7 text-gray-400 font-inter">
        Set up Adaptive UI in your Next.js project and start bulding interactive
        interfaces.
      </p>

      <div className="grid grid-cols-2 gap-5">
        {frameWorkDaa.map((item) => (
          <div key={item.id} className="flex flex-col">
            <p className="mt-4 md:max-w-1/2 text-[18px] leading-7 text-gray-200 font-inter">
              {item.title}
            </p>
            <p
              className={`mt-4 md:max-w-1/2 text-[14px] leading-7 text-gray-400 font-inter `}
            >
              {item.steps.length === 0
                ? "Coming soon"
                : "Follow the steps below to be configure your project."}
            </p>

            <div className="flex flex-col gap-3 mt-3">
              {item.steps.map((stepval) => (
                <div key={stepval.id} className="flex flex-col gap-3">
                  <p className="text-gray-400 font-plex text-[14px] font-normal">
                    STEP {stepval.step}
                  </p>

                  <p className="text-[clamp(1rem,5vw,1.2rem)] text-white font-inter font-normal">
                    {stepval.topic}
                  </p>

                  <p className="text-[14px] text-gray-300 font-normal font-plex">
                    {stepval.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

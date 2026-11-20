"use client";

import { frameWorkDaa } from "@/data/data";
import React, { useState } from "react";
import { Check } from "lucide-react";

export default function FrameWorkSetup() {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = async (content, id) => {
    try {
      setCopiedId(id);
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(content);
      }
      console.log(navigator.clipboard.writeText(content));
      window.setTimeout(() => setCopiedId(null), 1600);
    } catch {
      console.log("errror");
    }
  };

  return (
    <main className="px-10 py-6 w-full!">
      <div className="text-gray-500 font-plex text-[14px]">
        Documentation / Installation /{" "}
        <span className="text-gray-200">Frame work</span>
      </div>

      <h1 className="text-[clamp(1rem,5vw,1.8rem)] font-bold font-inter text-gray-200 pt-4">
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

                  <div className="flex flex-col gap-2 mt-1">
                    <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-[#ffffff0d]">
                      <div className="flex items-center justify-between gap-2 px-3 py-2">
                        <p className="whitespace-pre text-[14px] font-mono text-gray-300">
                          {stepval.content}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(stepval.content, stepval.id)
                          }
                          className={`flex items-center font-plex gap-1 rounded-md px-2 py-1 text-xs transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-[#5FAEB4] ${copiedId === stepval.id ? "text-white" : "text-gray-400"}`}
                          aria-label="Copy command"
                        >
                          {copiedId === stepval.id ? (
                            <Check size={14} />
                          ) : (
                            "Copy"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

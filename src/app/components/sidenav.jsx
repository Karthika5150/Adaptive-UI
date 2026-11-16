import React from "react";
import { SideNavData } from "../data/data";
import Link from "next/link";

export default function SideNav() {
  return (
    <main className="w-[15%] h-screen z-99  flex flex-col fixed inset-0 left-0 overflow-y-auto no-scrollbar bg-[#030712] mt-14">
      <div className="text-white flex flex-col gap-5 p-6">
        {SideNavData.map((val) => (
          <div key={val.id} className="w-full flex flex-col gap-3">
            <h6 className="text-[#a9a1af] text-[12px] font-normal font-plex">
              {val.title}
            </h6>
            <div className="border-l border-gray-500 flex flex-col">
              {val.items.map((vals) => (
                <Link
                  href={vals.href}
                  className="flex flex-col gap-2 pl-4"
                  key={vals.id}
                >
                  <p className="text-gray-500 hover:text-gray-300  text-[14px] font-inter">
                    {vals.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
       <div className="text-white flex flex-col gap-5 p-6">
        {SideNavData.map((val) => (
          <div key={val.id} className="w-full flex flex-col gap-3">
            <h6 className="text-[#a9a1af] text-[12px] font-normal font-plex">
              {val.title}
            </h6>
            <div className="border-l border-gray-500 flex flex-col">
              {val.items.map((vals) => (
                <Link
                  href={vals.href}
                  className="flex flex-col gap-2 pl-4"
                  key={vals.id}
                >
                  <p className="text-gray-500 hover:text-gray-300  text-[14px] font-inter">
                    {vals.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
       <div className="text-white flex flex-col gap-5 p-6">
        {SideNavData.map((val) => (
          <div key={val.id} className="w-full flex flex-col gap-3">
            <h6 className="text-[#a9a1af] text-[12px] font-normal font-plex">
              {val.title}
            </h6>
            <div className="border-l border-gray-500 flex flex-col">
              {val.items.map((vals) => (
                <Link
                  href={vals.href}
                  className="flex flex-col gap-2 pl-4"
                  key={vals.id}
                >
                  <p className="text-gray-500 hover:text-gray-300  text-[14px] font-inter">
                    {vals.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

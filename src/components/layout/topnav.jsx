import React from "react";

export default function NavComponent() {
  return (
    <main className="w-full flex items-center justify-between md:px-10 md:py-4 border-b border-gray-600 fixed top-0 z-100 bg-[#030712]">
        <h1 className="text-white font-inter font-normal">Adaptive UI</h1>
      <div className="flex items-center gap-5">
         <p className="text-[14px] font-inter text-white font-normal">Search</p>
        <p className="text-[14px] font-inter text-white font-normal">Doc</p>
         <p className="text-[14px] font-inter text-white font-normal">Play</p>
          <p className="text-[14px] font-inter text-white font-normal">Blog</p>
          <p className="text-[14px] font-inter text-white font-normal">Showcase</p>
 <p className="text-[14px] font-inter text-white font-normal">git</p>
      </div>

    </main>
  )
}

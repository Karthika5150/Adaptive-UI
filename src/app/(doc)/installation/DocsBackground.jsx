export default function DocsBackground() {
  return (
    <div
      className="
        hidden lg:flex
        w-11 shrink-0
        sticky top-0 self-start h-screen
        bg-[#030712]
      "
    >
      <div
        className="
          w-full
          border-x
          border-x-white/7
          bg-[repeating-linear-gradient(315deg,_rgba(255,255,255,0.2)_0,_rgba(255,255,255,0.2)_1px,_transparent_0,_transparent_50%)]
          bg-size-[6px_6px]
          bg-fixed
          h-full
        "
      />
    </div>
  );
}
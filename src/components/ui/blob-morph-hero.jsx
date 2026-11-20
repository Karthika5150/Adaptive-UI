"use client";

import React, { useEffect, useRef, useState, useId } from "react";

export const DEFAULT_PRESETS = [
  {
    id: "lando-f1",
    label: "LANDO // 04 (F1 Papaya)",
    title: "LANDO // 04",
    subtitle: "MCLAREN FORMULA 1 // WATER DROP MORPH",
    team: "MCLAREN RACING // P1 APEX",
    number: "04",
    bgColor: "#0c0d10",
    topoColor: "#262933",
    accentColor: "#c8ff00", // Cyber lemon / McLaren neon
    textColor: "#f3f4f6",
    baseImg:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=85",
    equippedImg:
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=900&q=85",
    svgType: "f1-helmet",
  },
  {
    id: "monza-stealth",
    label: "MONZA // APEX (Cyan Stealth)",
    title: "APEX // MONZA",
    subtitle: "TEMPLE OF SPEED // 352 KM/H TELEMETRY HUD",
    team: "SCUDERIA APEX // HIGH DOWNFORCE",
    number: "16",
    bgColor: "#08090d",
    topoColor: "#1a2233",
    accentColor: "#00f0ff", // Electric Cyan
    textColor: "#ffffff",
    baseImg:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85",
    equippedImg:
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=900&q=85",
    svgType: "f1-helmet",
  },
  {
    id: "stride-carbon",
    label: "STRIDE // X1 (Cyber Footwear)",
    title: "STRIDE // X1",
    subtitle: "KINETIC LATTICE // CARBON MIDSOLE BLUEPRINT",
    team: "INNOVATION LAB // PROTOTYPE 01",
    number: "X1",
    bgColor: "#090a0f",
    topoColor: "#202538",
    accentColor: "#ff0055", // Infrared
    textColor: "#f5f5f7",
    baseImg:
      "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=900&q=85",
    equippedImg:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85",
    svgType: "footwear",
  },
];

export function BlobMorphHero({
  preset = "lando-f1",
  baseImage,
  equippedImage,
  title,
  subtitle,
  accentColor: customAccent,
  topoColor: customTopo,
  bgColor: customBg,
  textColor: customText,
  speed = 1.0,
  autoPlay = true,
  blobMode = "roam", // "roam" (drops fall & reveal on contact) or "flood" (water surges over subject)
  showTopography = true,
  showHud = true,
  showAmbientBlobs = true,
  customSvgMarkup = "",
  className = "",
  onProgressChange,
}) {
  const uniqueId = useId().replace(/:/g, "");
  const topoCanvasRef = useRef(null);

  // Fixed pools of SVG circle elements, updated imperatively via rAF so
  // React reconciliation never fights the 60fps water simulation.
  const maskPoolRef = useRef([]);
  const ambientPoolRef = useRef([]);
  const ripplePoolRef = useRef([]);

  const activePreset =
    DEFAULT_PRESETS.find((p) => p.id === preset) || DEFAULT_PRESETS[0];

  const resolvedBase = baseImage || activePreset.baseImg;
  const resolvedEquipped = equippedImage || activePreset.equippedImg;
  const resolvedTitle = title || activePreset.title;
  const resolvedSubtitle = subtitle || activePreset.subtitle;
  const resolvedAccent = customAccent || activePreset.accentColor;
  const resolvedTopo = customTopo || activePreset.topoColor;
  const resolvedBg = customBg || activePreset.bgColor;
  const resolvedText = customText || activePreset.textColor;

  const [morphProgress, setMorphProgress] = useState(0);

  // 1. Organic Topography Contour Canvas (locked 60fps across container)
  useEffect(() => {
    if (!showTopography) return;
    const canvas = topoCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(
      typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1,
      2
    );
    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width || window.innerWidth;
      const h = rect.height || window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    let time = 0;
    let rafId;

    const drawTopography = () => {
      if (!canvas) return;
      time += 0.007 * (autoPlay ? speed : 0.05);

      const rect = canvas.getBoundingClientRect();
      const w = rect.width || window.innerWidth;
      const h = rect.height || window.innerHeight;

      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = resolvedTopo;
      ctx.lineWidth = 1.15;

      const contourLevels = 16;
      const cols = 52;
      const rows = 32;
      const cellW = w / cols;
      const cellH = h / rows;

      const field = (x, y) => {
        const nx = x / w;
        const ny = y / h;
        const v1 =
          Math.sin(nx * 4.2 + time) * Math.cos(ny * 3.6 - time * 0.7);
        const v2 = Math.sin((nx + ny) * 5.2 - time * 0.6) * 0.5;
        const v3 =
          Math.cos(Math.hypot(nx - 0.5, ny - 0.5) * 6.8 - time * 0.8) * 0.45;
        return (v1 + v2 + v3 + 2.0) / 4.0;
      };

      for (let l = 1; l < contourLevels; l++) {
        const threshold = l / contourLevels;
        ctx.beginPath();

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const x0 = c * cellW;
            const y0 = r * cellH;
            const x1 = x0 + cellW;
            const y1 = y0 + cellH;

            const a = field(x0, y0);
            const b = field(x1, y0);
            const d = field(x0, y1);
            const e = field(x1, y1);

            const pts = [];
            if ((a < threshold) !== (b < threshold)) {
              const tt = (threshold - a) / (b - a);
              pts.push([x0 + tt * cellW, y0]);
            }
            if ((b < threshold) !== (e < threshold)) {
              const tt = (threshold - b) / (e - b);
              pts.push([x1, y0 + tt * cellH]);
            }
            if ((d < threshold) !== (e < threshold)) {
              const tt = (threshold - d) / (e - d);
              pts.push([x0 + tt * cellW, y1]);
            }
            if ((a < threshold) !== (d < threshold)) {
              const tt = (threshold - a) / (d - a);
              pts.push([x0, y0 + tt * cellH]);
            }

            if (pts.length === 2) {
              ctx.moveTo(pts[0][0], pts[0][1]);
              ctx.lineTo(pts[1][0], pts[1][1]);
            }
          }
        }
        ctx.stroke();
      }

      rafId = requestAnimationFrame(drawTopography);
    };

    rafId = requestAnimationFrame(drawTopography);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, [showTopography, speed, autoPlay, resolvedTopo]);

  // 2. Water Drop Physics
  // Drops spawn at top, fall with gravity + sway, coalesce when they touch
  // (metaball weld via shared gooey filter), splash into expanding ripples at
  // the floor. Wherever water touches the subject portrait, the equipped layer
  // is revealed through the synchronized mask.
  useEffect(() => {
    let t = 0;
    let rafId;
    let spawnTimer = 0;
    let frame = 0;

    const DROP_COUNT = 26;
    const drops = []; // {x, y, vx, vy, r, phase, alive, splash}
    const ripples = []; // {x, y, r, opacity, life}

    const spawnDrop = () => {
      drops.push({
        x: 40 + Math.random() * 1120,
        y: -90 - Math.random() * 110,
        vx: (Math.random() - 0.5) * 0.9,
        vy: 1.8 + Math.random() * 2.2,
        r: 34 + Math.random() * 42,
        phase: Math.random() * Math.PI * 2,
        alive: true,
        splash: 0,
      });
    };

    const spawnRipple = (x, y) => {
      ripples.push({ x, y, r: 4, opacity: 0.6, life: 1 });
    };

    // Seed initial drops so animation is visible immediately
    for (let i = 0; i < DROP_COUNT; i++) spawnDrop();

    const animate = () => {
      if (autoPlay) t += 0.014 * speed;
      spawnTimer += 0.014 * speed;
      if (spawnTimer > 0.35 + Math.random() * 0.6) {
        spawnDrop();
        spawnTimer = 0;
      }

      const isFlood = blobMode === "flood";
      const floodCycle = isFlood
        ? Math.min(1, Math.max(0, (Math.sin(t * 0.35) + 1) / 2))
        : 0;
      const floodY = 790 - floodCycle * 560;

      let maxContact = 0;

      // Subject portrait rect: x 360-840, y 70-710
      const sx0 = 360;
      const sx1 = 840;
      const sy0 = 70;
      const sy1 = 710;

      // Update drops: gravity, sway, floor splash, subject contact
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        if (!d.alive) {
          drops.splice(i, 1);
          continue;
        }

        // Gravity + horizontal sway (dripping water wobble)
        d.x += d.vx + Math.sin(t * 0.7 + d.phase) * 0.7;
        d.y += d.vy;
        d.vy += 0.11 * speed;
        d.vx *= 0.98; // air resistance

        // Floor collision -> splash, respawn at top
        if (d.y - d.r > 800) {
          spawnRipple(d.x, 800);
          d.y = -70;
          d.x = 40 + Math.random() * 1120;
          d.vy = 1.8 + Math.random() * 2.2;
          d.vx = (Math.random() - 0.5) * 0.9;
          d.r = 34 + Math.random() * 42;
          d.splash = 0;
          continue;
        }

        // Contact with subject portrait -> drives reveal
        const cx = Math.max(sx0, Math.min(sx1, d.x));
        const cy = Math.max(sy0, Math.min(sy1, d.y));
        const dist = Math.hypot(d.x - cx, d.y - cy);
        const contact = Math.max(0, 1 - dist / (d.r + 55));
        if (contact > maxContact) maxContact = contact;

        // Visual splash marker while over subject
        if (contact > 0.15) d.splash = Math.min(1, d.splash + 0.05);
        else if (d.splash > 0) d.splash = Math.max(0, d.splash - 0.02);
      }

      // Water coalescence: close drops merge into one bigger mass
      for (let i = 0; i < drops.length; i++) {
        for (let j = i + 1; j < drops.length; j++) {
          const a = drops[i];
          const b = drops[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < (a.r + b.r) * 0.55) {
            b.alive = false;
            const nr = Math.sqrt(a.r * a.r + b.r * b.r) * 1.1;
            a.x = (a.x * a.r + b.x * b.r) / (a.r + b.r);
            a.y = (a.y * a.r + b.y * b.r) / (a.r + b.r);
            a.r = nr;
          }
        }
      }

      // Cap total drop count
      while (drops.length > DROP_COUNT + 6) drops.shift();

      // Update ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const p = ripples[i];
        p.r += 3.0 * speed;
        p.opacity -= 0.009 * speed;
        p.life -= 0.014 * speed;
        if (p.life <= 0) ripples.splice(i, 1);
      }

      // Assign drops to fixed circle pools (mask reveal + ambient water share positions)
      const maskPool = maskPoolRef.current;
      const ambPool = ambientPoolRef.current;
      const n = Math.min(drops.length, maskPool.length);
      for (let i = 0; i < maskPool.length; i++) {
        if (i < n) {
          const d = drops[i];
          const cx = d.x.toFixed(1);
          const cy = d.y.toFixed(1);
          const r = Math.max(4, d.r).toFixed(1);
          if (maskPool[i]) {
            maskPool[i].setAttribute("cx", cx);
            maskPool[i].setAttribute("cy", cy);
            maskPool[i].setAttribute("r", r);
          }
          if (ambPool[i]) {
            ambPool[i].setAttribute("cx", cx);
            ambPool[i].setAttribute("cy", cy);
            ambPool[i].setAttribute("r", r);
            // tint by accent, brighter when splashing on subject
            ambPool[i].style.opacity = String(
              Math.max(0.15, Math.min(0.85, 0.35 + d.splash * 0.5))
            );
          }
        } else {
          if (maskPool[i]) maskPool[i].setAttribute("r", "0");
          if (ambPool[i]) {
            ambPool[i].setAttribute("r", "0");
            ambPool[i].style.opacity = "0";
          }
        }
      }

      // Flood mode: big water mass surges up over the subject center
      if (isFlood) {
        const lastMask = maskPool[maskPool.length - 1];
        const lastAmb = ambPool[ambPool.length - 1];
        const fr = 460 + Math.sin(t * 0.28) * 30;
        if (lastMask) {
          lastMask.setAttribute("cx", "600");
          lastMask.setAttribute("cy", floodY.toFixed(1));
          lastMask.setAttribute("r", fr.toFixed(1));
        }
        if (lastAmb) {
          lastAmb.setAttribute("cx", "600");
          lastAmb.setAttribute("cy", floodY.toFixed(1));
          lastAmb.setAttribute("r", fr.toFixed(1));
          lastAmb.style.opacity = "0.45";
        }
      }

      // Assign ripples to ripple pool
      const ripPool = ripplePoolRef.current;
      for (let i = 0; i < ripPool.length; i++) {
        if (i < ripples.length) {
          const p = ripples[i];
          if (ripPool[i]) {
            ripPool[i].setAttribute("cx", p.x.toFixed(1));
            ripPool[i].setAttribute("cy", p.y.toFixed(1));
            ripPool[i].setAttribute("r", p.r.toFixed(1));
            ripPool[i].style.opacity = String(Math.max(0, p.opacity));
          }
        } else if (ripPool[i]) {
          ripPool[i].setAttribute("r", "0");
          ripPool[i].style.opacity = "0";
        }
      }

      frame++;
      if (frame % 2 === 0) {
        const revealVal = isFlood
          ? floodCycle
          : Math.min(1, Math.max(0, maxContact * 1.5));
        setMorphProgress(revealVal);
        if (onProgressChange) onProgressChange(revealVal);
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [speed, autoPlay, blobMode, onProgressChange]);

  return (
    <div
      className={`relative h-full w-full overflow-hidden select-none transition-colors duration-500 font-sans ${className}`}
      style={{ backgroundColor: resolvedBg, color: resolvedText }}
    >
      {/* LAYER 1: 60FPS Animated Topographic Contour Canvas across full container */}
      {showTopography && (
        <canvas
          ref={topoCanvasRef}
          className="absolute inset-0 h-full w-full pointer-events-none opacity-80"
        />
      )}

      {/* Ambient Vignette & Technical Radial Glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${resolvedAccent}0f 0%, transparent 65%), radial-gradient(circle at 50% 100%, #00000099 0%, transparent 80%)`,
        }}
      />

      {/* Giant Editorial Background Typography */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <h1
          className="text-[17vw] font-black tracking-tighter uppercase opacity-[0.06] leading-none whitespace-nowrap select-none"
          style={{ color: resolvedText }}
        >
          {resolvedTitle}
        </h1>
      </div>

      {/* LAYER 2 & 3: Container-Wide SVG Stage (1200x800 coordinate space) */}
      <svg
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full overflow-visible z-10"
      >
        <defs>
          {/* Soft Organic Vignette Feather Mask for the Driver Portrait (NO CARD BORDER OR BOX!) */}
          <mask
            id={`subjectOrganicFade_${uniqueId}`}
            maskUnits="userSpaceOnUse"
            maskContentUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="1200"
            height="800"
          >
            <radialGradient
              id={`subjectVignette_${uniqueId}`}
              cx="50%"
              cy="46%"
              r="50%"
            >
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="68%" stopColor="white" stopOpacity="1" />
              <stop offset="86%" stopColor="white" stopOpacity="0.75" />
              <stop offset="96%" stopColor="white" stopOpacity="0.2" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <rect
              x="360"
              y="70"
              width="480"
              height="640"
              rx="60"
              fill={`url(#subjectVignette_${uniqueId})`}
            />
          </mask>

          {/* SHARED Gooey Filter: metaball field welds drops together AND welds
              the reveal edge to the water edge so the image reads as submerged. */}
          <filter
            id={`liquidGooeyFilter_${uniqueId}`}
            x="-40%"
            y="-40%"
            width="180%"
            height="180%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="22" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 24 -14"
              result="goo"
            />
          </filter>

          {/* Synchronized Global Blob Mask: reveals Equipped Layer ONLY where water touches */}
          <mask
            id={`globalBlobMask_${uniqueId}`}
            maskUnits="userSpaceOnUse"
            maskContentUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="1200"
            height="800"
          >
            <rect x="0" y="0" width="1200" height="800" fill="black" />
            <g filter={`url(#liquidGooeyFilter_${uniqueId})`}>
              {[...Array(26)].map((_, i) => (
                <circle
                  key={i}
                  ref={(el) => (maskPoolRef.current[i] = el)}
                  cx="0"
                  cy="0"
                  r="0"
                  fill="white"
                />
              ))}
              {blobMode === "flood" && (
                <circle
                  ref={(el) => (maskPoolRef.current[25] = el)}
                  cx="600"
                  cy="230"
                  r="0"
                  fill="white"
                />
              )}
            </g>
          </mask>

          {/* Liquid body fill: translucent water so the revealed image reads through it */}
          <radialGradient
            id={`ambientBlobGrad_${uniqueId}`}
            cx="45%"
            cy="45%"
            r="55%"
          >
            <stop offset="0%" stopColor={resolvedAccent} stopOpacity="0.4" />
            <stop offset="55%" stopColor={resolvedAccent} stopOpacity="0.26" />
            <stop offset="88%" stopColor={resolvedAccent} stopOpacity="0.16" />
            <stop offset="100%" stopColor={resolvedAccent} stopOpacity="0.42" />
          </radialGradient>

          {/* Inner specular sheen riding the liquid surface */}
          <radialGradient
            id={`liquidSheen_${uniqueId}`}
            cx="38%"
            cy="32%"
            r="42%"
          >
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
            <stop offset="55%" stopColor="#ffffff" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>

          {/* Glow filter for technical HUD strokes */}
          <filter
            id={`hudGlow_${uniqueId}`}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ================= HERO SUBJECT STAGE (SEAMLESS PORTRAIT - NO CARD BOX) ================= */}
        <g className="hero-subject-stage">
          {/* Base Layer: Young Racer Portrait (Unequipped) */}
          <image
            href={resolvedBase}
            x="360"
            y="70"
            width="480"
            height="640"
            preserveAspectRatio="xMidYMid slice"
            mask={`url(#subjectOrganicFade_${uniqueId})`}
          />

          {/* Subtle contrast grading overlay */}
          <rect
            x="360"
            y="70"
            width="480"
            height="640"
            fill="black"
            opacity="0.08"
            mask={`url(#subjectOrganicFade_${uniqueId})`}
            className="pointer-events-none"
          />

          {/* Revealed Equipped Layer: Racing Helmet & Suit */}
          {/* Revealed dynamically ONLY where the water touches the subject! */}
          <g mask={`url(#subjectOrganicFade_${uniqueId})`}>
            <image
              href={resolvedEquipped}
              x="360"
              y="70"
              width="480"
              height="640"
              preserveAspectRatio="xMidYMid slice"
              mask={`url(#globalBlobMask_${uniqueId})`}
            />
          </g>
        </g>

        {/* Visible water droplets roaming the full topography banner */}
        {showAmbientBlobs && (
          <g className="ambient-water-layer pointer-events-none">
            {[...Array(26)].map((_, i) => (
              <circle
                key={`amb-${i}`}
                ref={(el) => (ambientPoolRef.current[i] = el)}
                cx="0"
                cy="0"
                r="0"
                fill={`url(#ambientBlobGrad_${uniqueId})`}
                stroke="#ffffff"
                strokeOpacity="0.3"
                strokeWidth="1"
              />
            ))}
            {blobMode === "flood" && (
              <circle
                ref={(el) => (ambientPoolRef.current[25] = el)}
                cx="600"
                cy="230"
                r="0"
                fill={`url(#ambientBlobGrad_${uniqueId})`}
                stroke="#ffffff"
                strokeOpacity="0.35"
                strokeWidth="1"
              />
            )}
            {/* Puddle ripples where drops splash at the bottom */}
            {[...Array(4)].map((_, i) => (
              <circle
                key={`rip-${i}`}
                ref={(el) => (ripplePoolRef.current[i] = el)}
                cx="600"
                cy="800"
                r="0"
                fill="none"
                stroke={resolvedAccent}
                strokeOpacity="0.55"
                strokeWidth="2"
              />
            ))}
          </g>
        )}

        {/* ================= LAYER 3: AUTHENTIC F1 HELMET TECHNICAL HUD WIREFRAME ================= */}
        {showHud && (
          <g className="hud-overlay-layer pointer-events-none">
            {customSvgMarkup ? (
              <g
                style={{
                  opacity: 0.2 + morphProgress * 0.8,
                  transform: `scale(${0.96 + morphProgress * 0.04})`,
                  transformOrigin: "600px 280px",
                }}
                dangerouslySetInnerHTML={{ __html: customSvgMarkup }}
              />
            ) : activePreset.svgType === "f1-helmet" ? (
              /* AUTHENTIC FIA 8860-2018 ABP FORMULA 1 HELMET SCHEMATIC */
              <g
                filter={`url(#hudGlow_${uniqueId})`}
                fill="none"
                stroke={resolvedAccent}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  opacity: 0.25 + morphProgress * 0.75,
                  transition: "opacity 0.25s ease-out",
                }}
              >
                {/* 1. AERODYNAMIC CARBON SHELL SILHOUETTE */}
                <path
                  d="M 488 285 C 488 175, 530 160, 600 160 C 670 160, 712 175, 712 285 C 712 320, 724 330, 728 342 C 716 345, 702 342, 696 350 C 685 365, 665 395, 600 395 C 535 395, 508 360, 498 340 C 490 325, 488 305, 488 285 Z"
                  strokeWidth="2.2"
                />

                {/* Rear Aerodynamic Ducktail Spoiler Lip */}
                <path d="M 708 275 Q 732 290 730 335" strokeWidth="2.0" />
                <path
                  d="M 698 295 L 726 312"
                  strokeWidth="1.2"
                  strokeDasharray="4 3"
                />

                {/* Chin Gurney Flap (Downforce Lip) */}
                <path d="M 545 395 Q 600 404 655 395" strokeWidth="2.6" />

                {/* 2. FIA 8860-2018 ABP BALLISTIC BROW ARMOR (Zylon Reinforced Strip) */}
                <path
                  d="M 506 242 Q 600 252 694 242 L 690 260 Q 600 270 510 260 Z"
                  fill={resolvedAccent}
                  fillOpacity="0.12"
                  strokeWidth="1.6"
                />
                <path
                  d="M 520 251 Q 600 261 680 251"
                  strokeWidth="1.2"
                  strokeDasharray="6 4"
                />

                {/* 3. VISOR SHIELD APERTURE & CURVATURE */}
                <path
                  d="M 508 260 Q 600 285 692 260 L 682 322 Q 600 348 518 322 Z"
                  strokeWidth="2.2"
                />
                {/* Optical Iridium Reflection Horizon Curve */}
                <path
                  d="M 522 278 Q 600 302 678 278"
                  strokeWidth="1.3"
                  strokeOpacity="0.8"
                />
                <path
                  d="M 532 294 Q 600 316 668 294"
                  strokeWidth="1.0"
                  strokeOpacity="0.5"
                />

                {/* Tear-Off Visor Pull Tab */}
                <path
                  d="M 692 260 L 715 264 L 710 282 L 687 274"
                  strokeWidth="1.6"
                  fill={resolvedAccent}
                  fillOpacity="0.15"
                />
                <circle cx="704" cy="272" r="2.5" fill={resolvedAccent} />

                {/* Mechanical Center Visor Deadbolt Lock Latch */}
                <rect
                  x="594"
                  y="326"
                  width="12"
                  height="9"
                  rx="2"
                  strokeWidth="1.6"
                  fill={resolvedAccent}
                  fillOpacity="0.3"
                />
                <line x1="600" y1="326" x2="600" y2="335" strokeWidth="1.2" />

                {/* 4. CNC ALUMINUM VISOR PIVOT PLATES & ANGLE CALIBRATION NOTCHES */}
                {/* Left Temple Pivot */}
                <circle cx="508" cy="260" r="7" strokeWidth="1.8" />
                <circle cx="508" cy="260" r="3" fill={resolvedAccent} />
                <line x1="508" y1="249" x2="508" y2="253" strokeWidth="1.2" />
                <line x1="497" y1="260" x2="501" y2="260" strokeWidth="1.2" />
                <line x1="508" y1="267" x2="508" y2="271" strokeWidth="1.2" />

                {/* Right Temple Pivot */}
                <circle cx="692" cy="260" r="7" strokeWidth="1.8" />
                <circle cx="692" cy="260" r="3" fill={resolvedAccent} />
                <line x1="692" y1="249" x2="692" y2="253" strokeWidth="1.2" />
                <line x1="699" y1="260" x2="703" y2="260" strokeWidth="1.2" />
                <line x1="692" y1="267" x2="692" y2="271" strokeWidth="1.2" />

                {/* 5. VENTILATION DUCTS & COOLING CHANNELS */}
                {/* Forehead Ram-Air Intake Scoops */}
                <path
                  d="M 548 206 Q 600 192 652 206"
                  strokeDasharray="8 5"
                  strokeWidth="1.8"
                />
                <path
                  d="M 570 224 Q 600 216 630 224"
                  strokeWidth="1.4"
                />

                {/* Top Crown Aerodynamic Vortex Generator Fins */}
                <line x1="565" y1="176" x2="575" y2="164" strokeWidth="1.5" />
                <line x1="595" y1="172" x2="605" y2="160" strokeWidth="1.5" />
                <line x1="625" y1="176" x2="635" y2="164" strokeWidth="1.5" />

                {/* Chin Bar Slotted Air Intake Grilles */}
                <path d="M 560 360 L 640 360" strokeWidth="2.4" />
                <path d="M 570 370 L 630 370" strokeWidth="2.0" />
                <path d="M 580 380 L 620 380" strokeWidth="1.6" />

                {/* 6. HANS / FHR TITANIUM ANCHOR POSTS (M6 Threads) */}
                {/* Left HANS Anchor */}
                <circle
                  cx="516"
                  cy="348"
                  r="8"
                  strokeWidth="1.6"
                  strokeDasharray="3 2"
                />
                <circle
                  cx="516"
                  cy="348"
                  r="4"
                  strokeWidth="1.8"
                  fill={resolvedAccent}
                  fillOpacity="0.2"
                />
                <line x1="510" y1="348" x2="522" y2="348" strokeWidth="1.0" />
                <line x1="516" y1="342" x2="516" y2="354" strokeWidth="1.0" />

                {/* Right HANS Anchor */}
                <circle
                  cx="684"
                  cy="348"
                  r="8"
                  strokeWidth="1.6"
                  strokeDasharray="3 2"
                />
                <circle
                  cx="684"
                  cy="348"
                  r="4"
                  strokeWidth="1.8"
                  fill={resolvedAccent}
                  fillOpacity="0.2"
                />
                <line x1="678" y1="348" x2="690" y2="348" strokeWidth="1.0" />
                <line x1="684" y1="342" x2="684" y2="354" strokeWidth="1.0" />

                {/* 7. COCKPIT LIFE-SUPPORT PORTS */}
                <circle cx="546" cy="378" r="3.5" strokeWidth="1.4" />
                <rect
                  x="644"
                  y="375"
                  width="8"
                  height="6"
                  rx="1.5"
                  strokeWidth="1.4"
                />

                {/* 8. AERODYNAMIC AIRFLOW STREAMLINES */}
                <path
                  d="M 450 200 Q 550 120 740 180"
                  strokeWidth="1.0"
                  strokeDasharray="6 6"
                  strokeOpacity="0.4"
                />
                <path
                  d="M 460 230 Q 560 145 745 220"
                  strokeWidth="1.2"
                  strokeDasharray="8 6"
                  strokeOpacity="0.5"
                />

                {/* 9. TECHNICAL HUD TELEMETRY LABELS & LEADER LINES */}
                <polyline
                  points="692,260 760,210 830,210"
                  strokeWidth="1.4"
                  strokeDasharray="4 3"
                />
                <g
                  fontFamily="ui-monospace, monospace"
                  fontSize="9"
                  fontWeight="700"
                  fill={resolvedAccent}
                  stroke="none"
                >
                  <text x="760" y="200" letterSpacing="1.2">
                    ABP-8860 // BALLISTIC BROW
                  </text>
                  <text x="760" y="226" fontSize="8" opacity="0.8">
                    VISOR LOCK: ENGAGED [TEAR-OFF 03]
                  </text>
                </g>

                <polyline
                  points="516,348 440,360 370,360"
                  strokeWidth="1.4"
                  strokeDasharray="4 3"
                />
                <g
                  fontFamily="ui-monospace, monospace"
                  fontSize="9"
                  fontWeight="700"
                  fill={resolvedAccent}
                  stroke="none"
                  textAnchor="end"
                >
                  <text x="440" y="350" letterSpacing="1.2">
                    FHR ANCHOR // M6 TITANIUM
                  </text>
                  <text x="440" y="376" fontSize="8" opacity="0.8">
                    HANS LOCK: 50G RATED // COMMS OK
                  </text>
                </g>

                <polyline
                  points="600,160 600,115 650,115"
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                />
                <g
                  fontFamily="ui-monospace, monospace"
                  fontSize="8.5"
                  fontWeight="700"
                  fill={resolvedAccent}
                  stroke="none"
                >
                  <text x="655" y="112" letterSpacing="1">
                    AIRBOX AERO DUCT // VENTURI
                  </text>
                </g>
              </g>
            ) : (
              /* FOOTWEAR BLUEPRINT SCHEMATIC */
              <g
                filter={`url(#hudGlow_${uniqueId})`}
                fill="none"
                stroke={resolvedAccent}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  opacity: 0.25 + morphProgress * 0.75,
                  transition: "opacity 0.25s ease-out",
                }}
              >
                <path d="M 460 380 Q 520 280 595 295 Q 675 310 745 385 L 740 430 Q 600 450 455 425 Z" />
                <path
                  d="M 462 408 Q 595 435 738 405"
                  strokeDasharray="10 6"
                  strokeWidth="2"
                />
                <ellipse cx="525" cy="420" rx="30" ry="9" strokeWidth="1.8" />
                <ellipse cx="665" cy="418" rx="36" ry="9" strokeWidth="1.8" />

                <line
                  x1="665"
                  y1="418"
                  x2="760"
                  y2="480"
                  strokeWidth="1.4"
                  strokeDasharray="4 4"
                />
                <line x1="760" y1="480" x2="805" y2="480" strokeWidth="1.5" />

                <g
                  fontFamily="ui-monospace, monospace"
                  fontSize="9"
                  fontWeight="bold"
                  fill={resolvedAccent}
                  stroke="none"
                >
                  <text x="670" y="495" letterSpacing="1">
                    CARBON SOLE // LAYER 02
                  </text>
                  <text x="670" y="510" fontSize="8" opacity="0.75">
                    ZOOM AIR: DUAL PODS
                  </text>
                </g>
              </g>
            )}
          </g>
        )}
      </svg>

      {/* Editorial Header / Telemetry Corner Overlay */}
      <div className="pointer-events-none absolute top-6 left-6 right-6 z-20 flex items-start justify-between">
        <div>
          <div
            className="text-[11px] font-mono uppercase tracking-[0.25em] opacity-80 font-semibold"
            style={{ color: resolvedAccent }}
          >
            {resolvedSubtitle}
          </div>
          <div className="text-2xl md:text-3xl font-black tracking-tight uppercase mt-0.5">
            {resolvedTitle}
          </div>
          <div className="text-xs font-mono opacity-50 uppercase tracking-wider mt-1">
            {activePreset.team}
          </div>
        </div>

        <div className="hidden sm:flex flex-col items-end text-right font-mono text-xs opacity-75">
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-full animate-ping"
              style={{ backgroundColor: resolvedAccent }}
            />
            <span
              className="font-bold tracking-wider"
              style={{ color: resolvedAccent }}
            >
              WATER DROP MORPH: ACTIVE
            </span>
          </div>
          <span className="text-[11px] opacity-60 mt-1">
            FRAME RATE: 60 FPS // CONTAINER WATER
          </span>
        </div>
      </div>
    </div>
  );
}

export default BlobMorphHero;

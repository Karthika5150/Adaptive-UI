"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";

const managers = ["npm", "pnpm", "yarn"];

const command = (manager, packages, dev) =>
  manager === "npm"
    ? `npm install ${dev ? "-D " : ""}${packages}`
    : `${manager} add ${dev ? "-D " : ""}${packages}`;

const STORAGE_KEY = "adaptive-ui:package-manager";
const listeners = new Set();
const read = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return managers.includes(stored) ? stored : "npm";
  } catch {
    return "npm";
  }
};
const choose = (manager) => {
  try {
    localStorage.setItem(STORAGE_KEY, manager);
  } catch {}
  listeners.forEach((listener) => listener());
};
const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export function InstallTabs({ packages, dev = false, className = "" }) {
  const reduceMotion = useReducedMotion();
  const id = useId();
  const manager = useSyncExternalStore(subscribe, read, () => "npm");
  const [copied, setCopied] = useState(false);
  const text = command(manager, packages, dev);

  function onKey(event, index) {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = managers[(index + step + managers.length) % managers.length];
    choose(next);
    document.getElementById(`${id}-${next}`)?.focus();
  }

  async function copyCommand() {
    try {
      const currentText = command(manager, packages, dev);
      await navigator.clipboard.writeText(currentText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {}
  }

  return (
    <div
      className={`w-full overflow-hidden rounded-xl border border-white/10 bg-[#ffffff0d] text-white ${className}`}
    >
      <div className="flex items-center justify-between border-b border-white/[0.08] px-2 py-1.5">
        <div role="tablist" aria-label="Package manager" className="flex">
          <AnimatePresence mode="popLayout" initial={false}>
            {managers.map((option, index) => (
              <motion.button
                key={option}
                id={`${id}-${option}`}
                role="tab"
                aria-selected={manager === option}
                aria-controls={`${id}-panel`}
                tabIndex={manager === option ? 0 : -1}
                onClick={() => choose(option)}
                onKeyDown={(event) => onKey(event, index)}
                className={`relative flex items-center gap-1 rounded-md px-2.5 py-1 font-mono text-xs transition-colors focus-visible:outline-2 focus-visible:outline-[#5FAEB4] ${
                  manager === option ? "text-white" : "text-gray-400 hover:text-white"
                }`}
                layout
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 8 }}
                transition={{ duration: 0.18 }}
              >
                {manager === option && (
                  <motion.span
                    layoutId={`${id}-pill`}
                    aria-hidden
                    className="absolute inset-0 rounded-md bg-white/[0.08]"
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { type: "spring", bounce: 0.2, duration: 0.35 }
                    }
                  />
                )}
                <span className="relative">{option}</span>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
        <button
          type="button"
          onClick={copyCommand}
          className="flex items-center font-plex gap-1 rounded-md px-2 py-1 text-xs text-gray-400 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-[#5FAEB4]"
          aria-label="Copy command"
        >
          {copied ? <Check size={14} /> : "Copy"}
        </button>
      </div>
      <div
        id={`${id}-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-${manager}`}
        className="relative overflow-hidden px-4 py-3 font-mono text-sm"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.code
            key={manager}
            className="block whitespace-nowrap text-gray-300"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            <span className="select-none text-[#5FAEB4]">$ </span>
            {text}
          </motion.code>
        </AnimatePresence>
        <span role="status" className="sr-only">
          {copied ? "Copied" : ""}
        </span>
      </div>
    </div>
  );
}
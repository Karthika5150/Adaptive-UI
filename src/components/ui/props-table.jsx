"use client";

import React, { useState } from "react";
import { Search, Copy, Check, SlidersHorizontal } from "lucide-react";

/**
 * PropsTable Component
 * Reusable table component for documenting props across Adaptive-UI components.
 *
 * @param {Array} data - Array of prop definitions: [{ prop, type, default, description, required }]
 * @param {string} title - Optional table title (default: "Props Reference")
 * @param {string} description - Optional table description
 * @param {string} className - Optional container className
 */
export function PropsTable({
  data = [],
  title = "Props Reference",
  description = "Complete reference of all customizable properties and parameters.",
  className = "",
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedProp, setCopiedProp] = useState(null);

  const filteredData = data.filter((item) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      item.prop.toLowerCase().includes(query) ||
      (item.type && item.type.toLowerCase().includes(query)) ||
      (item.description && item.description.toLowerCase().includes(query))
    );
  });

  const copyPropName = async (propName) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(propName);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = propName;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopiedProp(propName);
      setTimeout(() => setCopiedProp(null), 1800);
    } catch (e) {
      console.warn("Clipboard copy failed:", e);
    }
  };

  return (
    <div className={`space-y-4 w-full ${className}`}>
      {/* Table Header with Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xl md:text-2xl font-bold font-sans text-white flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-lime-400" />
            <span>{title}</span>
          </h3>
          {description && (
            <p className="mt-1 text-xs md:text-sm text-gray-400 font-sans">
              {description}
            </p>
          )}
        </div>

        {/* Search Filter Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search props, types..."
            className="w-full bg-zinc-900/80 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-lime-400/50 transition font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs font-mono"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Main Table Container */}
      <div className="rounded-2xl border border-white/10 overflow-hidden bg-zinc-950 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-zinc-900/70 border-b border-white/10 font-mono text-zinc-400">
              <tr>
                <th className="py-3 px-4 font-semibold w-1/4">Prop</th>
                <th className="py-3 px-4 font-semibold w-1/5">Type</th>
                <th className="py-3 px-4 font-semibold w-1/6">Default</th>
                <th className="py-3 px-4 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-300">
              {filteredData.length > 0 ? (
                filteredData.map((item, idx) => (
                  <tr
                    key={item.prop || idx}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* Prop Name */}
                    <td className="py-3.5 px-4 font-mono">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => copyPropName(item.prop)}
                          className="font-semibold text-lime-400 hover:text-lime-300 transition flex items-center gap-1 cursor-pointer"
                          title="Click to copy prop name"
                        >
                          <span>{item.prop}</span>
                          {copiedProp === item.prop ? (
                            <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                          ) : (
                            <Copy className="w-3 h-3 text-zinc-600 opacity-0 group-hover:opacity-100 transition shrink-0" />
                          )}
                        </button>
                        {item.required && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-sans">
                            required
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Type Badge */}
                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-zinc-900 text-cyan-300 border border-white/5">
                        {item.type}
                      </span>
                    </td>

                    {/* Default Value */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-400">
                      {item.default ? (
                        <code className="bg-zinc-900 px-1.5 py-0.5 rounded text-amber-300/90 border border-white/5">
                          {item.default}
                        </code>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>

                    {/* Description */}
                    <td className="py-3.5 px-4 text-gray-300 leading-relaxed font-sans">
                      {item.description}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="py-8 text-center text-zinc-500 font-mono text-xs"
                  >
                    No matching props found for &quot;{searchQuery}&quot;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PropsTable;

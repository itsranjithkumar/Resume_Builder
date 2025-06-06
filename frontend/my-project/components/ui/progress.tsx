// components/ui/progress.tsx
import React from "react";

export function Progress({ value, max = 100, className = "" }: { value: number; max?: number; className?: string }) {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2.5 ${className}`}>
      <div
        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
        style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
      />
    </div>
  );
}
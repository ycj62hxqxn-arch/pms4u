"use client";
import React from "react"; 
export default function FadeIn({ children }: { children: React.ReactNode }) {
  return (
    <div className="opacity-100 translate-y-0 transition-all duration-700">
      {children}
    </div>
  );
}
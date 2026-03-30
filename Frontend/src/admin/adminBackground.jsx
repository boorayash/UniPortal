import React from "react";

export default function AdminBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[0]">
      {/* Long vertical gradient flow */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c1222] via-[#070b14] to-[#021017] opacity-90" />
      
      {/* Top-Left Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-indigo-600/15 rounded-full blur-[130px]" />
      
      {/* Middle-Right Glow */}
      <div className="absolute top-[40%] right-[-10%] w-[45vw] h-[45vw] max-w-[700px] max-h-[700px] bg-purple-600/10 rounded-full blur-[140px]" />

      {/* Bottom-Left Glow */}
      <div className="absolute bottom-[-20%] left-[10%] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-cyan-600/10 rounded-full blur-[150px]" />
    </div>
  );
}

// client/src/components/background/Background.jsx
import React from "react";

const Background = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-[#0B1220] pointer-events-none overflow-hidden">
      {/* Subtle, restrained radial gradients for realistic depth */}
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-blue-900/10 blur-[120px]" />
      <div className="absolute top-1/2 -right-40 h-[600px] w-[600px] rounded-full bg-indigo-900/10 blur-[150px]" />
    </div>
  );
};

export default Background;

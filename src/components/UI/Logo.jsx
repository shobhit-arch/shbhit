import React from 'react';

export default function Logo({ className = "", collapsed = false }) {
  if (collapsed) {
    return (
      <div className={`w-10 h-10 rounded-xl bg-[#3b82f6] flex items-center justify-center shadow-lg text-white font-black text-2xl ${className}`}>
        e
      </div>
    );
  }

  return (
    <svg 
      viewBox="0 0 240 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`h-8 w-auto ${className}`}
    >
      <style>
        {`
          .logo-main { font-family: 'Inter', -apple-system, sans-serif; font-weight: 700; font-size: 28px; }
          .logo-sub { font-family: 'Inter', -apple-system, sans-serif; font-weight: 300; font-size: 28px; }
        `}
      </style>
      
      {/* "e" */}
      <text x="0" y="30" className="logo-main" fill="#3b82f6">e</text>
      
      {/* "Health" */}
      <text x="18" y="30" className="logo-main" fill="currentColor">Health</text>
      
      {/* "Source" */}
      <text x="105" y="30" className="logo-sub" fill="currentColor" opacity="0.8">Source</text>
    </svg>
  );
}

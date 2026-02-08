import React from 'react';

interface FauxMobileDeviceProps {
  children: React.ReactNode;
}

export default function FauxMobileDevice({ children }: FauxMobileDeviceProps) {
  return (
    <div className="relative mx-auto border-gray-900 dark:border-zinc-800 bg-gray-900 border-[14px] rounded-[2.5rem] h-full max-h-[844px] w-[448px] shadow-2xl flex flex-col overflow-hidden">
      {/* Notch */}
      <div className="w-[148px] h-[18px] bg-gray-900 top-0 left-1/2 -translate-x-1/2 rounded-b-[1rem] absolute z-20"></div>

      {/* Buttons */}
      <div className="h-[46px] w-[3px] bg-gray-900 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
      <div className="h-[46px] w-[3px] bg-gray-900 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
      <div className="h-[64px] w-[3px] bg-gray-900 absolute -right-[17px] top-[142px] rounded-r-lg"></div>

      {/* Screen */}
      <div className="rounded-[2rem] overflow-hidden w-full h-full bg-background flex flex-col relative z-10">
        {children}
      </div>
    </div>
  );
}

'use client';

import Image from 'next/image';

export function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-3xl mx-auto w-full antialiased animate-fade-in">
      
      {/* ── Center Spark Icon & Welcome Header ── */}
      <div className="flex flex-col items-center text-center">
        <div className="w-14 h-14 flex items-center justify-center mb-2">
          <Image src="/nexis-logo.png" alt="Nexis logo" width={60} height={60} />
        </div>
        <h2 className="text-3xl  font-bold tracking-tight text-content-primary mb-2">
          Hello! I&apos;m Nexis
        </h2>
        <p className="text-sm text-content-secondary max-w-md"> 
          How can I help you today?
        </p>
      </div> 
    </div>
  );
}
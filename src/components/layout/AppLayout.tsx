import React, { useState, useEffect } from 'react';
import { ToastProvider } from '@/components/ui/Toast';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="font-sans antialiased bg-slate-50 text-slate-900">
        {children}
      </div>
    </ToastProvider>
  );
}

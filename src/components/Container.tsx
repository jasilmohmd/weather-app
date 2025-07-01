// import { cn } from '@/utils/cn';
import React from 'react'

export default function Container({ className, children, ...rest }: React.HTMLProps<HTMLDivElement>) {
  return (
    <div
      className={`bg-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl shadow-2xl ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}





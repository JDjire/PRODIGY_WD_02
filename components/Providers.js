"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export default function Providers({ children, session }) {
  return (
    <SessionProvider session={session}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          className: "!bg-surface-elevated !text-slate-100 !border !border-surface-border",
          duration: 4000,
        }}
      />
    </SessionProvider>
  );
}

"use client";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useEffect, useState } from "react";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;
  const [showWelcome, setShowWelcome] = useState(true);
  const [loadingBar, setLoadingBar] = useState(false);

  useEffect(() => {
    // Only show loader on first entry in this session
    if (typeof window !== 'undefined') {
      if (sessionStorage.getItem('hasSeenWelcome')) {
        setShowWelcome(false);
        return;
      }
      setLoadingBar(true);
      const timer = setTimeout(() => {
        setShowWelcome(false);
        sessionStorage.setItem('hasSeenWelcome', 'true');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      {showWelcome ? (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
          <div className="text-lg md:text-xl font-semibold text-primary mb-4 text-center">Welcome to<br />Dimos Amathountas</div>
          <div className="w-40 h-1.5 bg-gray-200 rounded-full overflow-hidden mb-1">
            <div
              className="h-full bg-primary transition-all duration-1000"
              style={{ width: loadingBar ? '100%' : '0%' }}
            />
          </div>
        </div>
      ) : (
        <>
          {!isAdmin && <Navbar />}
          <main>{children}</main>
          {!isAdmin && <Footer />}
        </>
      )}
    </>
  );
} 
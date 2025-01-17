"use client";
import { Navbar, Sidebar } from "@/components/navigation";
import { ProtectedLayout } from "@/components/layouts/protectLayouts";
import Script from "next/script";
import Loading from "./loading"; // Import the Loading component
import { useState, useEffect } from "react";

export default function AccountLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   // Simulate a loading delay
  //   const timer = setTimeout(() => setIsLoading(false), 2000);
  //   return () => clearTimeout(timer);
  // }, []);

  

  return (
    
    <ProtectedLayout>
      <section>
        <div className="relative sm:p-8 p-4 flex flex-row">
          <div className="sm:flex hidden mr-10 relative">
            <Sidebar />
          </div>
          <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
            <Navbar showSearch={false} />
            {children}
            
          </div>
        </div>
      </section>
    </ProtectedLayout>
  );
}
import Link from "next/link";
import React from "react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-3 cursor-pointer group ${className}`}>
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg overflow-hidden group-hover:shadow-xl transition-all duration-300">
        {/* Hexagon / Cube abstraction */}
        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTIxIDE2VjhMMTIgMjBMMyAxNlY4TDEyIDRMMjEgOFoiPjwvcGF0aD48L3N2Zz4=')] bg-center bg-no-repeat bg-[length:24px_24px]"></div>
        <span className="material-symbols-outlined text-white text-xl z-10 drop-shadow-md group-hover:scale-110 transition-transform duration-300">
          hub
        </span>
      </div>
      <div className="flex flex-col">
        <h1 className="font-headline-md text-xl md:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-tight">
          MediChain
        </h1>
      </div>
    </Link>
  );
}

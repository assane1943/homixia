"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { name: "Équipe", path: "/admin/equipe", emoji: "👥" },
    { name: "Logements", path: "/admin/logements", emoji: "🏠" },
    { name: "Services", path: "/admin/services", emoji: "🧾" },
    { name: "Avis", path: "/admin/avis", emoji: "⭐" },
  ];

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* SIDEBAR */}
      <aside className="md:w-64 w-full bg-amber-400 text-black flex flex-col p-4 md:h-screen shadow-md relative">
        <div className="flex items-center justify-between md:justify-center mb-4">
          <div className="flex items-center gap-2">
            <Image
              src="/logo-homixia.png"
              alt="Homixia"
              width={40}
              height={40}
              className="rounded-full bg-white p-1"
            />
            <h1 className="text-lg font-bold">Homixia Admin</h1>
          </div>

          {/* BOUTON MENU MOBILE */}
          <button
            className="md:hidden text-2xl font-bold"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>

        {/* NAVIGATION */}
        <nav
          className={`flex flex-col gap-2 mt-4 ${
            menuOpen ? "block" : "hidden md:flex"
          }`}
        >
          {links.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                pathname === link.path
                  ? "bg-black/20 text-black"
                  : "hover:bg-black/10"
              }`}
            >
              <span>{link.emoji}</span>
              {link.name}
            </Link>
          ))}
        </nav>

        <footer className="mt-auto text-xs text-center text-black/70">
          © {new Date().getFullYear()} Homixia
        </footer>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <section className="flex-1 p-4 overflow-y-auto">
        {children}
      </section>
    </main>
  );
}

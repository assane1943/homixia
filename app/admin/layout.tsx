"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";

const nav = [
  { label: "Dashboard", href: "/admin", icon: "📊" },
  { label: "Appartements", href: "/admin/appartements", icon: "🏡" },
  { label: "Réservations", href: "/admin/reservations", icon: "📅" },
  { label: "Services", href: "/admin/services", icon: "🧰" },
  { label: "Avis", href: "/admin/avis", icon: "⭐" },
  { label: "Check-in", href: "/admin/checkin", icon: "📝" },
  { label: "Paramètres", href: "/admin/settings", icon: "⚙️" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // On supprime tout login → admin toujours accessible
  const isLoginPage = pathname === "/admin/login";
  if (isLoginPage) return <>{children}</>;

  const [dateText, setDateText] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setDateText(
        now.toLocaleString("fr-FR", {
          weekday: "long",
          day: "numeric",
          month: "long",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  const logout = () => {
    // logout inutile mais laissé au cas où
    localStorage.removeItem("homixia_admin");
    router.push("/admin/login");
  };

  return (
    <main className="min-h-screen bg-amber-50 flex flex-col pb-20">

      {/* HEADER */}
      <header className="w-full py-3 px-5 bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 flex items-center justify-between">
        <h1 className="text-lg font-bold text-amber-700">
          {nav.find((l) => pathname.startsWith(l.href))?.label || "Admin"}
        </h1>

        <button
          onClick={logout}
          className="text-sm font-semibold bg-red-200 text-black px-4 py-1.5 rounded-lg shadow active:scale-95"
        >
          Déconnexion
        </button>
      </header>

      <div className="w-full bg-amber-100 text-amber-700 text-center py-2 text-sm border-b border-amber-200">
        <span className="font-semibold">Bienvenue sur Homixia 👋</span> — {dateText}
      </div>

      <div className="flex-1 px-4 py-5">{children}</div>

      {/* NAVIGATION BAS */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex justify-around py-2">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center text-xs font-medium px-3 py-1 transition ${
                  active ? "text-amber-600" : "text-gray-500"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </main>
  );
}

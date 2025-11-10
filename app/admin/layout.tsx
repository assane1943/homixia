"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const menu = [
  { name: "Dashboard", path: "/admin", icon: "📊" },
  { name: "Propriétés", path: "/admin/logements", icon: "🏠" },
  { name: "Services", path: "/admin/services", icon: "🧼" },
  { name: "Avis", path: "/admin/avis", icon: "💬" },
  { name: "Paramètres", path: "/admin/parametres", icon: "⚙️" }, // ✅ corrigé ici
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* 🧭 Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Image
              src="/logo-homixia.png"
              alt="Homixia"
              width={40}
              height={40}
              className="rounded-full"
            />
            <h1 className="text-lg font-bold text-amber-600">Homixia Admin</h1>
          </div>

          <nav className="space-y-2">
            {menu.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                  pathname === item.path
                    ? "bg-amber-100 text-amber-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span>{item.icon}</span> {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* 🚪 Bouton déconnexion */}
        <button
          onClick={() => {
            localStorage.removeItem("homixia_admin");
            window.location.href = "/login";
          }}
          className="bg-red-100 text-red-600 text-sm px-3 py-2 rounded-lg font-semibold hover:bg-red-200"
        >
          🚪 Déconnexion
        </button>
      </aside>

      {/* 🧱 Contenu principal */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

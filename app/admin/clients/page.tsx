"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ClientsAdmin() {
  const [clients, setClients] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/clients")
      .then((r) => r.json())
      .then(setClients);
  }, []);

  const filtered = clients.filter((c) =>
    c.nom.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-amber-700">
        👤 Gestion des clients
      </h1>

      {/* Barre de recherche */}
      <input
        placeholder="Rechercher un client..."
        className="w-full border p-3 rounded-xl"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Liste */}
      <div className="space-y-4">
        {filtered.map((c) => (
          <Link
            key={c.nom}
            href={`/admin/clients/${encodeURIComponent(c.nom)}`}
          >
            <div className="bg-white p-4 rounded-xl shadow border cursor-pointer hover:bg-gray-50 transition">
              <h2 className="font-semibold text-lg">{c.nom}</h2>

              <p className="text-sm text-gray-600 mt-2">
                📝 Check-in : <b>{c.checkins}</b>
              </p>
              <p className="text-sm text-gray-600">
                ⭐ Avis : <b>{c.avis}</b>
              </p>
              <p className="text-sm text-gray-600">
                🧰 Services : <b>{c.services}</b>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

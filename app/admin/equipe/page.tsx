"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function EquipeAdmin() {
  const [equipe, setEquipe] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/equipe")
      .then((r) => r.json())
      .then(setEquipe);
  }, []);

  return (
    <main className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-amber-700">👥 Gestion de l’équipe</h1>

        <Link
          href="/admin/equipe/nouveau"
          className="px-4 py-2 bg-amber-600 text-white rounded-lg shadow"
        >
          + Ajouter
        </Link>
      </div>

      <div className="space-y-4">
        {equipe.map((m) => (
          <Link
            key={m.id}
            href={`/admin/equipe/${m.id}`}
            className="block bg-white p-4 rounded-xl border shadow hover:bg-gray-50"
          >
            <h2 className="font-semibold text-lg">{m.nom}</h2>
            <p className="text-sm text-gray-600">{m.email}</p>
            <p className="text-xs text-gray-500">Rôle : {m.role}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}

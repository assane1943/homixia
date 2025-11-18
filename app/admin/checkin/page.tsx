"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface CheckIn {
  id: string;
  nom: string;
  accepted: boolean;
  passportUrl?: string | null;
  signature: string;
  createdAt: string;
  appartement?: {
    code: string;
    nom: string;
  } | null;
}

export default function AdminCheckInPage() {
  const [data, setData] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/check-in")   // 👈 CORRECTION ICI
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch((e) => console.error("Erreur fetch check-in:", e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="p-4 text-sm text-gray-700">
        Chargement des check-in...
      </main>
    );
  }

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-amber-700">
        ✅ Check-in des clients
      </h1>

      {data.length === 0 ? (
        <p className="text-sm text-gray-500">
          Aucun check-in pour le moment.
        </p>
      ) : (
        <div className="space-y-3">
          {data.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-xl border shadow p-3 text-sm flex flex-col gap-2"
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">{c.nom}</p>

                  <p className="text-xs text-gray-500">
                    {c.appartement
                      ? `${c.appartement.nom} (${c.appartement.code})`
                      : "Appartement inconnu"}
                  </p>
                </div>

                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    c.accepted
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {c.accepted ? "Contrat accepté" : "Non accepté"}
                </span>
              </div>

              <p className="text-xs text-gray-500">
                {new Date(c.createdAt).toLocaleString("fr-FR")}
              </p>

              <div className="flex gap-3 flex-wrap mt-1">
                {c.passportUrl && (
                  <Link
                    href={c.passportUrl}
                    target="_blank"
                    className="text-xs text-blue-600 underline"
                  >
                    Voir pièce d’identité
                  </Link>
                )}

                <Link
                  href={c.signature}
                  target="_blank"
                  className="text-xs text-blue-600 underline"
                >
                  Voir signature
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

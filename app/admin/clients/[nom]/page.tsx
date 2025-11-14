"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ClientProfile() {
  const { nom } = useParams();
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    fetch(`/api/clients/${nom}`)
      .then((r) => r.json())
      .then(setData);
  }, [nom]);

  if (!data)
    return <p className="p-6 text-amber-600">Chargement...</p>;

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-amber-700">
        👤 Profil : {data.nom}
      </h1>

      <section className="space-y-4">

        {/* CHECK-IN */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold text-lg text-amber-700">📝 Check-in</h2>
          {data.checkins.length === 0 ? (
            <p className="text-gray-500 text-sm">Aucun check-in</p>
          ) : (
            data.checkins.map((c: any) => (
              <div key={c.id} className="mt-2 border-b pb-2">
                <p className="text-sm">
                  {new Date(c.createdAt).toLocaleString("fr-FR")}
                </p>
              </div>
            ))
          )}
        </div>

        {/* AVIS */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold text-lg text-amber-700">⭐ Avis</h2>
          {data.avis.length === 0 ? (
            <p className="text-gray-500 text-sm">Aucun avis</p>
          ) : (
            data.avis.map((a: any) => (
              <div key={a.id} className="mt-2 border-b pb-2">
                <p className="text-sm font-semibold">
                  {a.note}/5 — {a.appartement?.nom}
                </p>
                <p className="text-sm">{a.commentaire}</p>
              </div>
            ))
          )}
        </div>

        {/* SERVICES */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold text-lg text-amber-700">🧰 Services</h2>
          {data.services.length === 0 ? (
            <p className="text-gray-500 text-sm">Aucun service</p>
          ) : (
            data.services.map((s: any) => (
              <div key={s.id} className="mt-2 border-b pb-2">
                <p className="font-semibold">
                  {s.nom} — {s.prix}
                </p>
                <p className="text-sm text-gray-600">
                  {s.appartement?.nom} —{" "}
                  {new Date(s.date).toLocaleString("fr-FR")}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

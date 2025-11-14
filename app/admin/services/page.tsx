"use client";

import { useEffect, useState } from "react";

export default function ServicesAdmin() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = () => {
    fetch("/api/services")
      .then((res) => res.json())
      .then(setServices)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchServices();
  }, []);

  if (loading)
    return (
      <main className="min-h-screen flex items-center justify-center text-amber-600">
        Chargement des services...
      </main>
    );

  async function updateStatut(id: number, statut: string) {
    await fetch(`/api/services/${id}`, {
      method: "PUT",
      body: JSON.stringify({ statut }),
    });
    fetchServices();
  }

  async function deleteService(id: number) {
    if (!confirm("Supprimer ce service ?")) return;
    await fetch(`/api/services/${id}`, {
      method: "DELETE",
    });
    fetchServices();
  }

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-amber-700 mb-4">
        🧰 Gestion des services
      </h1>

      <section className="space-y-4">
        {services.map((s) => (
          <div
            key={s.id}
            className="bg-white shadow p-4 rounded-xl border border-amber-100"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-lg text-gray-800">{s.nom}</h2>
              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  s.statut === "terminé"
                    ? "bg-green-100 text-green-700"
                    : s.statut === "planifié"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {s.statut}
              </span>
            </div>

            <p className="text-sm text-gray-600">
              👤 Client : <span className="font-medium">{s.client}</span>
            </p>
            <p className="text-sm text-gray-600">
              🏡 Appartement :{" "}
              <span className="font-medium">{s.appartement?.nom}</span> (
              {s.appartement?.ville})
            </p>
            <p className="text-sm text-gray-600">💰 Prix : {s.prix}</p>
            <p className="text-xs text-gray-400 mt-2">
              📅 {new Date(s.date).toLocaleString("fr-FR")}
            </p>

            {/* Boutons */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => updateStatut(s.id, "planifié")}
                className="px-3 py-1 text-xs bg-blue-500 text-white rounded-lg"
              >
                Planifié
              </button>

              <button
                onClick={() => updateStatut(s.id, "terminé")}
                className="px-3 py-1 text-xs bg-green-600 text-white rounded-lg"
              >
                Terminé
              </button>

              <button
                onClick={() => deleteService(s.id)}
                className="px-3 py-1 text-xs bg-red-500 text-white rounded-lg"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

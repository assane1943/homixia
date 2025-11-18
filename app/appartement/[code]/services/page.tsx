"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Service {
  id: number;
  nom: string;
  prix?: string | null;
  logement?: string | null;
  statut: string;
}

export default function ServicesPage() {
  const router = useRouter();
  const params = useParams() as { code?: string };
  const code = params?.code as string | undefined;

  const [services, setServices] = useState<Service[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Icônes automatiques selon le nom
  const iconFor = (name: string) => {
    if (name.toLowerCase().includes("ménage")) return "🧹";
    if (name.toLowerCase().includes("cuisine")) return "👩🏽‍🍳";
    if (name.toLowerCase().includes("chauffeur")) return "🚖";
    if (name.toLowerCase().includes("voiture")) return "🚗";
    if (name.toLowerCase().includes("guide")) return "🗺️";
    if (name.toLowerCase().includes("médecin")) return "🩺";
    if (name.toLowerCase().includes("massage")) return "💆🏽‍♂️";
    if (name.toLowerCase().includes("ongle")) return "💅";
    if (name.toLowerCase().includes("linge")) return "🧺";
    if (name.toLowerCase().includes("sport")) return "🏋🏽‍♂️";
    return "🧰";
  };

  useEffect(() => {
    if (!code) return;
    setLoading(true);

    fetch(`/api/appartement/${code}/services`)
      .then(async (r) => {
        const data = await r.json();
        return Array.isArray(data) ? data : [];
      })
      .then(setServices)
      .catch((err) => console.error("Erreur services:", err))
      .finally(() => setLoading(false));
  }, [code]);

  const handleContact = (service: Service) => {
    const text = `Bonjour, je souhaiterais réserver ou avoir plus d'informations concernant le service : ${service.nom}.`;

    setMessage(`Ouverture de WhatsApp pour ${service.nom}...`);

    window.open(
      `https://wa.me/212665247695?text=${encodeURIComponent(text)}`,
      "_blank"
    );

    setTimeout(() => setMessage(null), 2500);
  };

  if (!code) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Code appartement manquant.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-gray-800 pb-24">
      {/* Header */}
      <header className="flex items-center justify-center relative py-4 mb-2 border-b border-gray-100">
        <button
          onClick={() => router.push(`/appartement/${code}`)}
          className="absolute left-4 text-amber-600 text-2xl font-bold active:scale-95"
          aria-label="Retour"
        >
          ←
        </button>
        <h1 className="text-lg font-semibold text-amber-600">
          Services à la demande 🧰
        </h1>
      </header>

      {/* Notification */}
      {message && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-4 py-2 rounded-full shadow-md text-sm font-medium z-50">
          {message}
        </div>
      )}

      {/* Liste */}
      <div className="max-w-md mx-auto px-4 mt-4 space-y-4">
        {loading ? (
          <p className="text-center text-gray-500">
            Chargement des services...
          </p>
        ) : services.length === 0 ? (
          <p className="text-center text-gray-500">
            Aucun service configuré pour ce logement.
          </p>
        ) : (
          services.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between bg-white p-4 rounded-2xl shadow border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{iconFor(s.nom)}</span>
                <div>
                  <h3 className="font-semibold text-sm">{s.nom}</h3>
                  {s.prix && (
                    <p className="text-xs text-gray-500">Prix : {s.prix}</p>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleContact(s)}
                className="text-xs px-3 py-2 rounded-full bg-amber-500 text-white font-semibold active:scale-95"
              >
                Contacter
              </button>
            </div>
          ))
        )}
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Service {
  id: number;
  nom: string;
  prix?: string | null;
  logement?: string | null;
  statut: string;
  date: string;
}

export default function AppartementServicesPage({
  params,
}: {
  params: { code: string };
}) {
  const { code } = params;
  const router = useRouter();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/appartement/${code}/services`)
      .then((r) => r.json())
      .then((d) => setServices(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [code]);

  const handleContact = (service: Service) => {
    const whatsapp = "+212665247695";

    const text = `Bonjour, je souhaiterais réserver ou avoir plus d'informations concernant le service : *${service.nom}*.`;

    setMessage(`Ouverture de WhatsApp pour ${service.nom}...`);

    window.open(
      `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`,
      "_blank"
    );

    setTimeout(() => setMessage(null), 2000);
  };

  if (loading) {
    return (
      <main className="p-4 text-center text-amber-700">
        Chargement des services...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-gray-800 pb-24">
      {/* Header */}
      <header className="flex items-center justify-center relative py-4 mb-3 border-b border-gray-200">
        <button
          onClick={() => router.push(`/appartement/${code}`)}
          className="absolute left-4 text-amber-600 text-2xl font-bold active:scale-95"
        >
          ←
        </button>

        <h1 className="text-lg font-semibold text-amber-700">
          Services à la demande 🧰
        </h1>
      </header>

      {/* Message WhatsApp */}
      {message && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-4 py-2 rounded-full shadow text-sm z-50">
          {message}
        </div>
      )}

      {/* Liste des services */}
      <div className="max-w-md mx-auto px-4 space-y-4">
        {services.length === 0 ? (
          <p className="text-center text-gray-500 text-sm">
            Aucun service disponible pour cet appartement.
          </p>
        ) : (
          services.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between bg-white p-4 rounded-2xl shadow border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">🧰</span>

                <div>
                  <h3 className="font-semibold text-sm">{s.nom}</h3>

                  {s.prix && (
                    <p className="text-xs text-gray-500">Prix : {s.prix}</p>
                  )}

                  {s.logement && (
                    <p className="text-xs text-gray-500">
                      Logement : {s.logement}
                    </p>
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

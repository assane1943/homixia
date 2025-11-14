"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Service {
  nom: string;
  icone: string;
  whatsapp: string;
}

export default function ServicesPage() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  const services: Service[] = [
    { nom: "Femme de ménage", icone: "🧹", whatsapp: "+212665247695" },
    { nom: "Cuisinière", icone: "👩🏽‍🍳", whatsapp: "+212665247695" },
    { nom: "Chauffeur", icone: "🚖", whatsapp: "+212665247695" },
    { nom: "Location de voiture", icone: "🚗", whatsapp: "+212665247695" },
    { nom: "Guide touristique", icone: "🗺️", whatsapp: "+212665247695" },
    { nom: "Médecin à domicile", icone: "🩺", whatsapp: "+212665247695" },

    // Nouveaux services
    { nom: "Service de massage", icone: "💆🏽‍♂️", whatsapp: "+212665247695" },
    { nom: "Onglerie", icone: "💅", whatsapp: "+212665247695" },
    { nom: "Blanchisserie", icone: "🧺", whatsapp: "+212665247695" },
    { nom: "Professeur de sport", icone: "🏋🏽‍♂️", whatsapp: "+212665247695" },
  ];

  const handleContact = (service: Service) => {
    const text = `Bonjour, je souhaiterais réserver ou avoir plus d'informations concernant le service : ${service.nom}.`;
    setMessage(`Ouverture de WhatsApp pour ${service.nom}...`);
    window.open(
      `https://wa.me/${service.whatsapp}?text=${encodeURIComponent(text)}`,
      "_blank"
    );
    setTimeout(() => setMessage(null), 2500);
  };

  return (
    <main className="min-h-screen bg-white text-gray-800 font-sans pb-24">
      {/* Header */}
      <header className="flex items-center justify-center relative py-4 mb-2 border-b border-gray-100">
        <button
          onClick={() => router.push("/")}
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

      {/* Liste des services */}
      <div className="max-w-md mx-auto px-4 mt-4 space-y-4">
        {services.map((s, i) => (
          <div
            key={i}
            className="flex items-center justify-between bg-white p-4 rounded-2xl shadow border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{s.icone}</span>
              <div>
                <h3 className="font-semibold text-sm">{s.nom}</h3>
              </div>
            </div>
            <button
              onClick={() => handleContact(s)}
              className="text-xs px-3 py-2 rounded-full bg-amber-500 text-white font-semibold active:scale-95"
            >
              Contacter
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Lieu {
  categorie: "restaurant" | "lieu";
  nom: string;
  type: string;
  description?: string;
  adresse?: string;
  horaire: string;
  lat: number;
  lng: number;
  image?: string;
}

interface CityData {
  ville: string;
  pays: string;
  lieux: Lieu[];
}

export default function ExplorerVille() {
  const [data, setData] = useState<CityData | null>(null);
  const [filtre, setFiltre] = useState<"all" | "restaurant" | "lieu">("all");
  const router = useRouter();

  useEffect(() => {
    fetch("/city.json")
      .then((r) => r.json())
      .then(setData)
      .catch((err) => console.error(err));
  }, []);

  if (!data)
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Chargement des informations...</p>
      </main>
    );

  const filteredPlaces =
    filtre === "all" ? data.lieux : data.lieux.filter((p) => p.categorie === filtre);

  const openMaps = (lat: number, lng: number, name: string) => {
    const url = `https://www.google.com/maps?q=${lat},${lng} (${encodeURIComponent(name)})`;
    window.open(url, "_blank");
  };

  const mapCenter = {
    lat: data.lieux.reduce((sum, l) => sum + l.lat, 0) / data.lieux.length,
    lng: data.lieux.reduce((sum, l) => sum + l.lng, 0) / data.lieux.length,
  };

  return (
    <main className="min-h-screen bg-white text-gray-800 font-sans pb-24">
      {/* Header avec flèche retour */}
      <header className="flex items-center justify-center relative py-4 mb-2 border-b border-gray-100">
        <button
          onClick={() => router.push("/")}
          className="absolute left-4 text-amber-600 text-2xl font-bold active:scale-95"
          aria-label="Retour à l’accueil"
        >
          ←
        </button>
        <h1 className="text-lg font-semibold text-amber-600">
          Explorer {data.ville} 🌆
        </h1>
      </header>

      {/* Carte Google Maps */}
      <div className="relative">
        <iframe
          src={`https://www.google.com/maps?q=${mapCenter.lat},${mapCenter.lng}&z=13&output=embed`}
          className="w-full h-64 sm:h-72 border-0"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 bg-white/80 rounded-xl shadow px-2 py-1 text-xs">
          Vue générale
        </div>
      </div>

      {/* Filtres */}
      <div className="flex justify-center gap-3 my-4">
        <button
          className={`px-4 py-2 rounded-full text-sm font-semibold ${
            filtre === "all"
              ? "bg-amber-400 text-black shadow"
              : "bg-gray-100 text-gray-700"
          }`}
          onClick={() => setFiltre("all")}
        >
          Tous
        </button>
        <button
          className={`px-4 py-2 rounded-full text-sm font-semibold ${
            filtre === "restaurant"
              ? "bg-amber-400 text-black shadow"
              : "bg-gray-100 text-gray-700"
          }`}
          onClick={() => setFiltre("restaurant")}
        >
          Restaurants 🍔
        </button>
        <button
          className={`px-4 py-2 rounded-full text-sm font-semibold ${
            filtre === "lieu"
              ? "bg-amber-400 text-black shadow"
              : "bg-gray-100 text-gray-700"
          }`}
          onClick={() => setFiltre("lieu")}
        >
          Lieux 🏝️
        </button>
      </div>

      {/* Liste des lieux */}
      <div className="max-w-md mx-auto px-4 space-y-4">
        {filteredPlaces.map((place, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow overflow-hidden border border-gray-100"
          >
            {place.image && (
              <img
                src={place.image}
                alt={place.nom}
                className="w-full h-40 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-base font-bold">{place.nom}</h3>
              <p className="text-sm text-gray-600">{place.type}</p>
              {place.description && (
                <p className="text-xs text-gray-500 mt-1">{place.description}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">🕓 {place.horaire}</p>
              {place.adresse && (
                <p className="text-xs text-gray-500">📍 {place.adresse}</p>
              )}
              <button
                onClick={() => openMaps(place.lat, place.lng, place.nom)}
                className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
              >
                Itinéraire 📍
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

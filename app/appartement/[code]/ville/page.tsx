"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";

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
  const router = useRouter();
  const params = useParams();
  const code = params?.code as string | undefined;

  const [data, setData] = useState<CityData | null>(null);
  const [filtre, setFiltre] = useState<"all" | "restaurant" | "lieu">("all");
  const [loading, setLoading] = useState(true);

  // 🔄 Chargement
  useEffect(() => {
    if (!code) return;

    setLoading(true);
    fetch(`/api/appartement/${code}/ville`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.error) setData(d);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [code]);

  // -------------------------------------------------------------
  // ❗ IMPORTANT : TOUS LES HOOKS SONT APPELÉS AVANT TOUT RETURN UI
  // -------------------------------------------------------------

  const filteredPlaces = useMemo(() => {
    if (!data) return [];
    if (filtre === "all") return data.lieux;
    return data.lieux.filter((p) => p.categorie === filtre);
  }, [filtre, data]);

  const mapCenter = useMemo(() => {
    if (!data) return null;

    const valid = data.lieux.filter(
      (l) =>
        typeof l.lat === "number" &&
        typeof l.lng === "number" &&
        !isNaN(l.lat) &&
        !isNaN(l.lng)
    );

    if (valid.length === 0) return null;

    return {
      lat: valid.reduce((s, l) => s + l.lat, 0) / valid.length,
      lng: valid.reduce((s, l) => s + l.lng, 0) / valid.length,
    };
  }, [data]);

  const mapsSrc = useMemo(() => {
    if (!data) return "";
    if (!mapCenter)
      return `https://www.google.com/maps?q=${encodeURIComponent(
        data.ville + " " + data.pays
      )}&z=12&output=embed`;

    return `https://www.google.com/maps?q=${mapCenter.lat},${mapCenter.lng}&z=13&output=embed`;
  }, [mapCenter, data]);

  const openMaps = (lat: number, lng: number, name: string) => {
    window.open(
      `https://www.google.com/maps?q=${lat},${lng} (${encodeURIComponent(
        name
      )})`,
      "_blank"
    );
  };

  // -------------------------------------------------------------
  // 📌 RENDER APRÈS hooks
  // -------------------------------------------------------------

  if (!code) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Code appartement manquant.</p>
      </main>
    );
  }

  if (loading || !data) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Chargement de la ville...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-gray-800 font-sans pb-24">
      {/* Header */}
      <header className="flex items-center justify-center relative py-4 mb-2 border-b border-gray-100">
        <button
          onClick={() => router.push(`/appartement/${code}`)}
          className="absolute left-4 text-amber-600 text-2xl font-bold active:scale-95"
        >
          ←
        </button>
        <h1 className="text-lg font-semibold text-amber-600">
          Explorer {data.ville} 🌆
        </h1>
      </header>

      {/* MAP */}
      <div className="relative">
        <iframe src={mapsSrc} className="w-full h-64 sm:h-72 border-0" />
        <div className="absolute top-2 right-2 bg-white/80 rounded-xl shadow px-2 py-1 text-xs">
          Vue générale de {data.ville}
        </div>
      </div>

      {/* Filtres */}
      <div className="flex justify-center gap-3 my-4">
        {[
          { key: "all", label: "Tous" },
          { key: "restaurant", label: "Restaurants 🍽️" },
          { key: "lieu", label: "Lieux 🏝️" },
        ].map((f) => (
          <button
            key={f.key}
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              filtre === f.key
                ? "bg-amber-400 text-black shadow"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setFiltre(f.key as any)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Lieux */}
      <div className="max-w-md mx-auto px-4 space-y-4">
        {filteredPlaces.length === 0 ? (
          <p className="text-center text-gray-500 text-sm">
            Aucun lieu dans cette catégorie.
          </p>
        ) : (
          filteredPlaces.map((p, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden"
            >
              {p.image && (
                <img src={p.image} className="w-full h-40 object-cover" />
              )}

              <div className="p-4">
                <h3 className="font-bold">{p.nom}</h3>
                <p className="text-sm text-gray-600">{p.type}</p>
                <p className="text-xs text-gray-500 mt-1">🕓 {p.horaire}</p>
                {p.adresse && (
                  <p className="text-xs text-gray-500">📍 {p.adresse}</p>
                )}
                <button
                  className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg text-sm"
                  onClick={() => openMaps(p.lat, p.lng, p.nom)}
                >
                  Itinéraire 📍
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}

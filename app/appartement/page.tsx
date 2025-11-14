"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AppartementData {
  id: string;
  nom: string;
  ville: string;
  pays: string;
  adresse: string;
  lat?: number;
  lng?: number;
  description: string;
  wifi: { ssid: string; password: string };
  keybox: { emplacement: string; code: string };
  equipements: string[];
  videos: { title: string; youtubeId: string }[];
  regles: string[];
  proprietaire: { nom: string; telephone: string; email?: string };
  image?: string;
}

export default function Appartement() {
  const [data, setData] = useState<AppartementData | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/appartement.json")
      .then((r) => r.json())
      .then(setData)
      .catch((err) => console.error(err));
  }, []);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  if (!data)
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Chargement...</p>
      </main>
    );

  const mapSrc =
    data.lat && data.lng
      ? `https://www.google.com/maps?q=${data.lat},${data.lng}&z=16&output=embed`
      : `https://www.google.com/maps?q=${encodeURIComponent(
          data.adresse
        )}&z=16&output=embed`;

  return (
    <main className="min-h-screen bg-white text-gray-800 font-sans">
      {/* Flèche de retour */}
      <header className="flex items-center justify-center relative py-4 mb-2 border-b border-gray-100">
        <button
          onClick={() => router.push("/")}
          className="absolute left-4 text-amber-600 text-2xl font-bold active:scale-95"
          aria-label="Retour à l’accueil"
        >
          ←
        </button>
        <h1 className="text-lg font-semibold text-amber-600">
          Détails de l’appartement
        </h1>
      </header>

      {/* Image principale */}
      <div className="relative">
        {data.image && (
          <div
            className="h-44 sm:h-56 bg-cover bg-center"
            style={{ backgroundImage: `url('${data.image}')` }}
            aria-hidden
          />
        )}
        <div className="px-4 -mt-16">
          <div className="max-w-md mx-auto bg-white rounded-2xl p-4 shadow-lg">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h1 className="text-xl font-bold">{data.nom}</h1>
                <p className="text-sm text-gray-600">
                  {data.ville}, {data.pays}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  ID: <span className="font-medium">{data.id}</span>
                </p>
              </div>
              <div className="text-right">
                <button
                  onClick={() =>
                    window.scrollTo({ top: 300, behavior: "smooth" })
                  }
                  className="inline-flex items-center gap-2 px-3 py-2 bg-amber-400/90 rounded-lg text-black text-sm font-semibold shadow"
                >
                  📍 Voir la carte
                </button>
              </div>
            </div>

            <p className="mt-3 text-sm text-gray-700">{data.description}</p>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-md mx-auto px-4 mt-6 space-y-4 pb-24">
        {/* Localisation */}
        <section className="bg-white rounded-2xl shadow p-3">
          <h2 className="text-sm font-semibold text-amber-600 mb-2">
            📍 Localisation
          </h2>
          <div className="w-full aspect-[4/3] overflow-hidden rounded-lg border">
            <iframe
              title="Localisation"
              src={mapSrc}
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
          <p className="mt-2 text-xs text-gray-600 break-words">
            {data.adresse}
          </p>
          <div className="mt-2 flex gap-2">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                data.adresse
              )}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 text-center bg-blue-600 text-white py-2 rounded-lg text-sm font-medium"
            >
              Itinéraire
            </a>
            <button
              onClick={() => copyToClipboard(data.adresse, "adresse")}
              className="px-3 py-2 rounded-lg bg-gray-100 text-sm"
            >
              {copied === "adresse" ? "Copié ✓" : "Copier"}
            </button>
          </div>
        </section>

        {/* Wi-Fi & Boîte à clés */}
        <section className="bg-white rounded-2xl shadow p-3 space-y-3">
          <h2 className="text-sm font-semibold text-amber-600">📶 Wi-Fi</h2>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">{data.wifi.ssid}</div>
              <div className="text-xs text-gray-600">Mot de passe masqué</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(data.wifi.ssid, "ssid")}
                className="px-3 py-2 rounded-lg bg-gray-100 text-sm"
              >
                {copied === "ssid" ? "Copié ✓" : "Copier SSID"}
              </button>
              <button
                onClick={() => copyToClipboard(data.wifi.password, "wifi")}
                className="px-3 py-2 rounded-lg bg-amber-400 text-black text-sm font-semibold"
              >
                {copied === "wifi" ? "Copié ✓" : "Afficher / Copier"}
              </button>
            </div>
          </div>

          <hr className="my-2" />

          <h3 className="text-sm font-semibold text-amber-600">🔐 Boîte à clés</h3>
          <p className="text-sm text-gray-700">{data.keybox.emplacement}</p>
          <div className="mt-2 flex gap-2">
            <div className="flex-1 rounded-lg bg-gray-50 p-2 text-sm">
              Code: <span className="font-medium">{data.keybox.code}</span>
            </div>
            <button
              onClick={() => copyToClipboard(data.keybox.code, "keybox")}
              className="px-3 py-2 rounded-lg bg-amber-400 text-black text-sm font-semibold"
            >
              {copied === "keybox" ? "Copié ✓" : "Copier"}
            </button>
          </div>
        </section>

        {/* Équipements */}
        <section className="bg-white rounded-2xl shadow p-3">
          <h2 className="text-sm font-semibold text-amber-600 mb-2">
            ⚙️ Équipements
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.equipements.map((e, i) => (
              <div
                key={i}
                className="px-3 py-1 rounded-full bg-gray-100 text-sm"
              >
                {e}
              </div>
            ))}
          </div>
        </section>

        {/* Vidéos explicatives */}
        <section className="bg-white rounded-2xl shadow p-3 space-y-3">
          <h2 className="text-sm font-semibold text-amber-600">
            🎬 Vidéos explicatives
          </h2>
          <div className="space-y-3">
            {data.videos.map((v, i) => (
              <div key={i} className="rounded-lg overflow-hidden">
                <div className="w-full aspect-[16/9] bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${v.youtubeId}`}
                    title={v.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
                <div className="p-2 bg-white">
                  <div className="text-sm font-medium text-gray-800">
                    {v.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Règles */}
        <section className="bg-white rounded-2xl shadow p-3">
          <h2 className="text-sm font-semibold text-amber-600 mb-2">
            📋 Règles de la maison
          </h2>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {data.regles.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </section>

        {/* Contact du propriétaire */}
        <section className="bg-white rounded-2xl shadow p-3">
          <h2 className="text-sm font-semibold text-amber-600 mb-2">
            📞 Contact du propriétaire
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{data.proprietaire.nom}</div>
              <div className="text-sm text-gray-600">
                {data.proprietaire.email ?? ""}
              </div>
            </div>
            <a
              href={`tel:${data.proprietaire.telephone}`}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold"
            >
              Appeler
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
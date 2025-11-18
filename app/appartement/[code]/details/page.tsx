// app/appartement/[code]/details/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

interface Appartement {
  nom: string;
  ville: string;
  pays: string;
  adresse: string;
  lat?: number | null;
  lng?: number | null;
  description?: string | null;
  wifiSsid?: string | null;
  wifiPassword?: string | null;
  keyboxPlace?: string | null;
  keyboxCode?: string | null;
  equipements?: string | null;
  videosExplicatives?: string | null;
  regles?: string | null;
  proprietaireNom?: string | null;
  proprietaireEmail?: string | null;
  proprietaireTel?: string | null;
  imagePrincipale?: string | null;
}

export default function AppartementDetailsPage() {
  const router = useRouter();
  const params = useParams() as { code?: string };
  const code = params?.code as string | undefined;

  const [apt, setApt] = useState<Appartement | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!code) return;
    fetch(`/api/appartement/${code}`)
      .then((r) => r.json())
      .then(setApt)
      .catch((e) => console.error("Erreur appartement:", e));
  }, [code]);

  const copy = async (t: string, key: string) => {
    await navigator.clipboard.writeText(t);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!code) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Code appartement manquant.
      </main>
    );
  }

  if (!apt) {
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-700">
        Chargement…
      </main>
    );
  }

  const mapSrc =
    apt.lat && apt.lng
      ? `https://www.google.com/maps?q=${apt.lat},${apt.lng}&z=16&output=embed`
      : `https://www.google.com/maps?q=${encodeURIComponent(
          apt.adresse || ""
        )}&z=16&output=embed`;

  const equipements: string[] = apt.equipements
    ? (() => {
        try {
          return JSON.parse(apt.equipements);
        } catch {
          return [];
        }
      })()
    : [];

  const videos: { title: string; youtubeId: string }[] =
    apt.videosExplicatives
      ? (() => {
          try {
            return JSON.parse(apt.videosExplicatives);
          } catch {
            return [];
          }
        })()
      : [];

  const regles: string[] = apt.regles
    ? (() => {
        try {
          return JSON.parse(apt.regles);
        } catch {
          return [];
        }
      })()
    : [];

  return (
    <main className="min-h-screen bg-white text-gray-800 font-sans">
      {/* Header */}
      <header className="flex items-center justify-center relative py-4 mb-2 border-b border-gray-100">
        <button
          onClick={() => router.push(`/appartement/${code}`)}
          className="absolute left-4 text-amber-600 text-2xl font-bold active:scale-95"
        >
          ←
        </button>
        <h1 className="text-lg font-semibold text-amber-600">
          Détails de l’appartement
        </h1>
      </header>

      {/* Image principale */}
      <div className="relative">
        <div
          className="h-44 sm:h-56 bg-cover bg-center"
          style={{
            backgroundImage: `url('${
              apt.imagePrincipale || "/bg-apartment.jpg"
            }')`,
          }}
          aria-hidden
        />
        <div className="px-4 -mt-16">
          <div className="max-w-md mx-auto bg-white rounded-2xl p-4 shadow-lg">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h1 className="text-xl font-bold">{apt.nom}</h1>
                <p className="text-sm text-gray-600">
                  {apt.ville}, {apt.pays}
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

            <p className="mt-3 text-sm text-gray-700">
              {apt.description || ""}
            </p>
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
            {apt.adresse}
          </p>
          <div className="mt-2 flex gap-2">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                apt.adresse || ""
              )}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 text-center bg-blue-600 text-white py-2 rounded-lg text-sm font-medium"
            >
              Itinéraire
            </a>
            <button
              onClick={() => apt.adresse && copy(apt.adresse, "adresse")}
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
              <div className="text-sm font-medium">
                {apt.wifiSsid || "Non renseigné"}
              </div>
              <div className="text-xs text-gray-600">Mot de passe masqué</div>
            </div>
            <div className="flex gap-2">
              {apt.wifiSsid && (
                <button
                  onClick={() => copy(apt.wifiSsid!, "ssid")}
                  className="px-3 py-2 rounded-lg bg-gray-100 text-sm"
                >
                  {copied === "ssid" ? "Copié ✓" : "Copier SSID"}
                </button>
              )}
              {apt.wifiPassword && (
                <button
                  onClick={() => copy(apt.wifiPassword!, "wifi")}
                  className="px-3 py-2 rounded-lg bg-amber-400 text-black text-sm font-semibold"
                >
                  {copied === "wifi" ? "Copié ✓" : "Afficher / Copier"}
                </button>
              )}
            </div>
          </div>

          <hr className="my-2" />

          <h3 className="text-sm font-semibold text-amber-600">
            🔐 Boîte à clés
          </h3>
          <p className="text-sm text-gray-700">
            {apt.keyboxPlace || "Emplacement non renseigné"}
          </p>
          <div className="mt-2 flex gap-2">
            <div className="flex-1 rounded-lg bg-gray-50 p-2 text-sm">
              Code:{" "}
              <span className="font-medium">
                {apt.keyboxCode || "Non défini"}
              </span>
            </div>
            {apt.keyboxCode && (
              <button
                onClick={() => copy(apt.keyboxCode!, "keybox")}
                className="px-3 py-2 rounded-lg bg-amber-400 text-black text-sm font-semibold"
              >
                {copied === "keybox" ? "Copié ✓" : "Copier"}
              </button>
            )}
          </div>
        </section>

        {/* Équipements */}
        <section className="bg-white rounded-2xl shadow p-3">
          <h2 className="text-sm font-semibold text-amber-600 mb-2">
            ⚙️ Équipements
          </h2>
          {equipements.length === 0 ? (
            <p className="text-xs text-gray-500">
              Aucun équipement renseigné pour le moment.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {equipements.map((e, i) => (
                <div
                  key={i}
                  className="px-3 py-1 rounded-full bg-gray-100 text-sm"
                >
                  {e}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Vidéos explicatives */}
        <section className="bg-white rounded-2xl shadow p-3 space-y-3">
          <h2 className="text-sm font-semibold text-amber-600">
            🎬 Vidéos explicatives
          </h2>
          {videos.length === 0 ? (
            <p className="text-xs text-gray-500">
              Aucune vidéo explicative pour le moment.
            </p>
          ) : (
            <div className="space-y-3">
              {videos.map((v, i) => (
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
          )}
        </section>

        {/* Règles */}
        <section className="bg-white rounded-2xl shadow p-3">
          <h2 className="text-sm font-semibold text-amber-600 mb-2">
            📋 Règles de la maison
          </h2>
          {regles.length === 0 ? (
            <p className="text-xs text-gray-500">
              Aucune règle renseignée pour le moment.
            </p>
          ) : (
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {regles.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          )}
        </section>

        {/* Contact du propriétaire */}
        <section className="bg-white rounded-2xl shadow p-3">
          <h2 className="text-sm font-semibold text-amber-600 mb-2">
            📞 Contact du propriétaire
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">
                {apt.proprietaireNom || "Non renseigné"}
              </div>
              <div className="text-sm text-gray-600">
                {apt.proprietaireEmail ?? ""}
              </div>
            </div>
            {apt.proprietaireTel && (
              <a
                href={`tel:${apt.proprietaireTel}`}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold"
              >
                Appeler
              </a>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

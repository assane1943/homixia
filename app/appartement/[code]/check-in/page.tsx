// app/appartement/[code]/check-in/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import SignatureCanvas from "react-signature-canvas";

interface Appartement {
  nom: string;
  code: string;
  ville: string;
  pays: string;
  contratUrl?: string | null;
}

export default function CheckInPage() {
  const router = useRouter();
  const params = useParams() as { code?: string };
  const code = params?.code as string | undefined;

  const [apt, setApt] = useState<Appartement | null>(null);
  const [nom, setNom] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [passportFile, setPassportFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const sigRef = useRef<SignatureCanvas | null>(null);

  useEffect(() => {
    if (!code) return;

    fetch(`/api/appartement/${code}`)
      .then((r) => r.json())
      .then((d) =>
        setApt({
          nom: d.nom,
          code: d.code,
          ville: d.ville,
          pays: d.pays,
          contratUrl: d.contratUrl,
        })
      )
      .catch((e) => console.error("Erreur appartement:", e));
  }, [code]);

  const uploadFile = async (file: File, folder: string) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: fd,
    });

    if (!res.ok) throw new Error("Erreur upload fichier");
    const data = await res.json();
    return data.url as string;
  };

  const uploadSignature = async () => {
    if (!sigRef.current) throw new Error("Canvas signature introuvable");
    if (sigRef.current.isEmpty()) throw new Error("Signature vide");

    const dataUrl = sigRef.current.toDataURL("image/png");
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const file = new File([blob], "signature.png", { type: "image/png" });

    return uploadFile(file, `homixia/signatures/${code}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    try {
      if (!nom) {
        alert("Merci d’indiquer votre nom");
        return;
      }
      if (!accepted) {
        alert("Vous devez accepter le contrat de location");
        return;
      }
      if (!passportFile) {
        alert("Merci de joindre votre pièce d’identité ou passeport");
        return;
      }

      setLoading(true);
      setMessage("Envoi en cours...");

      // 1️⃣ Upload passeport / CIN
      const passportUrl = await uploadFile(
        passportFile,
        `homixia/passports/${code}`
      );

      // 2️⃣ Upload signature
      const signatureUrl = await uploadSignature();

      // 3️⃣ Création du check-in
      const res = await fetch("/api/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom,
          accepted,
          signatureUrl,
          passportUrl,
          appartementCode: code,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Erreur check-in");
      }

      setMessage("✅ Check-in envoyé avec succès !");
      setTimeout(() => {
        setMessage(null);
        router.push(`/appartement/${code}`);
      }, 2500);
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || "Erreur lors de l’envoi");
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (!code) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Code appartement manquant.</p>
      </main>
    );
  }

  if (!apt) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Chargement du check-in...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-gray-800 font-sans pb-10">
      {/* HEADER */}
      <header className="flex items-center justify-center relative py-4 mb-2 border-b border-gray-100">
        <button
          onClick={() => router.push(`/appartement/${code}`)}
          className="absolute left-4 text-amber-600 text-2xl font-bold active:scale-95"
        >
          ←
        </button>
        <h1 className="text-lg font-semibold text-amber-600">
          Check-in — {apt.nom}
        </h1>
      </header>

      {message && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-4 py-2 rounded-full shadow-md text-sm font-medium z-50">
          {message}
        </div>
      )}

      <section className="max-w-md mx-auto px-4 mt-4 space-y-4">
        {/* Contrat */}
        <div className="bg-white rounded-2xl shadow p-4 border border-amber-100">
          <h2 className="text-sm font-semibold text-amber-600 mb-2">
            📝 Contrat de location
          </h2>
          {apt.contratUrl ? (
            <div className="w-full h-64 border rounded-lg overflow-hidden">
              <iframe
                src={apt.contratUrl}
                className="w-full h-full border-0"
              />
            </div>
          ) : (
            <p className="text-xs text-gray-500">
              Le contrat n’est pas encore disponible pour ce logement.
            </p>
          )}
        </div>

        {/* FORMULAIRE */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow p-4 border border-amber-100 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">
              Nom complet
            </label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="w-full border border-amber-200 rounded-xl px-3 py-2 text-sm"
              placeholder="Votre nom et prénom"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Pièce d’identité / Passeport
            </label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) =>
                setPassportFile(e.target.files?.[0] || null)
              }
              className="w-full text-sm"
            />
          </div>

          <div className="flex items-start gap-2">
            <input
              id="accept"
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-1"
            />
            <label htmlFor="accept" className="text-xs text-gray-700">
              J’ai lu et j’accepte le contrat de location.
            </label>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Signature</p>
            <div className="border border-amber-200 rounded-xl bg-gray-50">
              <SignatureCanvas
                ref={sigRef}
                penColor="black"
                canvasProps={{
                  width: 400,
                  height: 180,
                  className: "w-full h-44",
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => sigRef.current?.clear()}
              className="mt-2 text-xs text-amber-600 underline"
            >
              Effacer la signature
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 text-white py-3 rounded-xl font-semibold hover:bg-amber-600 text-sm disabled:opacity-60"
          >
            {loading ? "Envoi en cours..." : "Envoyer mon check-in ✨"}
          </button>
        </form>
      </section>
    </main>
  );
}

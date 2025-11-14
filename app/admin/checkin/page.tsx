"use client";

import { useEffect, useState } from "react";

export default function CheckInAdmin() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<any | null>(null);

  const loadData = () => {
    fetch("/api/checkin")
      .then((r) => r.json())
      .then(setList)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const deleteCheck = async (id: string) => {
    if (!confirm("Supprimer cette fiche de check-in ?")) return;
    await fetch(`/api/checkin/${id}`, { method: "DELETE" });
    loadData();
  };

  const exportPdf = async (item: any) => {
    const blob = new Blob(
      [
        `
Check-In Homixia

Nom : ${item.nom}
Date : ${new Date(item.createdAt).toLocaleString("fr-FR")}
Contrat accepté : ${item.accepted ? "Oui" : "Non"}

Signature : image base64 jointe
Passeport : ${item.passportUrl}
`
      ],
      { type: "text/plain" }
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `checkin_${item.nom}.txt`;
    a.click();
  };

  if (loading)
    return (
      <main className="min-h-screen flex items-center justify-center text-amber-600">
        Chargement...
      </main>
    );

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-amber-700">
        📝 Gestion des Check-in
      </h1>

      {/* LISTE */}
      <div className="space-y-4">
        {list.map((c) => (
          <div
            key={c.id}
            className="bg-white p-4 rounded-xl shadow border border-gray-200"
          >
            <div className="flex justify-between">
              <h2 className="font-semibold text-lg">{c.nom}</h2>
              <span className="text-xs text-gray-500">
                {new Date(c.createdAt).toLocaleString("fr-FR")}
              </span>
            </div>

            <p className="text-sm mt-1">
              Contrat accepté :{" "}
              <span className="font-bold text-amber-700">
                {c.accepted ? "Oui" : "Non"}
              </span>
            </p>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setView(c)}
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded-lg"
              >
                Voir détails
              </button>

              <button
                onClick={() => exportPdf(c)}
                className="px-3 py-1 text-xs bg-amber-600 text-white rounded-lg"
              >
                Exporter
              </button>

              <button
                onClick={() => deleteCheck(c.id)}
                className="px-3 py-1 text-xs bg-red-600 text-white rounded-lg"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DETAILS */}
      {view && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full shadow-xl relative">

            <button
              onClick={() => setView(null)}
              className="absolute top-3 right-3 text-xl"
            >
              ✖️
            </button>

            <h2 className="text-xl font-bold text-amber-700 mb-4">
              Détails du check-in
            </h2>

            <p className="text-sm"><b>Nom :</b> {view.nom}</p>
            <p className="text-sm mt-1">
              <b>Date :</b>{" "}
              {new Date(view.createdAt).toLocaleString("fr-FR")}
            </p>

            <p className="text-sm mt-1">
              <b>Contrat accepté :</b> {view.accepted ? "✔️ Oui" : "❌ Non"}
            </p>

            <p className="font-semibold mt-4 mb-2">📌 Signature</p>
            <img
              src={view.signature}
              alt="Signature"
              className="w-full border rounded-lg shadow"
            />

            <p className="font-semibold mt-4 mb-2">🛂 Document</p>
            {view.passportUrl ? (
              <img
                src={view.passportUrl}
                alt="Passeport"
                className="w-full border rounded-lg shadow"
              />
            ) : (
              <p className="text-sm text-gray-500">Aucun document.</p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

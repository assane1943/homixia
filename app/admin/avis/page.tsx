"use client";

import { useEffect, useState } from "react";

export default function AvisAdmin() {
  const [avis, setAvis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);

  const loadAvis = () => {
    fetch("/api/avis")
      .then((res) => res.json())
      .then(setAvis)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAvis();
  }, []);

  const deleteAvis = async (id: number) => {
    if (!confirm("Supprimer cet avis ?")) return;
    await fetch(`/api/avis/${id}`, { method: "DELETE" });
    loadAvis();
  };

  const saveEdit = async () => {
    await fetch(`/api/avis/${editing.id}`, {
      method: "PUT",
      body: JSON.stringify(editing),
    });
    setEditing(null);
    loadAvis();
  };

  if (loading)
    return (
      <main className="min-h-screen flex items-center justify-center text-amber-600">
        Chargement des avis...
      </main>
    );

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-amber-700">⭐ Gestion des avis</h1>

      <div className="space-y-4">
        {avis.map((a) => (
          <div
            key={a.id}
            className="bg-white p-4 rounded-xl shadow border border-amber-100"
          >
            <div className="flex justify-between">
              <h2 className="font-semibold">{a.nom}</h2>
              <span className="text-amber-600 font-bold">{a.note}/5</span>
            </div>

            <p className="text-sm text-gray-700 mt-2">{a.commentaire}</p>

            <p className="text-xs text-gray-400 mt-1">
              Appartement : {a.appartement?.nom || "—"}
            </p>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setEditing(a)}
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded-lg"
              >
                Modifier
              </button>

              <button
                onClick={() => deleteAvis(a.id)}
                className="px-3 py-1 text-xs bg-red-600 text-white rounded-lg"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ————— MODAL MODIFICATION ————— */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
            <h2 className="font-bold text-lg text-amber-700">
              Modifier l'avis
            </h2>

            <input
              className="w-full border p-2 rounded mt-3"
              value={editing.nom}
              onChange={(e) =>
                setEditing({ ...editing, nom: e.target.value })
              }
            />

            <input
              type="number"
              min="1"
              max="5"
              className="w-full border p-2 rounded mt-3"
              value={editing.note}
              onChange={(e) =>
                setEditing({ ...editing, note: Number(e.target.value) })
              }
            />

            <textarea
              className="w-full border p-2 rounded mt-3"
              value={editing.commentaire}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  commentaire: e.target.value,
                })
              }
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setEditing(null)}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Annuler
              </button>

              <button
                onClick={saveEdit}
                className="px-3 py-1 bg-amber-600 text-white rounded"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

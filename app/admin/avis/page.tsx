"use client";

import { useEffect, useState } from "react";

interface Avis {
  id: number;
  nom: string;
  note: number;
  commentaire: string;
  date: string;
}

export default function AvisAdmin() {
  const [avis, setAvis] = useState<Avis[]>([]);
  const [loading, setLoading] = useState(true);
  const [noteFiltre, setNoteFiltre] = useState<number | null>(null);
  const [newAvis, setNewAvis] = useState({
    nom: "",
    note: "",
    commentaire: "",
  });
  const [message, setMessage] = useState("");

  // 🔹 Charger les avis
  useEffect(() => {
    const url = noteFiltre ? `/api/avis?note=${noteFiltre}` : "/api/avis";
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAvis(data);
        else setAvis([]);
      })
      .catch((err) => {
        console.error(err);
        setAvis([]);
      })
      .finally(() => setLoading(false));
  }, [noteFiltre]);

  // 🔹 Ajouter un avis
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/avis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: newAvis.nom,
          note: parseInt(newAvis.note),
          commentaire: newAvis.commentaire,
        }),
      });
      if (!res.ok) throw new Error("Erreur ajout");
      const data = await res.json();
      setAvis((prev) => [data, ...prev]);
      setNewAvis({ nom: "", note: "", commentaire: "" });
      setMessage("✅ Avis ajouté avec succès !");
    } catch {
      setMessage("❌ Erreur lors de l’ajout de l’avis");
    }
  };

  const moyenne =
    avis.length > 0
      ? (avis.reduce((a, b) => a + b.note, 0) / avis.length).toFixed(1)
      : "0.0";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-amber-600">💬 Gestion des Avis</h1>

      {message && (
        <div className="bg-green-100 border border-green-200 text-green-700 p-2 rounded-lg text-sm">
          {message}
        </div>
      )}

      {/* FILTRES */}
      <div className="flex items-center gap-3">
        <select
          value={noteFiltre || ""}
          onChange={(e) =>
            setNoteFiltre(e.target.value ? parseInt(e.target.value) : null)
          }
          className="border border-gray-300 rounded-lg p-2 text-sm"
        >
          <option value="">Toutes les notes</option>
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} ⭐
            </option>
          ))}
        </select>
        <p className="text-sm text-gray-600">
          Note moyenne : <b className="text-amber-600">{moyenne}</b> ⭐
        </p>
      </div>

      {/* FORMULAIRE AJOUT */}
      <form
        onSubmit={handleAdd}
        className="bg-white rounded-2xl shadow p-4 border border-amber-100 space-y-3"
      >
        <h2 className="font-semibold text-amber-600 text-sm">
          ➕ Ajouter un avis manuellement
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Nom du client"
            value={newAvis.nom}
            onChange={(e) => setNewAvis({ ...newAvis, nom: e.target.value })}
            required
            className="border border-gray-200 rounded-lg p-2 text-sm text-black"
          />
          <input
            type="number"
            placeholder="Note (1 à 5)"
            value={newAvis.note}
            onChange={(e) => setNewAvis({ ...newAvis, note: e.target.value })}
            required
            className="border border-gray-200 rounded-lg p-2 text-sm text-black"
          />
        </div>

        <textarea
          placeholder="Commentaire"
          value={newAvis.commentaire}
          onChange={(e) =>
            setNewAvis({ ...newAvis, commentaire: e.target.value })
          }
          required
          className="border border-gray-200 rounded-lg p-2 text-sm text-black w-full min-h-[80px]"
        />

        <button
          type="submit"
          className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg text-sm font-semibold transition"
        >
          Ajouter l’avis
        </button>
      </form>

      {/* LISTE DES AVIS */}
      {loading ? (
        <p className="text-center text-gray-500">Chargement des avis...</p>
      ) : avis.length === 0 ? (
        <p className="text-center text-gray-400 italic">
          Aucun avis enregistré.
        </p>
      ) : (
        <div className="grid gap-4">
          {avis.map((a) => (
            <div
              key={a.id}
              className="bg-white p-4 rounded-2xl shadow border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">
                  {a.nom} — <span className="text-amber-600">{a.note} ⭐</span>
                </h3>
                <p className="text-xs text-gray-500">
                  {new Date(a.date).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <p className="text-gray-700 text-sm mt-2">{a.commentaire}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

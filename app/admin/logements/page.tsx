"use client";

import { useEffect, useState } from "react";

interface Logement {
  id: number;
  code: string;
  nom: string;
  ville: string;
  pays: string;
  adresse: string;
  proprietaire: string;
  description: string;
  imagePrincipale?: string;
  createdAt: string;
}

export default function LogementsAdmin() {
  const [logements, setLogements] = useState<Logement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("");

  const [newLogement, setNewLogement] = useState({
    code: "",
    nom: "",
    ville: "",
    pays: "",
    adresse: "",
    proprietaire: "",
    description: "",
  });

  // 🔹 Charger les logements
  useEffect(() => {
    fetch("/api/logements")
      .then((res) => res.json())
      .then(setLogements)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // 🔹 Ajouter un logement
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    setMessage("");
    try {
      const res = await fetch("/api/logements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLogement),
      });
      if (res.ok) {
        const logement = await res.json();
        setLogements([logement, ...logements]);
        setNewLogement({
          code: "",
          nom: "",
          ville: "",
          pays: "",
          adresse: "",
          proprietaire: "",
          description: "",
        });
        setMessage("✅ Logement ajouté avec succès !");
      }
    } catch {
      setMessage("❌ Erreur lors de l’ajout du logement");
    } finally {
      setIsAdding(false);
    }
  };

  // 🔹 Upload d’image
  const handleUpload = async (logementId: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.url) {
      await fetch(`/api/logements/${logementId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagePrincipale: data.url }),
      });

      setLogements((prev) =>
        prev.map((l) =>
          l.id === logementId ? { ...l, imagePrincipale: data.url } : l
        )
      );
      setMessage("✅ Image mise à jour avec succès !");
    }
  };

  // 🔹 Supprimer un logement
  const handleDelete = async (id: number) => {
    if (!confirm("🗑️ Supprimer ce logement ?")) return;
    await fetch(`/api/logements/${id}`, { method: "DELETE" });
    setLogements(logements.filter((l) => l.id !== id));
    setMessage("🗑️ Logement supprimé !");
  };

  // 🔹 Modifier un logement
  const handleEdit = async (logement: Logement) => {
    setEditingId(logement.id);
  };

  // 🔹 Sauvegarder la modification
  const handleSaveEdit = async (id: number, updated: Partial<Logement>) => {
    const res = await fetch(`/api/logements/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    if (res.ok) {
      const updatedLogement = await res.json();
      setLogements((prev) =>
        prev.map((l) => (l.id === id ? updatedLogement : l))
      );
      setEditingId(null);
      setMessage("✏️ Logement modifié avec succès !");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-amber-600">🏠 Gestion des Propriétés</h1>

      {message && (
        <div className="bg-green-100 border border-green-200 text-green-700 p-2 rounded-lg text-sm">
          {message}
        </div>
      )}

      {/* FORMULAIRE AJOUT */}
      <form
        onSubmit={handleAdd}
        className="bg-white rounded-2xl shadow p-4 border border-amber-100 space-y-3"
      >
        <h2 className="font-semibold text-amber-600 text-sm">
          ➕ Ajouter un logement
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.keys(newLogement).map((key) => (
            <input
              key={key}
              type="text"
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              value={(newLogement as any)[key]}
              onChange={(e) =>
                setNewLogement({ ...newLogement, [key]: e.target.value })
              }
              required={["code", "nom"].includes(key)}
              className="border border-gray-200 rounded-lg p-2 text-sm text-black"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={isAdding}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg text-sm font-semibold transition"
        >
          {isAdding ? "Ajout en cours..." : "Ajouter le logement"}
        </button>
      </form>

      {/* LISTE DES LOGEMENTS */}
      {loading ? (
        <p className="text-center text-gray-500">Chargement...</p>
      ) : logements.length === 0 ? (
        <p className="text-center text-gray-500 italic">
          Aucun logement enregistré.
        </p>
      ) : (
        <div className="grid gap-4">
          {logements.map((l) => (
            <div
              key={l.id}
              className="bg-white p-4 rounded-2xl shadow border border-gray-100"
            >
              <div className="flex flex-col sm:flex-row justify-between gap-3">
                <div className="flex items-center gap-3">
                  {l.imagePrincipale ? (
                    <img
                      src={l.imagePrincipale}
                      alt={l.nom}
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                  ) : (
                    <div className="w-20 h-20 flex items-center justify-center bg-gray-100 text-gray-400 rounded-lg text-xs border">
                      Aucune image
                    </div>
                  )}

                  {editingId === l.id ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={l.nom}
                        onChange={(e) =>
                          setLogements((prev) =>
                            prev.map((log) =>
                              log.id === l.id
                                ? { ...log, nom: e.target.value }
                                : log
                            )
                          )
                        }
                        className="border border-gray-200 rounded-lg p-1 text-sm text-black"
                      />
                      <input
                        type="text"
                        value={l.ville}
                        onChange={(e) =>
                          setLogements((prev) =>
                            prev.map((log) =>
                              log.id === l.id
                                ? { ...log, ville: e.target.value }
                                : log
                            )
                          )
                        }
                        className="border border-gray-200 rounded-lg p-1 text-sm text-black"
                      />
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {l.nom}{" "}
                        <span className="text-xs text-gray-500">({l.code})</span>
                      </h3>
                      <p className="text-sm text-gray-600">
                        📍 {l.ville}, {l.pays}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        👤 {l.proprietaire}
                      </p>
                    </div>
                  )}
                </div>

                {/* BOUTONS */}
                <div className="flex gap-2">
                  <label
                    htmlFor={`upload-${l.id}`}
                    className="cursor-pointer bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-lg hover:bg-blue-200"
                  >
                    📤 Upload
                  </label>
                  <input
                    id={`upload-${l.id}`}
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload(l.id, file);
                    }}
                  />

                  {editingId === l.id ? (
                    <button
                      onClick={() => handleSaveEdit(l.id, l)}
                      className="bg-green-100 text-green-600 text-xs font-semibold px-3 py-1 rounded-lg"
                    >
                      💾 Sauver
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(l)}
                      className="bg-amber-100 text-amber-600 text-xs font-semibold px-3 py-1 rounded-lg"
                    >
                      ✏️ Modifier
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(l.id)}
                    className="bg-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-lg"
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

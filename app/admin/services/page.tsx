"use client";

import { useEffect, useState } from "react";

interface Service {
  id: number;
  nom: string;
  client: string;
  logement: string;
  prix: string;
  statut: string;
  date: string;
}

export default function ServicesAdmin() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [newService, setNewService] = useState({
    nom: "",
    client: "",
    logement: "Appartement Premium Anfa",
    prix: "",
    statut: "en_attente",
  });
  const [message, setMessage] = useState("");
  const [adding, setAdding] = useState(false);

  // 🔹 Charger les services existants
  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then(setServices)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // 🔹 Ajouter un service
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setMessage("");

    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newService),
      });

      if (!res.ok) throw new Error("Erreur lors de l’ajout");

      const data = await res.json();
      setServices([data, ...services]);
      setNewService({
        nom: "",
        client: "",
        logement: "Appartement Premium Anfa",
        prix: "",
        statut: "en_attente",
      });
      setMessage("✅ Service ajouté avec succès !");
    } catch {
      setMessage("❌ Impossible d’ajouter le service");
    } finally {
      setAdding(false);
    }
  };

  // 🔹 Changer le statut d’un service
  const handleStatusChange = async (id: number, newStatut: string) => {
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut: newStatut }),
      });

      if (res.ok) {
        setServices((prev) =>
          prev.map((s) =>
            s.id === id ? { ...s, statut: newStatut } : s
          )
        );
      }
    } catch (err) {
      console.error("Erreur de mise à jour du statut :", err);
    }
  };

  // 🔹 Supprimer un service
  const handleDelete = async (id: number) => {
    if (!confirm("🗑️ Supprimer ce service ?")) return;
    await fetch(`/api/services/${id}`, { method: "DELETE" });
    setServices(services.filter((s) => s.id !== id));
    setMessage("🗑️ Service supprimé !");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-amber-600">🧼 Gestion des Services</h1>

      {message && (
        <div className="bg-green-100 border border-green-200 text-green-700 p-2 rounded-lg text-sm">
          {message}
        </div>
      )}

      {/* FORMULAIRE AJOUT SERVICE */}
      <form
        onSubmit={handleAdd}
        className="bg-white rounded-2xl shadow p-4 border border-amber-100 space-y-3"
      >
        <h2 className="font-semibold text-amber-600 text-sm">
          ➕ Ajouter un service
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Nom du service (ex: Nettoyage, Chauffeur)"
            value={newService.nom}
            onChange={(e) =>
              setNewService({ ...newService, nom: e.target.value })
            }
            required
            className="border border-gray-200 rounded-lg p-2 text-sm text-black"
          />
          <input
            type="text"
            placeholder="Nom du client"
            value={newService.client}
            onChange={(e) =>
              setNewService({ ...newService, client: e.target.value })
            }
            required
            className="border border-gray-200 rounded-lg p-2 text-sm text-black"
          />
          <input
            type="text"
            placeholder="Logement (ex: Appartement Premium Anfa)"
            value={newService.logement}
            onChange={(e) =>
              setNewService({ ...newService, logement: e.target.value })
            }
            className="border border-gray-200 rounded-lg p-2 text-sm text-black"
          />
          <input
            type="text"
            placeholder="Prix (ex: 5000 FCFA)"
            value={newService.prix}
            onChange={(e) =>
              setNewService({ ...newService, prix: e.target.value })
            }
            required
            className="border border-gray-200 rounded-lg p-2 text-sm text-black"
          />
        </div>

        <button
          type="submit"
          disabled={adding}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg text-sm font-semibold transition"
        >
          {adding ? "Ajout en cours..." : "Ajouter le service"}
        </button>
      </form>

      {/* LISTE DES SERVICES */}
      {loading ? (
        <p className="text-center text-gray-500">Chargement...</p>
      ) : services.length === 0 ? (
        <p className="text-center text-gray-500 italic">
          Aucun service enregistré.
        </p>
      ) : (
        <div className="grid gap-4">
          {services.map((s) => (
            <div
              key={s.id}
              className="bg-white p-4 rounded-2xl shadow border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <h3 className="font-semibold text-gray-800">
                  {s.nom} — <span className="text-sm text-gray-500">{s.client}</span>
                </h3>
                <p className="text-sm text-gray-600">🏠 {s.logement}</p>
                <p className="text-xs text-gray-500 mt-1">
                  💰 {s.prix} — 📅{" "}
                  {new Date(s.date).toLocaleDateString("fr-FR")}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={s.statut}
                  onChange={(e) => handleStatusChange(s.id, e.target.value)}
                  className={`border rounded-lg px-2 py-1 text-sm font-semibold ${
                    s.statut === "en_attente"
                      ? "bg-yellow-100 text-yellow-700"
                      : s.statut === "planifié"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  <option value="en_attente">En attente</option>
                  <option value="planifié">Planifié</option>
                  <option value="terminé">Terminé</option>
                </select>

                <button
                  onClick={() => handleDelete(s.id)}
                  className="bg-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-lg hover:bg-red-200"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

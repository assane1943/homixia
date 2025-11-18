"use client";

import { useEffect, useState } from "react";

interface Reservation {
  id: number;
  clientNom: string;
  clientEmail?: string | null;
  clientTel?: string | null;
  debut: string;
  fin: string;
  statut: string;
  appartement?: { id: number; nom: string; code: string } | null;
  appartementId?: number | null;
}

interface AppartementOption {
  id: number;
  nom: string;
  code: string;
}

export default function AdminReservationsPage() {
  const [list, setList] = useState<Reservation[]>([]);
  const [apparts, setApparts] = useState<AppartementOption[]>([]);
  const [form, setForm] = useState({
    clientNom: "",
    clientEmail: "",
    clientTel: "",
    appartementId: "",
    debut: "",
    fin: "",
  });
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/reservations")
      .then((r) => r.json())
      .then(setList)
      .catch(console.error);

    fetch("/api/appartements")
      .then((r) => r.json())
      .then((d) =>
        setApparts(
          d.map((a: any) => ({ id: a.id, nom: a.nom, code: a.code }))
        )
      );
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) {
      setMsg(data.error || "Erreur");
    } else {
      setList((prev) => [data, ...prev]);
      setForm({
        clientNom: "",
        clientEmail: "",
        clientTel: "",
        appartementId: "",
        debut: "",
        fin: "",
      });
      setMsg("Réservation ajoutée ✅");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette réservation ?")) return;
    await fetch(`/api/reservations/${id}`, { method: "DELETE" });
    setList((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-5 text-black">
      <h2 className="text-lg font-semibold text-amber-700">
        Réservations 📅
      </h2>

      {msg && (
        <div className="text-sm bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg text-black">
          {msg}
        </div>
      )}

      {/* FORM */}
      <form
        onSubmit={handleCreate}
        className="bg-white rounded-2xl shadow p-4 border border-amber-100 space-y-3 text-black"
      >
        <h3 className="text-sm font-semibold text-amber-600">
          ➕ Ajouter une réservation
        </h3>

        <input
          className="border rounded-lg px-2 py-1 text-sm w-full text-black"
          placeholder="Nom du client"
          value={form.clientNom}
          onChange={(e) =>
            setForm((f) => ({ ...f, clientNom: e.target.value }))
          }
          required
        />

        <input
          className="border rounded-lg px-2 py-1 text-sm w-full text-black"
          placeholder="Email (optionnel)"
          value={form.clientEmail}
          onChange={(e) =>
            setForm((f) => ({ ...f, clientEmail: e.target.value }))
          }
        />

        <input
          className="border rounded-lg px-2 py-1 text-sm w-full text-black"
          placeholder="Téléphone (optionnel)"
          value={form.clientTel}
          onChange={(e) =>
            setForm((f) => ({ ...f, clientTel: e.target.value }))
          }
        />

        {/* SELECT APPARTEMENT */}
        <select
          className="border rounded-lg px-2 py-1 text-sm w-full text-black"
          value={form.appartementId}
          onChange={(e) =>
            setForm((f) => ({ ...f, appartementId: e.target.value }))
          }
        >
          <option value="">— Sélectionner un appartement —</option>
          {apparts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nom} ({a.code})
            </option>
          ))}
        </select>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] text-gray-600">Arrivée</label>
            <input
              type="date"
              className="border rounded-lg px-2 py-1 text-sm w-full text-black"
              value={form.debut}
              onChange={(e) =>
                setForm((f) => ({ ...f, debut: e.target.value }))
              }
              required
            />
          </div>

          <div>
            <label className="text-[11px] text-gray-600">Départ</label>
            <input
              type="date"
              className="border rounded-lg px-2 py-1 text-sm w-full text-black"
              value={form.fin}
              onChange={(e) =>
                setForm((f) => ({ ...f, fin: e.target.value }))
              }
              required
            />
          </div>
        </div>

        <button className="w-full bg-amber-500 text-white rounded-lg py-2 text-sm font-semibold">
          Ajouter
        </button>
      </form>

      {/* LISTE */}
      <div className="space-y-3">
        {list.length === 0 ? (
          <p className="text-sm text-gray-600">
            Aucune réservation pour l’instant.
          </p>
        ) : (
          list.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-2xl shadow p-3 border border-gray-100 text-sm text-black"
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">{r.clientNom}</p>

                  <p className="text-xs text-gray-700">
                    {r.appartement
                      ? `${r.appartement.nom} (${r.appartement.code})`
                      : "Sans appartement"}
                  </p>

                  <p className="text-xs text-gray-700">
                    {new Date(r.debut).toLocaleDateString("fr-FR")} →{" "}
                    {new Date(r.fin).toLocaleDateString("fr-FR")}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[11px] px-2 py-1 bg-amber-50 rounded-full border border-amber-200">
                    {r.statut}
                  </span>

                  <button
                    className="block mt-2 text-xs text-red-500"
                    onClick={() => handleDelete(r.id)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

interface Service {
  id: number;
  nom: string;
  whatsappMessage?: string | null;
  appartement?: { id: number; nom: string; code: string } | null;
  appartementId?: number | null;
  date: string;
}

interface AppartementOption {
  id: number;
  nom: string;
  code: string;
}

export default function AdminServicesPage() {
  const [list, setList] = useState<Service[]>([]);
  const [apparts, setApparts] = useState<AppartementOption[]>([]);

  const [form, setForm] = useState({
    nom: "",
    whatsappMessage: "",
    appartementId: "",
  });

  const [msg, setMsg] = useState<string | null>(null);

  // 🔹 Charger services + appartements
  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((d) => Array.isArray(d) ? setList(d) : setList([]))
      .catch(console.error);

    fetch("/api/appartements")
      .then((r) => r.json())
      .then((d) =>
        setApparts(
          d.map((a: any) => ({
            id: a.id,
            nom: a.nom,
            code: a.code,
          }))
        )
      );
  }, []);

  // 🔹 Ajouter un service
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    const res = await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setMsg(data.error || "Erreur");
    } else {
      setList((prev) => [data, ...prev]);
      setForm({ nom: "", whatsappMessage: "", appartementId: "" });
      setMsg("Service ajouté ✅");
    }
  };

  // 🔹 Supprimer
  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce service ?")) return;

    await fetch(`/api/services/${id}`, { method: "DELETE" });

    setList((prev) => prev.filter((s) => s.id !== id));
  };

  // 🔹 Ouvrir WhatsApp
  const handleWhatsApp = (service: Service) => {
    const number = "+212665247695";

    const text =
      service.whatsappMessage ||
      `Bonjour 👋, je souhaiterais réserver ou avoir plus d'informations concernant le service : ${service.nom}.`;

    window.open(
      `https://wa.me/${number}?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  return (
    <div className="space-y-5 text-black">
      <h2 className="text-lg font-semibold text-amber-700">
        Services à la demande 🧰
      </h2>

      {msg && (
        <div className="text-sm bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
          {msg}
        </div>
      )}

      {/* FORMULAIRE */}
      <form
        onSubmit={handleCreate}
        className="bg-white rounded-2xl shadow p-4 border border-amber-100 space-y-3"
      >
        <h3 className="text-sm font-semibold text-amber-600">
          ➕ Ajouter un service
        </h3>

        <input
          className="border rounded-lg px-2 py-1 text-sm w-full"
          placeholder="Nom du service (ex: Femme de ménage)"
          value={form.nom}
          onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))}
          required
        />

        {/* Message WhatsApp */}
        <textarea
          className="border rounded-lg px-2 py-1 text-sm w-full"
          placeholder="Message WhatsApp personnalisé (optionnel)"
          value={form.whatsappMessage}
          onChange={(e) =>
            setForm((f) => ({ ...f, whatsappMessage: e.target.value }))
          }
        />

        {/* APPARTEMENT */}
        <select
          className="border rounded-lg px-2 py-1 text-sm w-full"
          value={form.appartementId}
          onChange={(e) =>
            setForm((f) => ({ ...f, appartementId: e.target.value }))
          }
        >
          <option value="">— Choisir un appartement —</option>
          {apparts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nom} ({a.code})
            </option>
          ))}
        </select>

        <button className="w-full bg-amber-500 text-white rounded-lg py-2 text-sm font-semibold">
          Ajouter
        </button>
      </form>

      {/* LISTE */}
      <div className="space-y-3">
        {list.length === 0 ? (
          <p className="text-sm text-gray-600">Aucun service enregistré.</p>
        ) : (
          list.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl shadow p-3 border border-gray-100 text-sm flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{s.nom}</p>

                <p className="text-xs text-gray-700">
                  {s.appartement
                    ? `${s.appartement.nom} — (${s.appartement.code})`
                    : "Aucun appartement lié"}
                </p>
              </div>

              <div className="text-right">
                <button
                  onClick={() => handleWhatsApp(s)}
                  className="text-xs px-3 py-2 bg-amber-500 text-white rounded-full mr-2"
                >
                  Contacter
                </button>

                <button
                  className="text-xs text-red-500"
                  onClick={() => handleDelete(s.id)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

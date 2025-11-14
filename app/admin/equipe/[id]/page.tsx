"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditMembre() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    fetch("/api/equipe")
      .then((r) => r.json())
      .then((list) => {
        const item = list.find((m: any) => m.id == id);
        setForm(item);
      });
  }, [id]);

  if (!form) return <p className="p-6">Chargement...</p>;

  const update = async () => {
    await fetch(`/api/equipe/${id}`, {
      method: "PUT",
      body: JSON.stringify(form),
    });
    alert("Modifié !");

    router.push("/admin/equipe");
  };

  const remove = async () => {
    if (!confirm("Supprimer ce membre ?")) return;
    await fetch(`/api/equipe/${id}`, {
      method: "DELETE",
    });
    router.push("/admin/equipe");
  };

  return (
    <main className="p-6 space-y-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-amber-700">⚙ Modifier : {form.nom}</h1>

      <input
        className="w-full border p-3 rounded-xl"
        value={form.nom}
        onChange={(e) => setForm({ ...form, nom: e.target.value })}
      />

      <input
        className="w-full border p-3 rounded-xl"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        className="w-full border p-3 rounded-xl"
        value={form.telephone || ""}
        onChange={(e) => setForm({ ...form, telephone: e.target.value })}
      />

      <select
        className="w-full border p-3 rounded-xl"
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
      >
        <option value="admin">Administrateur</option>
        <option value="manager">Manager</option>
      </select>

      <input
        placeholder="Nouveau mot de passe (optionnel)"
        type="password"
        className="w-full border p-3 rounded-xl"
        onChange={(e) => setForm({ ...form, motDePasse: e.target.value })}
      />

      <button
        onClick={update}
        className="w-full bg-blue-600 text-white py-3 rounded-xl"
      >
        Enregistrer
      </button>

      <button
        onClick={remove}
        className="w-full bg-red-600 text-white py-3 rounded-xl mt-2"
      >
        Supprimer
      </button>
    </main>
  );
}

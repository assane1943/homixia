"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NouveauMembre() {
  const router = useRouter();

  const [form, setForm] = useState({
    nom: "",
    email: "",
    telephone: "",
    role: "admin",
    motDePasse: "",
  });

  const submit = async () => {
    const res = await fetch("/api/equipe", {
      method: "POST",
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Membre ajouté !");
      router.push("/admin/equipe");
    } else {
      alert("Erreur lors de l'ajout.");
    }
  };

  return (
    <main className="p-6 space-y-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-amber-700">➕ Ajouter un membre</h1>

      <input
        placeholder="Nom"
        className="w-full border p-3 rounded-xl"
        onChange={(e) => setForm({ ...form, nom: e.target.value })}
      />

      <input
        placeholder="Email"
        className="w-full border p-3 rounded-xl"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        placeholder="Téléphone"
        className="w-full border p-3 rounded-xl"
        onChange={(e) => setForm({ ...form, telephone: e.target.value })}
      />

      <input
        placeholder="Mot de passe"
        type="password"
        className="w-full border p-3 rounded-xl"
        onChange={(e) => setForm({ ...form, motDePasse: e.target.value })}
      />

      <select
        className="w-full border p-3 rounded-xl"
        onChange={(e) => setForm({ ...form, role: e.target.value })}
      >
        <option value="admin">Administrateur</option>
        <option value="manager">Manager</option>
      </select>

      <button
        onClick={submit}
        className="w-full bg-amber-600 text-white py-3 rounded-xl shadow"
      >
        Ajouter
      </button>
    </main>
  );
}

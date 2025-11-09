"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Membre {
  id: string;
  nom: string;
  role: string;
  telephone: string;
}

export default function EquipePage() {
  const [equipe, setEquipe] = useState<Membre[]>([]);
  const [nom, setNom] = useState("");
  const [role, setRole] = useState("manager");
  const [telephone, setTelephone] = useState("");
  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem("homixia_equipe");
    if (data) setEquipe(JSON.parse(data));
  }, []);

  const ajouterMembre = () => {
    if (!nom || !telephone) return alert("Remplis tous les champs 📋");
    const nouveau: Membre = {
      id: Date.now().toString(),
      nom,
      role,
      telephone,
    };
    const maj = [...equipe, nouveau];
    setEquipe(maj);
    localStorage.setItem("homixia_equipe", JSON.stringify(maj));
    setNom("");
    setTelephone("");
  };

  const supprimer = (id: string) => {
    const maj = equipe.filter((m) => m.id !== id);
    setEquipe(maj);
    localStorage.setItem("homixia_equipe", JSON.stringify(maj));
  };

  return (
    <main className="min-h-screen bg-amber-50 text-gray-800 pb-20">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3 bg-white border-b shadow-sm sticky top-0">
        <div className="flex items-center gap-2">
          <Image src="/logo-homixia.png" alt="Homixia" width={35} height={35} />
          <h1 className="font-bold text-amber-600">Équipe Homixia</h1>
        </div>
        <button onClick={() => router.push("/admin")} className="text-sm">← Retour</button>
      </header>

      {/* Formulaire */}
      <div className="max-w-md mx-auto mt-6 bg-white p-5 rounded-2xl shadow">
        <h2 className="font-semibold text-gray-700 mb-3 text-center">Ajouter un membre 👥</h2>
        <input
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder="Nom complet"
          className="w-full border rounded-lg px-3 py-2 mb-2 text-sm"
        />
        <input
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          placeholder="Téléphone"
          className="w-full border rounded-lg px-3 py-2 mb-2 text-sm"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-3 text-sm"
        >
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="technicien">Technicien</option>
        </select>
        <button
          onClick={ajouterMembre}
          className="w-full bg-amber-500 text-white py-2 rounded-lg font-semibold hover:bg-amber-600 transition"
        >
          Ajouter
        </button>
      </div>

      {/* Liste des membres */}
      <div className="max-w-md mx-auto mt-5 space-y-3 px-4">
        {equipe.map((m) => (
          <div key={m.id} className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
            <div>
              <p className="font-bold">{m.nom}</p>
              <p className="text-sm text-gray-500">{m.role}</p>
              <p className="text-xs text-gray-400">{m.telephone}</p>
            </div>
            <button
              onClick={() => supprimer(m.id)}
              className="text-red-500 text-sm hover:underline"
            >
              Supprimer
            </button>
          </div>
        ))}
        {equipe.length === 0 && (
          <p className="text-center text-gray-500 text-sm">Aucun membre pour l’instant 👀</p>
        )}
      </div>
    </main>
  );
}

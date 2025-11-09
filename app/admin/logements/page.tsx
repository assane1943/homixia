"use client";

import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useRouter } from "next/navigation";

interface Appartement {
  id: string;
  nom: string;
  ville: string;
  proprietaire: string;
}

export default function LogementsAdmin() {
  const [apparts, setApparts] = useState<Appartement[]>([]);
  const [nom, setNom] = useState("");
  const [ville, setVille] = useState("");
  const [proprietaire, setProprietaire] = useState("");
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("homixia_apparts");
    if (stored) setApparts(JSON.parse(stored));
  }, []);

  const ajouter = () => {
    if (!nom || !ville) return alert("Remplis tous les champs !");
    const nouveau = {
      id: "HX-" + Date.now(),
      nom,
      ville,
      proprietaire,
    };
    const maj = [...apparts, nouveau];
    setApparts(maj);
    localStorage.setItem("homixia_apparts", JSON.stringify(maj));
    setNom("");
    setVille("");
    setProprietaire("");
  };

  const supprimer = (id: string) => {
    const maj = apparts.filter((a) => a.id !== id);
    setApparts(maj);
    localStorage.setItem("homixia_apparts", JSON.stringify(maj));
  };

  return (
    <main className="min-h-screen bg-amber-50 pb-20">
      <header className="flex justify-between px-5 py-3 bg-white border-b sticky top-0">
        <h1 className="text-amber-600 font-bold">🏠 Logements</h1>
        <button onClick={() => router.push("/admin")} className="text-sm">← Retour</button>
      </header>

      <div className="max-w-md mx-auto mt-5 bg-white p-5 rounded-2xl shadow">
        <h2 className="text-center font-semibold mb-3">Ajouter un logement</h2>
        <input
          placeholder="Nom du logement"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-2 text-sm"
        />
        <input
          placeholder="Ville"
          value={ville}
          onChange={(e) => setVille(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-2 text-sm"
        />
        <input
          placeholder="Propriétaire"
          value={proprietaire}
          onChange={(e) => setProprietaire(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-3 text-sm"
        />
        <button
          onClick={ajouter}
          className="w-full bg-amber-500 text-white py-2 rounded-lg font-semibold hover:bg-amber-600 transition"
        >
          Enregistrer
        </button>
      </div>

      <div className="max-w-md mx-auto mt-6 space-y-4 px-4">
        {apparts.map((a) => (
          <div key={a.id} className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold">{a.nom}</h3>
            <p className="text-sm text-gray-500">{a.ville}</p>
            <p className="text-xs text-gray-400">Propriétaire: {a.proprietaire}</p>
            <div className="flex justify-center mt-3">
              <QRCodeCanvas value={`https://homixia.ma/appartement?id=${a.id}`} size={100} />
            </div>
            <button
              onClick={() => supprimer(a.id)}
              className="text-red-500 text-xs mt-2 hover:underline"
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

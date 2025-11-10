"use client";

import { useState } from "react";
import Image from "next/image";

export default function ParametresAdmin() {
  const [section, setSection] = useState<"equipe" | "local" | "abonnement">("equipe");

  return (
    <main className="min-h-screen bg-gray-50 p-6 font-sans">
      {/* HEADER */}
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Image
            src="/logo-homixia.png"
            alt="Homixia"
            width={50}
            height={50}
            className="rounded-full shadow"
          />
          <div>
            <h1 className="text-2xl font-bold text-amber-600">Paramètres</h1>
            <p className="text-sm text-gray-500">
              Configuration de l’équipe, du contenu local et de la facturation
            </p>
          </div>
        </div>
      </header>

      {/* NAVIGATION */}
      <div className="flex gap-3 mb-6 border-b border-gray-200 pb-2">
        <button
          onClick={() => setSection("equipe")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold ${
            section === "equipe"
              ? "bg-amber-500 text-white"
              : "bg-white border border-gray-200 text-gray-700"
          }`}
        >
          👥 Équipe
        </button>
        <button
          onClick={() => setSection("local")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold ${
            section === "local"
              ? "bg-amber-500 text-white"
              : "bg-white border border-gray-200 text-gray-700"
          }`}
        >
          🍽️ Contenu Local
        </button>
        <button
          onClick={() => setSection("abonnement")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold ${
            section === "abonnement"
              ? "bg-amber-500 text-white"
              : "bg-white border border-gray-200 text-gray-700"
          }`}
        >
          💳 Abonnement
        </button>
      </div>

      {/* CONTENU */}
      {section === "equipe" && <EquipeSection />}
      {section === "local" && <LocalSection />}
      {section === "abonnement" && <AbonnementSection />}
    </main>
  );
}

/* --- 👥 SECTION ÉQUIPE --- */
function EquipeSection() {
  return (
    <section className="bg-white p-6 rounded-2xl shadow border border-amber-100 space-y-4">
      <h2 className="text-lg font-semibold text-amber-600">👥 Gestion de l’Équipe</h2>
      <p className="text-sm text-gray-600">
        Ajoutez ou modifiez les membres ayant accès à l’interface d’administration.
      </p>
      <button className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition">
        ➕ Ajouter un membre
      </button>

      <div className="border-t pt-3 mt-3">
        <p className="text-sm text-gray-500 italic">Liste des membres à venir...</p>
      </div>
    </section>
  );
}

/* --- 🍽️ SECTION LOCAL --- */
function LocalSection() {
  return (
    <section className="bg-white p-6 rounded-2xl shadow border border-amber-100 space-y-4">
      <h2 className="text-lg font-semibold text-amber-600">
        🍽️ Gestion du Contenu Local
      </h2>
      <p className="text-sm text-gray-600">
        Ajoutez des restaurants, cafés ou points d’intérêt recommandés aux voyageurs.
      </p>
      <button className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition">
        ➕ Ajouter un lieu
      </button>

      <div className="border-t pt-3 mt-3">
        <p className="text-sm text-gray-500 italic">Liste des lieux à venir...</p>
      </div>
    </section>
  );
}

/* --- 💳 SECTION ABONNEMENT --- */
function AbonnementSection() {
  return (
    <section className="bg-white p-6 rounded-2xl shadow border border-amber-100 space-y-4">
      <h2 className="text-lg font-semibold text-amber-600">
        💳 Abonnement & Facturation
      </h2>
      <p className="text-sm text-gray-600">
        Consultez le statut de votre pack, vos factures et les paiements récents.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
          <p className="text-gray-600 text-sm">Pack actuel</p>
          <h3 className="text-lg font-bold text-amber-600">Premium 🏆</h3>
        </div>
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
          <p className="text-gray-600 text-sm">Renouvellement</p>
          <h3 className="text-lg font-bold text-amber-600">15 Décembre 2025</h3>
        </div>
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
          <p className="text-gray-600 text-sm">Factures payées</p>
          <h3 className="text-lg font-bold text-amber-600">6 / 12</h3>
        </div>
      </div>

      <div className="border-t pt-4 mt-4">
        <p className="text-sm text-gray-500 italic">
          Historique des paiements à venir...
        </p>
      </div>
    </section>
  );
}

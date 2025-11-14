"use client";

import { useEffect, useState } from "react";

interface NotificationItem {
  id: number;
  message: string;
  type: string;
}

interface DashboardData {
  nom: string;
  ville: string;
  noteMoyenne: string;
  totalServices: number;
  actifs: number;
  aVenir: number;
  notifications?: NotificationItem[]; // optional pour éviter les crashs
}

export default function DashboardAdmin() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Admin");

  useEffect(() => {
    // 🧠 Récupérer le nom de l'utilisateur connecté
    const userData = localStorage.getItem("homixia_admin");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setUserName(parsed.nom || "Admin");
      } catch {
        setUserName("Admin");
      }
    }

    // 📊 Charger les données du dashboard
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <main className="min-h-screen flex items-center justify-center text-amber-600 font-semibold">
        Chargement du tableau de bord...
      </main>
    );

  if (!data)
    return (
      <main className="min-h-screen flex items-center justify-center text-red-500 font-semibold">
        Erreur de chargement du dashboard ❌
      </main>
    );

  // 📌 Sécurisation notifications (évite l’erreur .map undefined)
  const notifications: NotificationItem[] = data.notifications ?? [];

  // 🗓️ Date du jour
  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <section className="p-6 space-y-6">

      {/* 🟠 HEADER ADMIN */}
      <div className="bg-gradient-to-r from-amber-100 to-white border border-amber-200 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-amber-700">
            Bonjour, {userName} 👋
          </h1>
          <p className="text-sm text-gray-600">
            Nous sommes le <span className="font-medium">{today}</span>.
          </p>
        </div>
        <p className="text-sm text-gray-500 mt-3 sm:mt-0">
          Dernière mise à jour :{" "}
          <span className="font-semibold text-amber-600">Temps réel</span>
        </p>
      </div>

      {/* 📊 INDICATEURS */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow border border-amber-100">
          <p className="text-gray-500 text-sm">⭐ Note Moyenne</p>
          <h2 className="text-3xl font-bold text-amber-600">{data.noteMoyenne}</h2>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow border border-amber-100">
          <p className="text-gray-500 text-sm">🧾 Total Services</p>
          <h2 className="text-3xl font-bold text-amber-600">{data.totalServices}</h2>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow border border-amber-100">
          <p className="text-gray-500 text-sm">📅 À venir / Actifs</p>
          <h2 className="text-3xl font-bold text-amber-600">
            {data.aVenir} / {data.actifs}
          </h2>
        </div>
      </section>

      {/* 🔔 NOTIFICATIONS */}
      <section className="bg-white rounded-2xl shadow p-4 border border-amber-100">
        <h2 className="font-semibold text-amber-600 mb-3">
          🔔 Notifications récentes
        </h2>

        {notifications.length === 0 ? (
          <p className="text-sm text-gray-500">
            Aucune notification pour le moment 😴
          </p>
        ) : (
          <ul className="space-y-2">
            {notifications.map((notif) => (
              <li
                key={notif.id}
                className={`text-sm p-2 rounded-lg ${
                  notif.type === "success"
                    ? "bg-green-50 text-green-700"
                    : notif.type === "info"
                    ? "bg-gray-50 text-gray-600"
                    : "bg-yellow-50 text-yellow-700"
                }`}
              >
                {notif.message}
              </li>
            ))}
          </ul>
        )}
      </section>

    </section>
  );
}

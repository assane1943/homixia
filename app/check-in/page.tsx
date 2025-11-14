"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface DashboardProData {
  stats: {
    totalServices: number;
    totalCheckins: number;
    noteMoyenne: string;
  };
  charts: {
    checkinChart: { mois: string; total: number }[];
    avisChart: { mois: string; moyenne: number }[];
  };
}

export default function DashboardPro() {
  const [data, setData] = useState<DashboardProData | null>(null);
  const [userName, setUserName] = useState("Admin");

  useEffect(() => {
    // 🔐 Récupération du nom dans le localStorage
    const stored = localStorage.getItem("homixia_admin");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUserName(parsed.nom || "Admin");
      } catch {
        setUserName("Admin");
      }
    }

    // 📥 Charger les données du dashboard
    fetch("/api/dashboard-pro")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch((err) => console.error("Erreur Dashboard:", err));
  }, []);

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center text-amber-600 font-semibold">
        Chargement du dashboard...
      </main>
    );
  }

  const { stats, charts } = data;

  return (
    <main className="p-6 space-y-8">
      {/* 🔶 TITRE */}
      <h1 className="text-3xl font-bold text-amber-700">
        📊 Dashboard Administratif — Bonjour {userName} 👋
      </h1>

      {/* 📦 KPIs */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-xl border shadow">
          <p className="text-gray-500 text-sm">⭐ Note moyenne</p>
          <h2 className="text-4xl font-bold text-amber-600">
            {stats.noteMoyenne}
          </h2>
        </div>

        <div className="p-5 bg-white rounded-xl border shadow">
          <p className="text-gray-500 text-sm">🧾 Total services</p>
          <h2 className="text-4xl font-bold text-amber-600">
            {stats.totalServices}
          </h2>
        </div>

        <div className="p-5 bg-white rounded-xl border shadow">
          <p className="text-gray-500 text-sm">📝 Check-in enregistrés</p>
          <h2 className="text-4xl font-bold text-amber-600">
            {stats.totalCheckins}
          </h2>
        </div>
      </section>

      {/* 📈 CHECK-IN */}
      <section className="bg-white p-6 rounded-xl shadow border">
        <h2 className="text-xl font-semibold text-amber-700 mb-4">
          📈 Activité Check-in
        </h2>

        {charts.checkinChart.length === 0 ? (
          <p className="text-gray-400 text-sm">Aucune donnée de check-in.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={charts.checkinChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mois" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#F4A000"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </section>

      {/* ⭐ AVIS */}
      <section className="bg-white p-6 rounded-xl shadow border">
        <h2 className="text-xl font-semibold text-amber-700 mb-4">
          ⭐ Moyenne des avis par mois
        </h2>

        {charts.avisChart.length === 0 ? (
          <p className="text-gray-400 text-sm">Aucune donnée d'avis.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={charts.avisChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mois" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="moyenne"
                fill="#F4A000"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </section>
    </main>
  );
}

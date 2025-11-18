"use client";

import { useEffect, useState } from "react";

interface Stats {
  appartements: number;
  reservations: number;
  services: number;
  avis: number;
  checkins: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // ⛔ Empêche le dashboard de charger si pas connecté
    const admin = localStorage.getItem("homixia_admin");
    if (!admin) return;

    setReady(true);

    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => setStats(d.stats))
      .catch((e) => console.error(e));
  }, []);

  if (!ready) return null;

  if (!stats) {
    return (
      <div className="text-center text-amber-600 font-semibold">
        Chargement du dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-amber-700">
        Vue d’ensemble 📊
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Appartements" value={stats.appartements} emoji="🏡" />
        <StatCard label="Réservations" value={stats.reservations} emoji="📅" />
        <StatCard label="Services" value={stats.services} emoji="🧰" />
        <StatCard label="Avis" value={stats.avis} emoji="⭐" />
        <StatCard label="Check-in" value={stats.checkins} emoji="📝" />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  emoji,
}: {
  label: string;
  value: number;
  emoji: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow p-3 border border-amber-100">
      <div className="flex items-center justify-between">
        <span className="text-2xl">{emoji}</span>
        <span className="text-2xl font-bold text-amber-600">{value}</span>
      </div>
      <p className="mt-2 text-xs text-gray-600">{label}</p>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";

export default function BaseAdmin() {
  const router = useRouter();

  const exporter = () => {
    const data = {
      equipe: JSON.parse(localStorage.getItem("homixia_equipe") || "[]"),
      logements: JSON.parse(localStorage.getItem("homixia_apparts") || "[]"),
      services: JSON.parse(localStorage.getItem("homixia_services") || "[]"),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "homixia_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-amber-50 pb-20">
      <header className="flex justify-between px-5 py-3 bg-white border-b sticky top-0">
        <h1 className="text-amber-600 font-bold">🗃️ Base de données</h1>
        <button onClick={() => router.push("/admin")} className="text-sm">← Retour</button>
      </header>

      <div className="max-w-md mx-auto mt-6 bg-white p-6 rounded-2xl shadow text-center">
        <h2 className="font-semibold text-gray-700 mb-3">
          Exporter toutes les données Homixia 📦
        </h2>
        <button
          onClick={exporter}
          className="bg-amber-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-amber-600 transition"
        >
          Télécharger homixia_data.json
        </button>
      </div>
    </main>
  );
}

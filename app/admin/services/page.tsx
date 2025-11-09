"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Service {
  nom: string;
  client: string;
  logement: string;
  prix: string;
  date: string;
}

export default function ServicesAdmin() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("homixia_services");
    if (data) setServices(JSON.parse(data));
  }, []);

  return (
    <main className="min-h-screen bg-amber-50 pb-20">
      <header className="flex justify-between px-5 py-3 bg-white border-b sticky top-0">
        <h1 className="text-amber-600 font-bold">🧾 Services Clients</h1>
        <button onClick={() => router.push("/admin")} className="text-sm">← Retour</button>
      </header>

      <div className="max-w-md mx-auto mt-5 space-y-3 px-4">
        {services.length === 0 ? (
          <p className="text-center text-gray-500 text-sm">
            Aucun service n’a encore été demandé 👀
          </p>
        ) : (
          services.map((s, i) => (
            <div key={i} className="bg-white p-4 rounded-xl shadow">
              <h3 className="font-semibold">{s.nom}</h3>
              <p className="text-sm text-gray-500">
                Client: {s.client} – Logement: {s.logement}
              </p>
              <p className="text-xs text-gray-400">Date: {s.date}</p>
              <p className="text-sm font-medium mt-1 text-amber-600">{s.prix}</p>
            </div>
          ))
        )}
      </div>
    </main>
  );
}

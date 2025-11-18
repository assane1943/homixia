"use client";

import { useEffect, useState } from "react";

interface Avis {
  id: number;
  nom: string;
  note: number;
  commentaire: string;
  date: string;
  appartement?: { nom: string } | null;
}

export default function AdminAvisPage() {
  const [list, setList] = useState<Avis[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/avis")
      .then((r) => r.json())
      .then(setList)
      .catch(console.error);
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Masquer / supprimer cet avis ?")) return;
    await fetch(`/api/avis/${id}`, { method: "DELETE" });
    setList((prev) => prev.filter((a) => a.id !== id));
    setMsg("Avis supprimé ✅");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-amber-700">
        Avis clients ⭐
      </h2>

      {msg && (
        <div className="text-sm bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
          {msg}
        </div>
      )}

      <div className="space-y-3">
        {list.length === 0 ? (
          <p className="text-sm text-gray-500">
            Aucun avis pour l’instant.
          </p>
        ) : (
          list.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-2xl shadow p-3 border border-gray-100 text-sm"
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">
                    {a.nom}{" "}
                    <span className="text-xs text-gray-500">
                      {a.appartement?.nom || ""}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(a.date).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div className="text-right text-amber-400 text-lg">
                  {"★".repeat(a.note)}
                  {"☆".repeat(5 - a.note)}
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-700">
                “{a.commentaire}”
              </p>
              <button
                className="mt-2 text-xs text-red-500"
                onClick={() => handleDelete(a.id)}
              >
                Supprimer / masquer
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

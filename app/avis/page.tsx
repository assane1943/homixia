"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AvisPage() {
  const router = useRouter();
  const [nom, setNom] = useState("");
  const [note, setNote] = useState(0);
  const [commentaire, setCommentaire] = useState("");
  const [avis, setAvis] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom || !note || !commentaire) {
      alert("Merci de remplir tous les champs 🌟");
      return;
    }

    const newAvis = {
      nom,
      note,
      commentaire,
      date: new Date().toLocaleDateString("fr-FR"),
    };

    setAvis([newAvis, ...avis]);
    setNom("");
    setNote(0);
    setCommentaire("");
    setMessage("Merci pour votre avis 💛");
    setTimeout(() => setMessage(null), 2000);
  };

  return (
    <main className="min-h-screen bg-white text-gray-800 font-sans py-6 px-4 relative">
      {/* HEADER avec flèche */}
      <header className="flex items-center justify-center relative py-4 mb-4 border-b border-gray-100">
        <button
          onClick={() => router.push("/")}
          className="absolute left-4 text-amber-600 text-2xl font-bold active:scale-95"
          aria-label="Retour à l’accueil"
        >
          ←
        </button>
        <h1 className="text-lg font-semibold text-amber-600">Avis des clients ⭐</h1>
      </header>

      {/* Notification */}
      {message && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-4 py-2 rounded-full shadow-md text-sm font-medium z-50">
          {message}
        </div>
      )}

      {/* FORMULAIRE */}
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-white p-5 rounded-3xl shadow-md border border-amber-100 space-y-4"
      >
        <input
          type="text"
          placeholder="Votre prénom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          className="w-full border border-amber-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
        />

        <div className="text-center">
          <p className="text-sm font-semibold text-gray-700 mb-2">
            ⭐ Votre note :
          </p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <span
                key={n}
                onClick={() => setNote(n)}
                className={`text-3xl cursor-pointer transition ${
                  n <= note
                    ? "text-amber-400 scale-110"
                    : "text-gray-300 hover:text-amber-300"
                }`}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <textarea
          placeholder="💬 Votre commentaire sur le logement, les services ou la ville..."
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
          className="w-full border border-amber-200 rounded-xl px-3 py-2 text-sm h-24 resize-none focus:ring-2 focus:ring-amber-400 focus:outline-none"
        />

        <button
          type="submit"
          className="w-full bg-amber-500 text-white py-2 rounded-xl font-semibold hover:bg-amber-600 active:scale-95 transition"
        >
          Envoyer mon avis ✨
        </button>
      </form>

      {/* LISTE DES AVIS */}
      <div className="max-w-md mx-auto mt-8 space-y-4">
        {avis.length === 0 ? (
          <p className="text-center text-gray-600 italic">
            Aucun avis pour le moment 💬
          </p>
        ) : (
          avis.map((a, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl shadow-md border border-amber-100 p-4"
            >
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-semibold text-gray-800">{a.nom}</h3>
                <p className="text-xs text-gray-500">{a.date}</p>
              </div>
              <div className="text-amber-400 text-lg mb-1">
                {"★".repeat(a.note)}{"☆".repeat(5 - a.note)}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                “{a.commentaire}”
              </p>
            </div>
          ))
        )}
      </div>

      {/* FOOTER */}
      <footer className="text-center text-xs text-gray-500 mt-10 mb-4">
        © {new Date().getFullYear()} Homixia – L’hospitalité connectée 🌐
      </footer>
    </main>
  );
}

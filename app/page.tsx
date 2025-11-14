"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  // 🔹 Gestion du nom du client dynamique
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qName = params.get("name");
    if (qName) {
      setName(qName);
      localStorage.setItem("homixia_guest_name", qName);
    } else {
      const stored = localStorage.getItem("homixia_guest_name");
      if (stored) setName(stored);
    }
  }, []);

  const welcomeTitle = name ? `👋 Bienvenue ${name} !` : "👋 Bienvenue !";
  const welcomeSub = name
    ? "Nous sommes heureux de vous accueillir dans votre logement Homixia."
    : "Nous sommes heureux de vous accueillir. Découvrez votre logement Homixia.";

  return (
    <main className="min-h-screen relative overflow-hidden font-sans">
      {/* 🖼️ Image de fond */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/bg-apartment.jpg')" }}
      ></div>

      {/* 🌑 Filtre sombre + flou */}
      <div className="absolute inset-0 bg-black/45 backdrop-blur-sm -z-10"></div>

      {/* 🔥 BULLE CHECK-IN BAS DROITE (au-dessus de Aya) */}
      <button
        aria-label="Check-in"
        onClick={() => router.push("/check-in")}
        className="fixed bottom-24 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#F28C00] text-white shadow-2xl ring-4 ring-white/20 hover:scale-105 transition"
      >
        ✓
      </button>

      {/* 📱 Contenu principal */}
      <div className="min-h-screen flex flex-col items-center justify-start px-5 pt-12 pb-20 text-center text-white">
        {/* Logo */}
        <div className="mb-6">
          <img
            src="/logo-homixia.png"
            alt="Homixia"
            className="h-24 sm:h-28 mx-auto drop-shadow-lg animate-pulse-slow"
          />
        </div>

        {/* Message de bienvenue */}
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-2 drop-shadow-md animate-fade-in">
          {welcomeTitle}
        </h1>
        <p className="text-sm sm:text-base mb-8 max-w-lg drop-shadow-sm animate-fade-in-delay">
          {welcomeSub}
        </p>

        {/* Boutons */}
        <div className="w-full max-w-md space-y-4 animate-slide-up">
          <a
            href="/appartement"
            className="block bg-gradient-to-b from-[#F4A000] to-[#F28C00] text-black font-semibold py-4 rounded-full shadow-xl ring-2 ring-white/20 hover:brightness-110 transition"
          >
            🏡 Découvrir l’appartement
          </a>

          <a
            href="/ville"
            className="block bg-gradient-to-b from-[#F4A000] to-[#F28C00] text-black font-semibold py-4 rounded-full shadow-xl ring-2 ring-white/20 hover:brightness-110 transition"
          >
            🌍 Explorer la ville
          </a>

          <a
            href="/services"
            className="block bg-gradient-to-b from-[#F4A000] to-[#F28C00] text-black font-semibold py-4 rounded-full shadow-xl ring-2 ring-white/20 hover:brightness-110 transition"
          >
            🧰 Services à la demande
          </a>

          <a
            href="/avis"
            className="block bg-white/90 text-[#002B5C] font-semibold py-4 rounded-full shadow-md border border-white/30 hover:scale-105 transition"
          >
            ⭐ Avis des clients
          </a>
        </div>
      </div>

      {/* 💬 Bulle Aya */}
      <button
        aria-label="Ouvrir Aya"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#F28C00] text-white shadow-2xl ring-4 ring-white/20 hover:scale-105 transition"
        onClick={() => alert('Aya arrive bientôt 💬')}
      >
        💬
      </button>

      {/* ✨ Animations */}
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-delay {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.95;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        .animate-fade-in-delay {
          animation: fade-in-delay 1.2s ease-out forwards;
        }

        .animate-slide-up {
          animation: slide-up 1.5s ease-out forwards;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}

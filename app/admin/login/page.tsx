"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, motDePasse }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Erreur de connexion ⚠️");
      setLoading(false);
      return;
    }

    setMessage("✅ Connexion réussie !");

    // 🔥 STOCKAGE EN COOKIE POUR LE MIDDLEWARE
    Cookies.set(
      "homixia_admin",
      JSON.stringify({ nom: data.nom, email: data.email }),
      {
        expires: 7,
        sameSite: "strict",
        secure: true,
      }
    );

    // Redirection
    setTimeout(() => router.push("/admin"), 500);

    setLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-amber-100 to-white px-6 font-sans">
      <Image
        src="/logo-homixia.png"
        alt="Homixia"
        width={80}
        height={80}
        className="mb-4"
      />

      <h1 className="text-2xl font-bold text-amber-600 mb-6">
        Connexion Admin 🔐
      </h1>

      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-sm border border-amber-100 space-y-4"
      >
        <input
          type="email"
          placeholder="Adresse email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 text-sm"
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 text-sm"
        />

        {message && (
          <p className="text-center text-sm text-amber-600">{message}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-500 text-white py-2 rounded-lg font-semibold hover:bg-amber-600 transition disabled:opacity-50"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      <p className="text-xs text-gray-500 mt-6">
        © {new Date().getFullYear()} Homixia — Accès réservé à l’équipe
      </p>
    </main>
  );
}

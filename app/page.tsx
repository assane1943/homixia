"use client";

export default function MaintenancePage() {
  return (
    <main className="min-h-screen bg-[#021F3B] text-white flex flex-col items-center justify-center px-6 text-center font-sans">

      {/* Logo */}
      <img
        src="/logo-homixia.png"
        alt="Homixia Logo"
        className="w-32 h-32 object-contain mb-6 animate-pulse"
      />

      {/* Message */}
      <h1 className="text-2xl sm:text-3xl font-extrabold mb-3">
        🚧 Homixia est en maintenance
      </h1>

      

      {/* Badge bientôt disponible */}
      <div className="px-6 py-3 bg-[#F4A000] rounded-full text-black font-semibold shadow-lg animate-bounce">
        Bientôt disponible ✨
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 text-xs text-white/40">
        © {new Date().getFullYear()} Homixia — Stay Connected
      </footer>
    </main>
  );
}

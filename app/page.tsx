// app/page.tsx
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* --- LOGEMENTS --- */
const apartments = [
  {
    title: "Appartement Premium Anfa",
    location: "Casablanca — Anfa",
    image: "/appartement-premium-anfa.jpg",
  },
  {
    title: "Appartement Marina View",
    location: "Casablanca — Marina",
    image: "/appartement-marina.jpg",
  },
  {
    title: "Appartement Palmier Moderne",
    location: "Casablanca — Palmier",
    image: "/appartement-palmier.jpg",
  },
];

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const whatsappText = encodeURIComponent(
    "Bonjour, je souhaite plus d'informations concernant vos services Homixia."
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="w-full bg-white text-[#002f6d]">

      {/* HEADER */}
      <motion.header
        initial={false}
        animate={{
          backdropFilter: scrolled ? "saturate(1) blur(6px)" : "none",
          boxShadow: scrolled ? "0 6px 20px rgba(2,15,40,0.06)" : "none",
        }}
        transition={{ duration: 0.35 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/95"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">

          {/* Logo */}
          <Image src="/logo-homixia.png" alt="Homixia" width={130} height={70} className="object-contain" />

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8 text-lg font-medium">
            <a href="#services" className="nav-link">Services</a>
            <a href="#logements" className="nav-link">Logements</a>
            <a href="#contact" className="nav-link">Contact</a>

            <a
              href={`https://wa.me/212665247695?text=${whatsappText}`}
              className="btn-primary ml-4"
            >
              Contactez-nous
            </a>
          </nav>

          {/* Mobile Burger */}
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="md:hidden p-2 rounded-md"
          >
            <svg width="26" height="26" viewBox="0 0 24 24">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="#002f6d" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {openMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-white border-t"
            >
              <div className="px-6 py-6 space-y-4">
                <a href="#services" className="nav-link" onClick={() => setOpenMenu(false)}>Services</a>
                <a href="#logements" className="nav-link" onClick={() => setOpenMenu(false)}>Logements</a>
                <a href="#contact" className="nav-link" onClick={() => setOpenMenu(false)}>Contact</a>

                <a
                  href={`https://wa.me/212665247695?text=${whatsappText}`}
                  className="btn-primary block w-full text-center"
                >
                  Contactez-nous
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-40 pb-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

        {/* LEFT */}
        <div>
          <span className="inline-block bg-[#f5f7fb] px-3 py-1 rounded-full text-sm text-[#002f6d]">
            📍 Basé au Maroc
          </span>

          <h1 className="mt-6 text-4xl md:text-5xl font-serif font-extrabold leading-tight text-[#002f6d]">
            Profitez de votre temps,<br />
            <span className="text-[#ff9202]">on s'occupe de vos voyageurs</span>
          </h1>

          <p className="mt-4 text-lg text-[#123] opacity-80 max-w-lg">
            Homixia crée une expérience unique pour vos voyageurs tout en maximisant les revenus de vos logements.
          </p>

          {/* Avatars */}
          <div className="flex items-center gap-4 mt-6">
            <div className="flex -space-x-3">
              <Image src="/avatar1.jpg" width={44} height={44} className="rounded-full border-2 border-white shadow" alt="" />
              <Image src="/avatar2.jpg" width={44} height={44} className="rounded-full border-2 border-white shadow" alt="" />
              <Image src="/avatar3.jpg" width={44} height={44} className="rounded-full border-2 border-white shadow" alt="" />
            </div>
            <p className="text-sm font-semibold">⭐ 4,92 sur Airbnb</p>
          </div>

          {/* CTA */}
          <div className="mt-8 flex gap-4">
            <a href="#services" className="btn-ghost">Découvrir notre conciergerie →</a>
            <a href={`https://wa.me/212665247695?text=${whatsappText}`} className="btn-primary">
              Réserver / Contact
            </a>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <motion.div
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7 }}
  className="relative w-full"
>
  <div className="rounded-3xl overflow-hidden shadow-2xl w-full">
    <Image
      src="/hero-casa.jpg"
      alt="Casablanca"
      width={900}
      height={700}
      className="
        object-cover 
        w-full 
        h-[260px]        /* 📱 Hauteur mobile */
        sm:h-[320px]     /* 📱 Tablet small */
        md:h-[420px]     /* 💻 Desktop */
        lg:h-[480px]     /* 💻 Large écrans */
      "
    />
  </div>
</motion.div>

      </section>

      {/* WAVE HERO → VIDEO */}
      <div className="w-full overflow-hidden -mb-2">
        <svg viewBox="0 0 1440 100" className="w-full h-16 text-white" fill="currentColor">
          <path d="M0,64L1440,0L1440,100L0,100Z"></path>
        </svg>
      </div>

      {/* VIDEO SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl mx-auto px-6 py-16"
      >
        <div className="rounded-3xl overflow-hidden shadow-lg">
          <video src="/qr-intro.mp4" autoPlay muted loop playsInline className="w-full h-auto" />
        </div>

        <div className="text-center mt-6">
          <h2 className="text-3xl font-serif font-bold text-[#002f6d]">
            Une expérience Homixia à portée de main
          </h2>
          <p className="mt-3 text-lg text-[#002f6d]/70 max-w-2xl mx-auto">
            Découvrez votre logement, les services instantanés et les bons plans Homixia grâce à votre QR Code.
          </p>
        </div>
      </motion.section>

      {/* WAVE VIDEO → SERVICES */}
      <div className="w-full overflow-hidden -mt-1">
        <svg viewBox="0 0 1440 100" className="w-full h-16 text-[var(--bg-soft)]" fill="currentColor">
          <path d="M0,64L1440,0L1440,100L0,100Z"></path>
        </svg>
      </div>

      {/* SERVICES */}
      <motion.section
        id="services"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full bg-[var(--bg-soft)] py-16"
      >
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-serif font-bold text-center mb-10">
            Nos Services Premium
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "QR Code dans l’appartement", text: "Accès immédiat aux guides, règles et services." },
              { title: "Services instantanés", text: "Baby-sitter, onglerie, chef privé, ménage à la demande." },
              { title: "Check-in intelligent", text: "Arrivée autonome 24/7 sécurisée & simple." },
              { title: "Guides & bons plans", text: "Les meilleures adresses sélectionnées pour vos voyageurs." },
              { title: "Gestion simple & efficace", text: "Annonces, calendrier, ménage, check-in/out." },
              { title: "Assistance & maintenance", text: "Interventions rapides: plomberie, électricité, nettoyage." },
              { title: "Annonces optimisées", text: "Photos pro, textes SEO et stratégie tarifaire." },
            ].map((s, i) => (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-[#123]/80">{s.text}</p>

                <span className="inline-block mt-4 px-3 py-1 rounded-full text-xs font-medium text-[#ff9202] bg-[#fff6ec]">
                  Service Homixia
                </span>
              </motion.article>
            ))}
          </div>
        </div>
      </motion.section>

      {/* GRADIENT SERVICES → LOGEMENTS */}
      <div className="h-16 w-full bg-gradient-to-b from-[var(--bg-soft)] to-white"></div>

      {/* LOGEMENTS */}
      <motion.section
        id="logements"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full py-16"
      >
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-serif font-bold text-center mb-10">
            Nos Logements
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {apartments.map((apt, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition"
              >
                <Image src={apt.image} width={800} height={600} className="object-cover h-56 w-full" alt="" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{apt.title}</h3>
                  <p className="mt-1 text-sm text-[#123]/80">{apt.location}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CONTACT */}
<motion.section
  id="contact"
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
  className="w-full bg-[var(--accent-dark)] text-white py-20"
>
  <div className="max-w-4xl mx-auto px-6 text-center">

    <h2
  className="text-4xl font-serif font-bold mb-4"
  style={{
    color: "#ffffff",
    opacity: 1,
    zIndex: 9999,
    position: "relative",
    mixBlendMode: "normal",
    filter: "none",
    textShadow: "0 0 0 transparent",
  }}
>
  Contact & Réservation
</h2>


    <p className="mb-6 text-white">
      Envie d’optimiser la gestion de votre bien ? Parlons-en.
    </p>

    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
      <a
        href={`https://wa.me/212665247695?text=${whatsappText}`}
        className="btn-primary"
      >
        Nous écrire sur WhatsApp
      </a>

      <a
        href="mailto:contact@homixia.example"
        className="btn-ghost-inverted"
      >
        Envoyer un email
      </a>
    </div>
  </div>
</motion.section>


      {/* FOOTER */}
      <footer className="w-full bg-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-[#123]/80">
          © {new Date().getFullYear()} Homixia — Conciergerie Premium. Tous droits réservés.
        </div>
      </footer>

      {/* BOUTON WHATSAPP FLOTTANT */}
      <a
        href={`https://wa.me/212665247695?text=${whatsappText}`}
        className="fixed bottom-6 right-6 z-[200] bg-[#25D366] rounded-full w-16 h-16 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
        aria-label="WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="white">
          <path d="M20.52 3.48A11.86 11.86 0 0012 .1 12 12 0 002.21 18.7L.1 24l5.45-2.07a12 12 0 0017-13.58 11.86 11.86 0 00-2.03-4.87zM12 22a9.93 9.93 0 01-5.09-1.42l-.36-.21-3.23 1.22.86-3.39-.22-.35A10 10 0 1122 12a10 10 0 01-10 10zm5.28-7.29c-.29-.15-1.71-.84-1.98-.94s-.46-.15-.65.15-.75.94-.92 1.13-.34.22-.63.07a8.2 8.2 0 01-2.4-1.48 9 9 0 01-1.66-2.06c-.17-.3 0-.46.13-.61s.3-.34.45-.51a2 2 0 00.3-.51.56.56 0 00-.02-.54c-.07-.15-.65-1.57-.9-2.15s-.48-.5-.66-.51h-.57a1.1 1.1 0 00-.78.36 3.33 3.33 0 00-1 2.47 5.84 5.84 0 001.24 3.08 13.34 13.34 0 005.15 4.63 17.6 17.6 0 001.74.64 4.2 4.2 0 001.93.12 3.16 3.16 0 002.07-1.46 2.57 2.57 0 00.18-1.46c-.08-.14-.26-.23-.55-.38z" />
        </svg>
      </a>

    </main>
  );
}

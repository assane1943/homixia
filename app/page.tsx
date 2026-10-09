const services = [
  { icon: '✦', title: 'Gestion locative', text: 'Une prise en charge complète de votre location courte durée, de l’annonce aux voyageurs.' },
  { icon: '✦', title: 'Ménage professionnel', text: 'Des équipes de confiance, un logement impeccable et des passages parfaitement synchronisés.' },
  { icon: '✦', title: 'Navette aéroport', text: 'Des transferts sereins entre Casablanca et l’aéroport Mohammed V, à toute heure.' },
  { icon: '✦', title: 'Guide voyageur', text: 'Un accueil digital élégant pour aider chaque voyageur à profiter pleinement de son séjour.' },
];

export default function HomePage() {
  return (
    <main>
      <header className="nav">
        <a className="brand" href="/" aria-label="Homixia, accueil">HOMIXIA<span>.</span></a>
        <nav aria-label="Navigation principale">
          <a href="#services">Services</a>
          <a href="#apropos">Notre approche</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="navCta" href="#contact">Parlons de votre bien</a>
      </header>

      <section className="hero">
        <div className="heroCopy">
          <p className="eyebrow">CONCIERGERIE À CASABLANCA</p>
          <h1>L’hospitalité,<br /><em>réinventée.</em></h1>
          <p className="lead">Homixia imagine des séjours fluides et mémorables, tout en simplifiant la gestion de vos biens.</p>
          <div className="actions">
            <a className="primary" href="#services">Découvrir nos services <span>→</span></a>
            <a className="secondary" href="https://wa.me/212665247695?text=Bonjour%20Homixia%2C%20je%20souhaite%20en%20savoir%20plus%20sur%20vos%20services." target="_blank" rel="noreferrer">Nous écrire sur WhatsApp</a>
          </div>
          <div className="trust"><strong>Casablanca & littoral atlantique</strong><span>•</span><span>Service premium, humain et disponible</span></div>
        </div>
        <div className="heroVisual" role="img" aria-label="Intérieur lumineux et raffiné à Casablanca">
          <div className="heroCard"><span>01</span><p>Votre bien<br />entre de bonnes mains.</p></div>
        </div>
      </section>

      <section id="services" className="services">
        <div className="sectionIntro">
          <p className="eyebrow">NOS SERVICES</p>
          <h2>Tout ce qu’il faut,<br /><em>sans rien laisser au hasard.</em></h2>
          <p>Pour les propriétaires exigeants comme pour les voyageurs qui attendent plus qu’un simple logement.</p>
        </div>
        <div className="serviceGrid">
          {services.map((service, index) => (
            <article className="service" key={service.title}>
              <div className="serviceTop"><span>{service.icon}</span><small>0{index + 1}</small></div>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
              <a href="#contact" aria-label={`En savoir plus sur ${service.title}`}>En savoir plus <b>→</b></a>
            </article>
          ))}
        </div>
      </section>

      <section id="apropos" className="statement">
        <p className="eyebrow">LA SIGNATURE HOMIXIA</p>
        <h2>Le détail change <em>tout.</em></h2>
        <p>De la première réservation au dernier message de départ, nous orchestrons chaque étape avec méthode, réactivité et attention.</p>
      </section>

      <section id="contact" className="contact">
        <div>
          <p className="eyebrow">UN PROJET ?</p>
          <h2>Parlons de<br /><em>votre bien.</em></h2>
        </div>
        <div className="contactSide">
          <p>Vous souhaitez confier un appartement, préparer un séjour ou mettre en place un service sur mesure ? Notre équipe vous répond rapidement.</p>
          <a className="lightButton" href="https://wa.me/212665247695?text=Bonjour%20Homixia%2C%20je%20souhaite%20parler%20de%20mon%20projet." target="_blank" rel="noreferrer">Démarrer la conversation <span>→</span></a>
          <a className="email" href="mailto:contact@homixia.app">contact@homixia.app</a>
        </div>
      </section>

      <footer><a className="brand" href="/">HOMIXIA<span>.</span></a><p>© {new Date().getFullYear()} Homixia. Casablanca, Maroc.</p></footer>

      <style jsx global>{`
        :root { --ink:#15241f; --paper:#f7f5f0; --sage:#dbe3d7; --orange:#dd6c38; }
        * { box-sizing:border-box; } html { scroll-behavior:smooth; } body { margin:0; background:var(--paper); color:var(--ink); font-family:Arial, Helvetica, sans-serif; }
        .nav { height:82px; display:flex; align-items:center; justify-content:space-between; max-width:1280px; padding:0 42px; margin:auto; }
        .brand { color:var(--ink); font:700 22px/1 Arial, sans-serif; letter-spacing:.14em; text-decoration:none; } .brand span { color:var(--orange); }
        nav { display:flex; gap:30px; } nav a, .email { color:var(--ink); text-decoration:none; font-size:14px; } nav a:hover,.email:hover { text-decoration:underline; }
        .navCta,.primary,.lightButton { background:var(--ink); color:#fff; padding:14px 20px; text-decoration:none; font-size:13px; font-weight:700; border-radius:999px; }
        .hero { min-height:650px; max-width:1280px; margin:auto; padding:58px 42px 78px; display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:center; }
        .eyebrow { color:var(--orange); font-size:11px; font-weight:700; letter-spacing:.19em; margin:0 0 22px; }
        h1,h2 { margin:0; font-family:Georgia, 'Times New Roman', serif; font-weight:400; letter-spacing:-.055em; } h1 { font-size:clamp(58px,7vw,98px); line-height:.91; } h2 { font-size:clamp(42px,5vw,67px); line-height:.95; }
        em { color:var(--orange); font-weight:400; } .lead { max-width:470px; margin:28px 0; color:#47534d; font-size:18px; line-height:1.6; }
        .actions { display:flex; flex-wrap:wrap; align-items:center; gap:20px; } .primary span,.lightButton span { margin-left:15px; font-size:18px; } .secondary { color:var(--ink); font-size:14px; font-weight:700; }
        .trust { display:flex; flex-wrap:wrap; gap:10px; margin-top:54px; color:#637069; font-size:12px; } .trust strong { color:var(--ink); }
        .heroVisual { height:540px; position:relative; border-radius:2px; background:linear-gradient(0deg,rgba(12,28,20,.25),rgba(12,28,20,.02)),url('https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=85') center/cover; }
        .heroCard { position:absolute; left:-36px; bottom:34px; width:220px; padding:24px; background:#e6e8df; color:var(--ink); } .heroCard span { color:var(--orange); font-size:12px; font-weight:700; } .heroCard p { margin:30px 0 0; font:24px/1.05 Georgia,serif; }
        .services { background:var(--sage); padding:112px max(42px,calc((100vw - 1196px)/2)); display:grid; grid-template-columns:.8fr 1.2fr; gap:76px; } .sectionIntro>p:last-child { color:#4d5b53; max-width:340px; line-height:1.65; margin-top:30px; }
        .serviceGrid { display:grid; grid-template-columns:1fr 1fr; border-top:1px solid #acb7aa; } .service { min-height:256px; padding:28px 25px; border-bottom:1px solid #acb7aa; border-left:1px solid #acb7aa; position:relative; } .service:nth-child(odd){ border-left:0; }
        .serviceTop { display:flex; justify-content:space-between; color:var(--orange); font-size:17px; } .serviceTop small { color:#718079; font-size:11px; } .service h3 { margin:52px 0 10px; font:26px Georgia,serif; } .service p { color:#4d5b53; line-height:1.5; font-size:14px; max-width:255px; } .service a { display:inline-block; margin-top:12px; color:var(--ink); text-decoration:none; font-size:13px; font-weight:700; } .service b{ margin-left:8px; color:var(--orange); }
        .statement { padding:135px 42px; max-width:900px; margin:auto; text-align:center; } .statement p:last-child { margin:28px auto 0; max-width:550px; color:#59645f; line-height:1.7; }
        .contact { background:var(--orange); color:#fff; padding:100px max(42px,calc((100vw - 1196px)/2)); display:grid; grid-template-columns:1fr 1fr; gap:70px; } .contact .eyebrow { color:#fff0e6; } .contact em { color:var(--ink); } .contactSide { padding-top:26px; } .contactSide p { line-height:1.7; max-width:410px; } .lightButton { display:inline-block; margin:26px 0; background:#fff; color:var(--ink); } .email { display:block; color:#fff; font-weight:700; }
        footer { max-width:1280px; margin:auto; padding:30px 42px; display:flex; justify-content:space-between; align-items:center; } footer p { color:#6c746f; font-size:12px; }
        @media (max-width:760px) { .nav{height:70px;padding:0 21px;} nav{display:none}.navCta{display:none}.hero{min-height:0;padding:55px 22px 72px;grid-template-columns:1fr;gap:42px}.heroVisual{height:380px}.heroCard{left:0;bottom:-22px;width:200px}.lead{font-size:16px}.services{padding:76px 22px;grid-template-columns:1fr;gap:42px}.serviceGrid{grid-template-columns:1fr}.service{border-left:0}.statement{padding:96px 22px}.contact{padding:76px 22px;grid-template-columns:1fr;gap:20px}.contactSide{padding-top:0}footer{padding:26px 22px;display:block}footer p{margin-top:20px} }
      `}</style>
    </main>
  );
}

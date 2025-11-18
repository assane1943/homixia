"use client";

import { useEffect, useState } from "react";

// -------------------------------------------------------------
// Interface type
// -------------------------------------------------------------
interface LocalContentItem {
  id: number;
  ville: string;
  categorie: string;
  nom: string;
  adresse?: string;
  image?: string;
}

// -------------------------------------------------------------
// Composant Autocomplete Google Maps
// -------------------------------------------------------------
function PlaceSelector({ onSelect }: { onSelect: (place: any) => void }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const delay = setTimeout(async () => {
      setLoading(true);
      const res = await fetch(`/api/maps/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSuggestions(data || []);
      setLoading(false);
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  const handleSelect = async (place_id: string, description: string) => {
    setQuery(description);
    setSuggestions([]);
    setLoading(true);

    const res = await fetch(`/api/maps/details?place_id=${place_id}`);
    const details = await res.json();
    setLoading(false);

    onSelect(details);
  };

  return (
    <div className="relative space-y-2">
      <label className="text-sm font-medium text-black">Rechercher un lieu Google Maps</label>

      <input
        type="text"
        className="border p-3 rounded-xl text-sm w-full"
        placeholder="Ex: Cabestan, Anfa Place, Corniche..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading && <p className="text-xs text-gray-500">Recherche...</p>}

      {suggestions.length > 0 && (
        <ul className="absolute top-20 w-full z-30 bg-white border rounded-xl shadow-md">
          {suggestions.map((s) => (
            <li
              key={s.place_id}
              className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(s.place_id, s.description)}
            >
              {s.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// PAGE ADMIN
// -------------------------------------------------------------
export default function AdminSettingsPage() {
  // ---------------- PASSWORD ADMIN -----------------
  const [email, setEmail] = useState("admin@homixia.com");
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [pwdMsg, setPwdMsg] = useState<string | null>(null);

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg(null);

    const res = await fetch("/api/admin/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        ancienMotDePasse: oldPwd,
        nouveauMotDePasse: newPwd,
      }),
    });

    const data = await res.json();
    if (!res.ok) setPwdMsg(data.error || "Erreur");
    else {
      setPwdMsg("Mot de passe modifié ✅");
      setOldPwd("");
      setNewPwd("");
    }
  };

  // ---------------- LIEUX GOOGLE MAPS --------------
  const [items, setItems] = useState<LocalContentItem[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);

  const [form, setForm] = useState({
    ville: "Casablanca",
    categorie: "restaurant",
  });

  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/local-content")
      .then((r) => r.json())
      .then(setItems)
      .catch(console.error);
  }, []);

  // -----------------------------------------------------
  // 🟢 ADD LOCAL CONTENT (Version Fixée)
  // -----------------------------------------------------
  const addLocalContent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPlace) {
      setMsg("Veuillez sélectionner un lieu via la recherche Google Maps.");
      return;
    }

    setMsg(null);

    const res = await fetch("/api/local-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ville: form.ville,
        categorie: form.categorie,

        // 📌 Envoi des vraies données Google Maps
        nom: selectedPlace.nom,
        adresse: selectedPlace.adresse,
        lat: selectedPlace.lat,
        lng: selectedPlace.lng,
        type: selectedPlace.type,
        horaire: selectedPlace.horaire,
        image: selectedPlace.image,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMsg(data.error);
      return;
    }

    setItems((prev) => [data, ...prev]);
    setSelectedPlace(null);
    setMsg("Lieu ajouté avec succès ✅");
  };

  const deleteLocal = async (id: number) => {
    await fetch(`/api/local-content?id=${id}`, { method: "DELETE" });
    setItems((p) => p.filter((i) => i.id !== id));
  };

  return (
    <div className="space-y-6 text-black pb-24">

      {/* ------------------------ PASSWORD ------------------------ */}
      <section className="bg-white rounded-2xl shadow p-4 border border-amber-100 space-y-3">
        <h3 className="text-sm font-semibold text-black">🔐 Modifier mot de passe admin</h3>

        <form onSubmit={changePassword} className="space-y-3">
          <input
            className="border rounded-lg px-2 py-2 text-sm w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="border rounded-lg px-2 py-2 text-sm w-full"
            value={oldPwd}
            onChange={(e) => setOldPwd(e.target.value)}
          />

          <input
            type="password"
            className="border rounded-lg px-2 py-2 text-sm w-full"
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
          />

          <button className="w-full bg-amber-500 text-white rounded-lg py-2 text-sm font-semibold">
            Mettre à jour
          </button>
        </form>

        {pwdMsg && <p className="text-xs text-amber-700">{pwdMsg}</p>}
      </section>

      {/* ------------------------ GOOGLE MAPS ------------------------ */}
      <section className="bg-white rounded-2xl shadow p-4 border border-amber-100 space-y-3">
        <h3 className="text-sm font-semibold text-black">
          📍 Restaurants & lieux à visiter (Google Maps)
        </h3>

        <form onSubmit={addLocalContent} className="space-y-3">
          <select
            className="border px-2 py-2 rounded w-full"
            value={form.categorie}
            onChange={(e) => setForm((f) => ({ ...f, categorie: e.target.value }))}
          >
            <option value="restaurant">Restaurant</option>
            <option value="lieu">Lieu à visiter</option>
          </select>

          <PlaceSelector onSelect={(place) => setSelectedPlace(place)} />

          {selectedPlace && (
            <div className="p-3 border rounded-xl bg-gray-50 text-sm">
              <p><strong>Nom :</strong> {selectedPlace.nom}</p>
              <p><strong>Adresse :</strong> {selectedPlace.adresse}</p>
              <p><strong>Lat :</strong> {selectedPlace.lat}</p>
              <p><strong>Lng :</strong> {selectedPlace.lng}</p>
            </div>
          )}

          <button className="bg-amber-500 text-white w-full py-2 rounded font-semibold">
            Ajouter
          </button>

          {msg && <p className="text-sm text-amber-700">{msg}</p>}
        </form>

        <div className="space-y-3">
          {items.map((i) => (
            <div key={i.id} className="border rounded-xl p-3 flex justify-between items-center">
              <div>
                <p className="font-semibold">{i.nom}</p>
                <p className="text-xs text-gray-600">{i.adresse}</p>
              </div>
              <button
                className="text-red-500 text-sm"
                onClick={() => deleteLocal(i.id)}
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

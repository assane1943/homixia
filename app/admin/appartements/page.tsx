"use client";

import { useEffect, useState } from "react";

interface VideoItem {
  title: string;
  youtubeId: string;
}

interface Appartement {
  id: number;
  code: string;
  nom: string;
  ville: string;
  pays: string;
  adresse: string;
  description?: string | null;
  wifiSsid?: string | null;
  wifiPassword?: string | null;
  keyboxPlace?: string | null;
  keyboxCode?: string | null;
  imagePrincipale?: string | null;
  equipements?: string | null;
  videosExplicatives?: string | null;
  regles?: string | null;
  proprietaireNom?: string | null;
  proprietaireTel?: string | null;
  proprietaireEmail?: string | null;
}

interface FormState {
  code: string;
  nom: string;
  ville: string;
  pays: string;
  adresse: string;
  description: string;
  wifiSsid: string;
  wifiPassword: string;
  keyboxPlace: string;
  keyboxCode: string;
  proprietaireNom: string;
  proprietaireTel: string;
  proprietaireEmail: string;
  equipementInput: string;
  equipements: string[];
  regleInput: string;
  regles: string[];
  videoTitle: string;
  videoYoutubeId: string;
  videos: VideoItem[];
}

const EMPTY_FORM: FormState = {
  code: "",
  nom: "",
  ville: "",
  pays: "",
  adresse: "",
  description: "",
  wifiSsid: "",
  wifiPassword: "",
  keyboxPlace: "",
  keyboxCode: "",
  proprietaireNom: "",
  proprietaireTel: "",
  proprietaireEmail: "",
  equipementInput: "",
  equipements: [],
  regleInput: "",
  regles: [],
  videoTitle: "",
  videoYoutubeId: "",
  videos: [],
};

export default function AdminAppartementsPage() {
  const [list, setList] = useState<Appartement[]>([]);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // 🔄 Charger la liste complète via /api/appartement
  useEffect(() => {
    fetch("/api/appartement")
      .then((r) => r.json())
      .then(setList)
      .catch(console.error);
  }, []);

  const handleChange = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  // ✏️ Remplissage formulaire
  const handleEdit = (apt: Appartement) => {
    let equipements: string[] = [];
    let regles: string[] = [];
    let videos: VideoItem[] = [];

    try {
      if (apt.equipements) equipements = JSON.parse(apt.equipements);
    } catch {}

    try {
      if (apt.regles) regles = JSON.parse(apt.regles);
    } catch {}

    try {
      if (apt.videosExplicatives) videos = JSON.parse(apt.videosExplicatives);
    } catch {}

    setEditingId(apt.id);

    setForm({
      code: apt.code,
      nom: apt.nom,
      ville: apt.ville,
      pays: apt.pays,
      adresse: apt.adresse,
      description: apt.description || "",
      wifiSsid: apt.wifiSsid || "",
      wifiPassword: apt.wifiPassword || "",
      keyboxPlace: apt.keyboxPlace || "",
      keyboxCode: apt.keyboxCode || "",
      proprietaireNom: apt.proprietaireNom || "",
      proprietaireTel: apt.proprietaireTel || "",
      proprietaireEmail: apt.proprietaireEmail || "",
      equipementInput: "",
      equipements,
      regleInput: "",
      regles,
      videoTitle: "",
      videoYoutubeId: "",
      videos,
    });

    setMsg("Édition en cours ✏️");
  };

  // ➕ Ajouter équipement
  const addEquipement = () => {
    const v = form.equipementInput.trim();
    if (!v) return;

    setForm((f) => ({
      ...f,
      equipements: [...f.equipements, v],
      equipementInput: "",
    }));
  };

  const removeEquipement = (index: number) => {
    setForm((f) => ({
      ...f,
      equipements: f.equipements.filter((_, i) => i !== index),
    }));
  };

  // ➕ Règles
  const addRegle = () => {
    const v = form.regleInput.trim();
    if (!v) return;
    setForm((f) => ({
      ...f,
      regles: [...f.regles, v],
      regleInput: "",
    }));
  };

  const removeRegle = (index: number) => {
    setForm((f) => ({
      ...f,
      regles: f.regles.filter((_, i) => i !== index),
    }));
  };

  // ➕ Vidéos
  const addVideo = () => {
    if (!form.videoTitle.trim() || !form.videoYoutubeId.trim()) return;

    setForm((f) => ({
      ...f,
      videos: [
        ...f.videos,
        { title: f.videoTitle, youtubeId: f.videoYoutubeId },
      ],
      videoTitle: "",
      videoYoutubeId: "",
    }));
  };

  const removeVideo = (index: number) => {
    setForm((f) => ({
      ...f,
      videos: f.videos.filter((_, i) => i !== index),
    }));
  };

  // 📤 Upload image → met à jour l'appartement via CODE
  const handleUpload = async (aptId: number, file: File) => {
    const apt = list.find((a) => a.id === aptId);
    if (!apt) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.url) {
      await fetch(`/api/appartement/${apt.code}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagePrincipale: data.url }),
      });

      setList((prev) =>
        prev.map((a) => (a.id === aptId ? { ...a, imagePrincipale: data.url } : a))
      );

      setMsg("Image mise à jour ✅");
    }
  };

  // 💾 Ajouter / Modifier
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const payload = {
      code: form.code,
      nom: form.nom,
      ville: form.ville,
      pays: form.pays,
      adresse: form.adresse,
      description: form.description || null,
      wifiSsid: form.wifiSsid || null,
      wifiPassword: form.wifiPassword || null,
      keyboxPlace: form.keyboxPlace || null,
      keyboxCode: form.keyboxCode || null,
      proprietaireNom: form.proprietaireNom || null,
      proprietaireTel: form.proprietaireTel || null,
      proprietaireEmail: form.proprietaireEmail || null,
      equipements: form.equipements.length ? JSON.stringify(form.equipements) : null,
      videosExplicatives: form.videos.length ? JSON.stringify(form.videos) : null,
      regles: form.regles.length ? JSON.stringify(form.regles) : null,
    };

    // ✔ Utilisation du CODE → correct
    const url = editingId
      ? `/api/appartement/${form.code}`
      : `/api/appartement`;

    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.error || "Erreur");
      } else {
        if (editingId) {
          setList((prev) => prev.map((a) => (a.id === editingId ? data : a)));
          setMsg("Appartement modifié avec succès ✅");
        } else {
          setList((prev) => [data, ...prev]);
          setMsg("Appartement ajouté avec succès ✅");
        }
        resetForm();
      }
    } catch (err) {
      setMsg("Erreur réseau ❌");
    } finally {
      setLoading(false);
    }
  };

  // ❌ Supprimer via CODE
  const handleDelete = async (id: number) => {
    const apt = list.find((a) => a.id === id);
    if (!apt) return;

    if (!confirm("Supprimer cet appartement ?")) return;

    await fetch(`/api/appartement/${apt.code}`, {
      method: "DELETE",
    });

    setList((prev) => prev.filter((a) => a.id !== id));

    if (editingId === id) resetForm();
  };

  // 🌍 Ouvrir le public
  const handleOpenPublic = (apt: Appartement) => {
    window.open(`/appartement/${apt.code}`, "_blank");
  };

  return (
    <div className="space-y-5 text-black">

      <h2 className="text-lg font-semibold text-amber-700">
        Appartements 🏡
      </h2>

      {msg && (
        <div className="text-sm bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
          {msg}
        </div>
      )}

      {/* FORMULAIRE */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl shadow p-5 space-y-4 border border-amber-100"
      >

        {/* En-tête */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-amber-700">
            {editingId ? "✏ Modifier un appartement" : "➕ Ajouter un appartement"}
          </h3>
          {editingId && (
            <span className="text-[11px] text-gray-500">ID : {editingId}</span>
          )}
        </div>

        {/* Infos générales */}
        <div className="border p-4 rounded-2xl bg-amber-50/30 space-y-3">
          <h4 className="text-xs font-semibold text-amber-700">🏠 Informations générales</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              className="border rounded-lg px-3 py-2 text-sm bg-white"
              placeholder="Code (ex: HX-CASA-001)"
              value={form.code}
              onChange={(e) => handleChange("code", e.target.value)}
              required
            />
            <input
              className="border rounded-lg px-3 py-2 text-sm bg-white"
              placeholder="Nom de l'appartement"
              value={form.nom}
              onChange={(e) => handleChange("nom", e.target.value)}
              required
            />
            <input
              className="border rounded-lg px-3 py-2 text-sm bg-white"
              placeholder="Ville"
              value={form.ville}
              onChange={(e) => handleChange("ville", e.target.value)}
            />
            <input
              className="border rounded-lg px-3 py-2 text-sm bg-white"
              placeholder="Pays"
              value={form.pays}
              onChange={(e) => handleChange("pays", e.target.value)}
            />
            <input
              className="border rounded-lg px-3 py-2 text-sm bg-white col-span-full"
              placeholder="Adresse complète"
              value={form.adresse}
              onChange={(e) => handleChange("adresse", e.target.value)}
            />
          </div>

          <textarea
            className="border rounded-lg px-3 py-2 text-sm w-full bg-white"
            placeholder="Description"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        {/* SECTION ACCÈS */}
        <div className="border p-4 rounded-2xl bg-white space-y-3">
          <h4 className="text-xs font-semibold text-amber-700">🔐 Accès & Wi-Fi</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input className="border rounded-lg px-3 py-2 text-sm" placeholder="WiFi SSID" value={form.wifiSsid} onChange={(e) => handleChange("wifiSsid", e.target.value)} />
            <input className="border rounded-lg px-3 py-2 text-sm" placeholder="WiFi mot de passe" value={form.wifiPassword} onChange={(e) => handleChange("wifiPassword", e.target.value)} />
            <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Emplacement boîte à clés" value={form.keyboxPlace} onChange={(e) => handleChange("keyboxPlace", e.target.value)} />
            <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Code boîte à clés" value={form.keyboxCode} onChange={(e) => handleChange("keyboxCode", e.target.value)} />
          </div>
        </div>

        {/* ÉQUIPEMENTS */}
        <div className="border p-4 rounded-2xl bg-amber-50/40 space-y-3">
          <h4 className="text-xs font-semibold text-amber-700">🛠 Équipements</h4>
          <div className="flex gap-2">
            <input className="flex-1 border rounded-lg px-3 py-2 text-sm bg-white" placeholder='Ex: "Climatisation"' value={form.equipementInput} onChange={(e) => handleChange("equipementInput", e.target.value)} />
            <button type="button" onClick={addEquipement} className="px-3 py-2 text-xs bg-amber-600 text-white rounded-lg">Ajouter</button>
          </div>

          {form.equipements.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.equipements.map((eq, i) => (
                <span key={i} className="text-xs bg-white border border-amber-200 px-3 py-1 rounded-full flex items-center gap-2">
                  {eq}
                  <button className="text-red-500" onClick={() => removeEquipement(i)}>✕</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* VIDÉOS */}
        <div className="border p-4 rounded-2xl bg-white space-y-3">
          <h4 className="text-xs font-semibold text-amber-700">🎬 Vidéos explicatives</h4>

          <div className="grid grid-cols-1 sm:grid-cols-[2fr_1.3fr_auto] gap-2">
            <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Titre" value={form.videoTitle} onChange={(e) => handleChange("videoTitle", e.target.value)} />
            <input className="border rounded-lg px-3 py-2 text-sm" placeholder="YouTube ID" value={form.videoYoutubeId} onChange={(e) => handleChange("videoYoutubeId", e.target.value)} />
            <button type="button" onClick={addVideo} className="px-3 py-2 bg-amber-600 text-white text-xs rounded-lg">Ajouter</button>
          </div>

          {form.videos.length > 0 && (
            <div className="space-y-2">
              {form.videos.map((v, i) => (
                <div key={i} className="flex justify-between items-center bg-amber-50/60 border border-amber-100 px-3 py-2 rounded-lg">
                  <div>
                    <p className="font-semibold text-xs">{v.title}</p>
                    <p className="text-[11px] text-gray-600">YouTube ID : {v.youtubeId}</p>
                  </div>
                  <button className="text-red-500 text-xs" onClick={() => removeVideo(i)}>Supprimer</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RÈGLES */}
        <div className="border p-4 rounded-2xl bg-amber-50/30 space-y-3">
          <h4 className="text-xs font-semibold text-amber-700">📋 Règles de la maison</h4>
          <div className="flex gap-2">
            <input className="flex-1 border rounded-lg px-3 py-2 text-sm bg-white" placeholder="Ex: Pas de fumée" value={form.regleInput} onChange={(e) => handleChange("regleInput", e.target.value)} />
            <button type="button" onClick={addRegle} className="px-3 py-2 bg-amber-600 text-white text-xs rounded-lg">Ajouter</button>
          </div>

          {form.regles.length > 0 && (
            <ul className="space-y-1 text-xs">
              {form.regles.map((r, i) => (
                <li key={i} className="flex justify-between items-center bg-white border border-amber-100 px-3 py-1 rounded-lg">
                  <span>• {r}</span>
                  <button className="text-red-500 text-[11px]" onClick={() => removeRegle(i)}>Supprimer</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* PROPRIÉTAIRE */}
        <div className="border p-4 rounded-2xl bg-white space-y-3">
          <h4 className="text-xs font-semibold text-amber-700">📞 Contact propriétaire</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input className="border rounded-lg px-3 py-2 text-sm bg-amber-50/40" placeholder="Nom" value={form.proprietaireNom} onChange={(e) => handleChange("proprietaireNom", e.target.value)} />
            <input className="border rounded-lg px-3 py-2 text-sm bg-amber-50/40" placeholder="Téléphone" value={form.proprietaireTel} onChange={(e) => handleChange("proprietaireTel", e.target.value)} />
            <input className="border rounded-lg px-3 py-2 text-sm bg-amber-50/40" placeholder="Email" value={form.proprietaireEmail} onChange={(e) => handleChange("proprietaireEmail", e.target.value)} />
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-amber-600 text-white rounded-xl py-2 text-sm font-semibold">
          {loading ? "Enregistrement..." : editingId ? "💾 Modifier" : "Ajouter l'appartement"}
        </button>

        {editingId && (
          <button type="button" onClick={resetForm} className="w-full bg-gray-200 text-black rounded-xl py-2 text-sm font-semibold mt-2">
            Annuler l’édition
          </button>
        )}
      </form>

      {/* LISTE */}
      <div className="space-y-3">
        {list.length === 0 ? (
          <p className="text-sm text-gray-700">Aucun appartement pour le moment.</p>
        ) : (
          list.map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-2xl shadow p-3 flex gap-3 border cursor-pointer hover:bg-amber-50 transition"
              onClick={() => handleOpenPublic(apt)}
            >
              <div onClick={(e) => e.stopPropagation()}>
                {apt.imagePrincipale ? (
                  <img src={apt.imagePrincipale} className="w-16 h-16 rounded-lg object-cover" />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-xs">Aucune image</div>
                )}

                <label className="block mt-1 text-xs text-amber-600 underline cursor-pointer">
                  <input type="file" className="hidden" accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleUpload(apt.id, e.target.files[0]);
                    }}
                  />
                  Modifier image
                </label>
              </div>

              <div className="flex-1 text-sm">
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">
                      {apt.nom} <span className="text-xs text-gray-600">({apt.code})</span>
                    </p>
                    <p className="text-xs text-gray-700">{apt.ville}, {apt.pays}</p>
                  </div>

                  <div onClick={(e) => e.stopPropagation()} className="flex flex-col items-end gap-1">
                    <button className="text-xs text-blue-600" onClick={() => handleEdit(apt)}>Modifier</button>
                    <button className="text-xs text-red-500" onClick={() => handleDelete(apt.id)}>Supprimer</button>
                  </div>
                </div>

                <p className="text-xs mt-1 text-gray-700 line-clamp-2">
                  {apt.description || "Pas de description."}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

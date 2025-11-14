import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadUrl = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD}/image/upload`;

    const cloudForm = new FormData();
    cloudForm.append("file", new Blob([buffer]));
    cloudForm.append("upload_preset", process.env.CLOUDINARY_PRESET!);

    const uploadRes = await fetch(uploadUrl, {
      method: "POST",
      body: cloudForm,
    });

    const data = await uploadRes.json();

    return NextResponse.json({ url: data.secure_url });
  } catch (error) {
    console.error("Erreur upload:", error);
    return NextResponse.json({ error: "Erreur upload" }, { status: 500 });
  }
}

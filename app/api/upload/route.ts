import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

export const runtime = "nodejs"; // Permet d'utiliser fs

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = `${randomUUID()}-${file.name.replace(/\s/g, "_")}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, buffer);

    const fileUrl = `/uploads/${fileName}`;
    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error("Erreur upload :", error);
    return NextResponse.json({ error: "Erreur lors de l’upload" }, { status: 500 });
  }
}

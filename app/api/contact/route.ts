import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }
    // TODO: configurer Resend pour l'envoi d'emails
    console.log("Nouveau message:", data);
    return NextResponse.json({ message: "Message reçu" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

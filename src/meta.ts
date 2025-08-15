import fs from "fs";
import path from "path";


export async function publishToMeta(
  imagePath: string,
  caption: string,
  pageId: string,
  accessToken: string
): Promise<{ status: string; message: string }> {
  try {
    console.log("imagePath recibido:", imagePath);
    console.log("Existe archivo?", fs.existsSync(imagePath));


    const fileBuffer = fs.readFileSync(imagePath);
    const blob = new Blob([fileBuffer], { type: "image/jpeg" });

    const url = `https://graph.facebook.com/${pageId}/photos`;
    const form = new FormData();
    form.append("caption", caption);
    form.append("access_token", accessToken);
    form.append("source", blob, "foto.jpg");


    const res = await fetch(url, { method: "POST", body: form });
    const data: any = await res.json();

    if (data.id) {
      console.log("Publicado en Meta con ID:", data.id);
      return { status: "OK", message: JSON.stringify(data, null, 2) };
    } else {
      console.error("Error publicando en Meta:", data);
      return { status: "ERROR", message: JSON.stringify(data.error, null, 2) };
    }
  } catch (err: any) {
    console.error("Error en publishToMeta:", err);
    return { status: "FALLO", message: JSON.stringify(err, null, 2) };
  }
}

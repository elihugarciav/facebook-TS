import fetch from "node-fetch";
import FormData from "form-data";
import fs from "fs";

export async function publishToMeta(
  imagePath: string,
  caption: string,
  pageId: string,
  accessToken: string
): Promise<boolean> {
  try {
    const url = `https://graph.facebook.com/${pageId}/photos`;
    const form = new FormData();
    form.append("caption", caption);
    form.append("access_token", accessToken);
    form.append("source", fs.createReadStream(imagePath));

    const res: any = await fetch(url, { method: "POST", body: form });
    const data: any = await res.json();

    if (data.id) {
      console.log("Publicado en Meta con ID:", data.id);
      return true;
    } else {
      console.error("Error publicando en Meta:", data);
      return false;
    }
  } catch (err) {
    console.error("Error en publishToMeta:", err);
    return false;
  }
}

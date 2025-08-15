import "dotenv/config";
import path from "path";
import { getFirstImage, moveFile } from "./archivos";
import { describeImage } from "./gemini";
import { publishToMeta } from "./meta";

const imagenes_entrada = process.env.imagenes_entrada!;
const imagenes_procesadas = process.env.imagenes_procesadas!;
const imagenes_erroneas = process.env.imagenes_erroneas!;
const google_api_key = process.env.google_api_key!;
const google_model = process.env.modelo_gemini!;
const meta_token_acceso = process.env.meta_token_acceso!;
const meta_id_pagina = process.env.meta_id_pagina!;

// Agregamos un parámetro opcional onLog
export async function main(
  onLog?: (log: { status: string; message: string }) => void
): Promise<{ status: string; message: string }> {
  
  function log(status: string, message: string) {
    console.log(message);
    if (onLog) onLog({ status, message });
  }

  log("INFO", "Buscando imágenes...");
  const imagePath = getFirstImage(imagenes_entrada);

  if (!imagePath) {
    const msg = "No hay imágenes para procesar.";
    console.log(msg)
    return { status: "empty", message: msg };
  }

  log("INFO", `Imagen encontrada: ${imagePath}`);

  try {
    log("INFO", "Obteniendo descripción desde Gemini...");
    const description: any = await describeImage(imagePath, google_api_key, google_model);

    if (description.status === "OK") {
      log("OK", `Descripción: ${description.message}`);
    } else {
      console.log(description.status, description.message);
      return { status: description.status, message: description.message };
    }

    log("INFO", "Publicando en Meta...");
    const success: any = await publishToMeta(imagePath, description.message, meta_id_pagina, meta_token_acceso);

    if (success.status === "OK") {
      moveFile(imagePath, imagenes_procesadas);
      console.log(success.status, success.message);
      return { status: success.status, message: success.message };
    } else {
      moveFile(imagePath, imagenes_erroneas);
      console.log(success.status, success.message);
      return { status: success.status, message: success.message };
    }

  } catch (err: any) {
    log("FALLO", `Error procesando la imagen: ${err}`);
    moveFile(imagePath, imagenes_erroneas);
    return { status: "FALLO", message: String(err) };
  }
}

// Para que funcione standalone (opcional)
if (require.main === module) {
  main();
}

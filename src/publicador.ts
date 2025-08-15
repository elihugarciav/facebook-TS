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

async function main() {
  console.log("Buscando imágenes...");
  const imagePath = getFirstImage(imagenes_entrada);

  if (!imagePath) {
    console.log("No hay imágenes para procesar.");
    return;
  }

  console.log("Imagen encontrada:", imagePath);

  try {
    console.log("Obteniendo descripción desde Gemini...");
    const description: any = await describeImage(imagePath, google_api_key, google_model);
    console.log("Descripción:", description);

    console.log("Publicando en Meta...");
    const success: any = await publishToMeta(imagePath, description, meta_id_pagina, meta_token_acceso);

    if (success) {
      moveFile(imagePath, imagenes_procesadas);
    } else {
      moveFile(imagePath, imagenes_erroneas);
    }
  } catch (err) {
    console.error("Error procesando la imagen:", err);
    moveFile(imagePath, imagenes_erroneas);
  }
}

main();

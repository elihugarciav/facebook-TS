import fs from "fs-extra";
import path from "path";

export function getFirstImage(dir: string): string | null {
  const files = fs.readdirSync(dir).filter((f : string) => /\.(jpg|png|jpeg)$/i.test(f));
  return files.length > 0 ? path.join(dir, files[0]) : null;
}

export function moveFile(src: string, destDir: string) {
  fs.ensureDirSync(destDir);
  const destPath = path.join(destDir, path.basename(src));
  fs.moveSync(src, destPath, { overwrite: true });
}

export function leerArchivoComoTexto(ruta: string): string {
  try {
    const contenido = fs.readFileSync(ruta, "utf-8"); // lee el archivo como UTF-8
    return contenido;
  } catch (err) {
    console.error("Error leyendo el archivo:", err);
    return "Error al leer el prompt";
  }
}
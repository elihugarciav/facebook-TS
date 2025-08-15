import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import { leerArchivoComoTexto } from "./archivos";

export async function describeImage(imagePath: string, apiKey: string, AIModel: string): Promise<{ status: string; message: string }> {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: AIModel });

    const imageData = fs.readFileSync(imagePath);
    const result = await model.generateContent([
      { inlineData: { data: imageData.toString("base64"), mimeType: "image/jpeg" } },
      leerArchivoComoTexto("/app/recursos/prompt.txt")
    ]);

    return {
      status: "OK",
      message: result.response.text()
    };
  } catch (err: any) {
    console.error("Error procesando la imagen:", err);

    // Maneja casos donde err.errorDetails o err.message podrían ser undefined
    const errorMessage =
      err.message ||
      (err.errorDetails ? JSON.stringify(err.errorDetails, null, 2) : "Error desconocido de GoogleGenerativeAI");

    return {
      status: "ERROR",
      message: errorMessage
    };
  }
}

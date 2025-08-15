import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import {leerArchivoComoTexto} from "./archivos";

export async function describeImage(imagePath: string, apiKey: string, AIModel: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: AIModel });

  const imageData = fs.readFileSync(imagePath);
  const result = await model.generateContent([
    { inlineData: { data: imageData.toString("base64"), mimeType: "image/jpeg" } },
    leerArchivoComoTexto("/app/recursos/prompt.txt")
  ]);

  return result.response.text();
}

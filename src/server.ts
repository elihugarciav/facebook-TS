import express from "express";
import path from "path";
import { main as runPublicador } from "./publicador";

const app = express();
const PORT = 3000;

// Servir HTML y archivos estáticos
app.use(express.static(path.join(__dirname)));
app.use("/public", express.static(path.join(__dirname, "public")));

// Endpoint para disparar publicador desde el navegador
app.post("/run-worker", async (req, res) => {
  try {
    const result = await runPublicador(); // { status, message }
    res.json(result);                     // enviar directamente al frontend
  } catch (err: any) {
    console.error("Error ejecutando publicador:", err);
    res.status(500).json({ status: "FALLO", message: err.message || String(err) });
  }
});

// Servir index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));

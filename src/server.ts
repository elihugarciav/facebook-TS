import express from "express";
import path from "path";
import { spawn } from "child_process";

const app = express();
const PORT = 3000;

// Servir HTML y public/ estático
app.use(express.static(path.join(__dirname)));
app.use("/public", express.static(path.join(__dirname, "public")));

// Función para ejecutar publicador.ts o .js
function runPublicador() {
  // Determinar archivo según entorno
  const isDev = __dirname.includes("src");
  const filePath = isDev
    ? path.join(__dirname, "publicador.ts")
    : path.join(__dirname, "publicador.js");

  const command = isDev ? "ts-node" : "node";

  const child = spawn(command, [filePath], {
    stdio: "inherit",
    env: process.env
  });

  child.on("exit", (code) => {
    console.log("Publicador terminó con código:", code);
  });
}

// Endpoint para disparar publicador desde el navegador
app.post("/run-worker", async(req, res) => {
  const result = await runPublicador();
  res.send({ result });
});

// Servir index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));

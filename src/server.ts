import express from "express";
import path from "path";
import { main as runPublicador } from "./publicador";

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname)));
app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/run-worker-stream", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  function sendMessage(data: any) {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }

  function sendEnd() {
    res.write(`event: end\ndata: {}\n\n`);
    res.end();
  }

  try {
    // Pasamos callback para logs intermedios
    const result = await runPublicador((log: { status: string; message: string }) => {
      sendMessage(log);
    });

    sendMessage(result); // mensaje final
    sendEnd();           // señal de fin
  } catch (err: any) {
    sendMessage({ status: "FALLO", message: err.message || String(err) });
    sendEnd();
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));

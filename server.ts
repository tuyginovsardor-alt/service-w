import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// @ts-ignore
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON parsing middleware
  app.use(express.json());

  // API Route for AI assistance or dynamic content
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history = [] } = req.body;
      
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Gemini API key not configured" });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: `System Instruction: You are the Wentric AI, the professional digital representative of Wentric Company. 
              Mission: "Building the Future with Innovation & AI".
              Tone: Corporate, visionary, helpful.
              Ecosystem: Codeusta (IT), IntelektAI (AI), Vibogram (Social), Paynest (FinTech), MakerPay (Payments).
              Special Instructions: If you cannot solve a problem or the user asks for human support, tell them to type "SUPPORT" or click the support button to talk to an admin.
              Direct link for support: https://t.me/wentricsupport` }]
          },
          ...history,
          { role: "user", parts: [{ text: message }] }
        ]
      });

      res.json({ text: response.text });
    } catch (error) {
      console.error("AI service error:", error);
      res.status(500).json({ error: "Failed to communicate with AI service" });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", company: "Wentric" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Wentric Server running on http://localhost:${PORT}`);
  });
}

startServer();

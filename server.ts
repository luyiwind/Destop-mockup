import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase payload limit to handle base64 images
  app.use(express.json({ limit: '50mb' }));

  // API route to analyze image and estimate 3D transform
  app.post("/api/analyze-image", async (req, res) => {
    try {
      const { image, imageUrl, width, height } = req.body;
      
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not set." });
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const prompt = `Analyze this image which contains a desk setup with a phone or tablet mockup screen.
      The image dimensions are ${width}x${height}.
      Estimate the 3D transform parameters needed to overlay a virtual rectangular screen onto the device mockup screen in the image.
      Provide the following parameters in a valid JSON object:
      {
        "tx": number (X translation of the screen center relative to the image center in pixels),
        "ty": number (Y translation of the screen center relative to the image center in pixels),
        "rx": number (X rotation / pitch in degrees, usually positive if leaning back),
        "ry": number (Y rotation / yaw in degrees, positive if turned to the right),
        "rz": number (Z rotation / roll in degrees, positive if tilted clockwise),
        "width": number (width of the screen in pixels),
        "height": number (height of the screen in pixels)
      }
      Only return the JSON object, do not add markdown formatting or comments.`;

      let parts = [{ text: prompt }];

      if (image) {
        // base64
        const base64Data = image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");
        parts.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Data
          }
        } as any);
      } else if (imageUrl) {
         try {
            const fetchRes = await fetch(imageUrl);
            if (!fetchRes.ok) throw new Error("Failed to fetch image url");
            const arrayBuffer = await fetchRes.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const mimeType = fetchRes.headers.get("content-type") || "image/jpeg";
            
            parts.push({
              inlineData: {
                mimeType: mimeType,
                data: buffer.toString("base64")
              }
            } as any);
         } catch (e) {
            console.error("Error fetching image URL:", e);
            return res.status(400).json({ error: "Failed to download image from URL." });
         }
      } else {
        return res.status(400).json({ error: "No image provided." });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: parts
          }
        ],
        config: {
          responseMimeType: "application/json"
        }
      });

      const text = response.text;
      if (text) {
          res.json(JSON.parse(text));
      } else {
          res.status(500).json({ error: "No response from AI." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to analyze image." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();

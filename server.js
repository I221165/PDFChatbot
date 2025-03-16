import express from "express";
import dotenv from "dotenv";
import multer from "multer";
import axios from "axios";
import cors from "cors";
import fs from "fs";
import pdfParse from "pdf-parse";
import { ChromaClient } from "chromadb";

dotenv.config();

const app = express();
const PORT = 5050;
app.use(cors());
app.use(express.json());

// Multer configuration for storing uploaded PDFs
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });

// Load environment variable for API key
const API_KEY = process.env.GROQ_API_KEY;

// Initialize ChromaDB
let collection;
async function initChroma() {
  try {
    const chroma = new ChromaClient({ path: "http://localhost:8000" });
    collection = await chroma.getOrCreateCollection({ name: "pdf-data" });
    console.log("✅ ChromaDB Collection Ready");
  } catch (error) {
    console.error("❌ ChromaDB Connection Failed:", error);
    process.exit(1);
  }
}
initChroma();

// 📂 Upload and Process PDF
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    console.log("File received:", req.file.originalname);

    // Read file as a buffer (fixing previous issue)
    const pdfBuffer = fs.readFileSync(req.file.path);
    const data = await pdfParse(pdfBuffer);

    console.log("PDF text extracted:", data.text.substring(0, 100)); // Show first 100 characters

    // Store extracted text in ChromaDB
    await collection.add({ ids: [req.file.filename], documents: [data.text] });

    res.json({ message: "PDF processed successfully", text: data.text });
  } catch (error) {
    console.error("Error processing PDF:", error);
    res.status(500).json({ error: "Failed to process PDF" });
  }
});

// 📝 Query the PDF
app.post("/query", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "No question provided" });

    const searchResults = await collection.query({
      queryTexts: [question],
      nResults: 3,
    });

    const relevantText = searchResults.documents.flat().join(" ");
    if (!relevantText) return res.json({ answer: "None" });

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: `Answer using only this content: ${relevantText}` },
          { role: "user", content: question },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ answer: response.data.choices[0].message.content });
  } catch (error) {
    console.error("Error querying PDF:", error);
    res.status(500).json({ error: "Failed to query PDF" });
  }
});

// Start the server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

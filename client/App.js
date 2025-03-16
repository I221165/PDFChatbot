import React, { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");

  // 📂 Handle File Selection
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // ⬆️ Upload Selected PDF File
  const uploadFile = async () => {
    if (!file) {
      alert("Please select a PDF file!");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.post("http://localhost:5050/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("PDF uploaded and processed successfully!");
    } catch (error) {
      console.error("Error uploading PDF:", error.response?.data || error.message);
    }
  };

  // 📝 Send Query to LLM
  const handleQuery = async () => {
    if (!question) {
      alert("Please enter a question!");
      return;
    }
    try {
      const res = await axios.post("http://localhost:5050/query", { question });
      setResponse(res.data.answer);
    } catch (error) {
      console.error("Error querying LLM:", error.response?.data || error.message);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h3>Upload a PDF</h3>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={uploadFile} disabled={!file} style={{ marginLeft: "10px" }}>Upload</button>
      
      <h3 style={{ marginTop: "20px" }}>Ask a Question</h3>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask something about the uploaded document..."
        rows="4"
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />
      <button onClick={handleQuery}>Ask</button>
      
      <p><strong>Response:</strong> {response}</p>
    </div>
  );
}

export default App;

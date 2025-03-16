# PDF Parser Chatbot

This project is a **PDF-based chatbot** that allows users to upload PDFs, extract text, and query the extracted content using **Groq API** and **ChromaDB**.

## 🚀 Features
- **Upload PDFs** and extract text
- **Store extracted text** in ChromaDB
- **Query** the extracted content using AI

## 🛠️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/pdf-parser-chatbot.git
cd pdf-parser-chatbot
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Setup Environment Variables
Create a `.env` file in the root directory and add:
```env
GROQ_API_KEY=your_api_key
```

### 4️⃣ Run the Server
```bash
node server.js
```

The server will start on **http://localhost:5050**

## 📝 API Endpoints
### 📂 Upload PDF
**POST** `/upload`
- Uploads a PDF and extracts text
- **Request:** `multipart/form-data`
- **Key:** `file` (attach your PDF)

### 🔍 Query PDF Content
**POST** `/query`
- **Body (JSON):** `{ "question": "Your query" }`
- Retrieves relevant answers based on extracted text

## 📌 Technologies Used
- **Node.js & Express.js** - Backend
- **Multer** - File handling
- **pdf-parse** - PDF processing
- **ChromaDB** - Vector storage
- **Groq API** - AI-powered responses

## 🛠️ Future Enhancements
- Add frontend UI
- Improve AI responses
- Support multiple file formats

---
### 📧 Contact
For any issues, feel free to open an **issue** or **contribute** to the project!


// server.js
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// ✅ Multiple files upload
app.post("/upload", upload.array("files", 10), (req, res) => {
  if (!req.files?.length) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  const fileInfos = req.files.map((file) => ({
    filename: file.originalname,
    url: `http://localhost:${PORT}/uploads/${file.filename}`,
  }));

  res.json({ message: "Files uploaded successfully!", files: fileInfos });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

require('dotenv').config();
const express = require('express');
const path = require("path");
const fs = require("fs");
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const departmentRoutes = require('./routes/departmentRoutes.js');
const userRoutes = require('./routes/usersRoute.js');
const studentRoutes = require('./routes/studentRoutes.js');
const professorRoutes = require('./routes/professorRoutes.js');

const app = express();

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors({
    origin: CLIENT_ORIGIN,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/files/:filename", (req, res) => {
  const filename = req.params.filename;

  if (filename.includes("..")) {
    return res.status(400).send("Invalid file name");
  }

  const filePath = path.join(__dirname, "uploads", filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File not found");
  }

  res.sendFile(filePath, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline"
    }
  });
});

mongoose.connect(MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.use('/auth', authRoutes);
app.use('/admin',adminRoutes, departmentRoutes, userRoutes);
app.use('/student', studentRoutes);
app.use('/professor', professorRoutes);

app.listen(PORT, () => {
    console.log(`server connected on port ${PORT}`);
    console.log("DIR:", __dirname);
});
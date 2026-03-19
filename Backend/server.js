require('dotenv').config();

// Fail-fast environment variable validation
const requiredEnv = [
  'PORT', 
  'MONGO_URI', 
  'CLIENT_ORIGIN', 
  'JWT_SECRET', 
  'CLOUDINARY_CLOUD_NAME', 
  'CLOUDINARY_API_KEY', 
  'CLOUDINARY_API_SECRET'
];

const missingEnv = requiredEnv.filter(envVar => !process.env[envVar]);
if (missingEnv.length > 0) {
    console.error(`❌ FATAL ERROR: Missing required environment variables: ${missingEnv.join(', ')}`);
    process.exit(1); // Fail immediately and prevent the server from booting in a zombie state
}

const express = require('express');
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
app.set('trust proxy', 1);

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;

app.use(cors({
  origin: CLIENT_ORIGIN,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const { loginLimiter } = require('./middleware/rateLimiter.js');
app.use('/auth/login', loginLimiter);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/admin', departmentRoutes);
app.use('/admin', userRoutes);
app.use('/student', studentRoutes);
app.use('/professor', professorRoutes);

const AppError = require('./utils/appError.js');
const globalErrorHandler = require('./controllers/errorController.js');

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`server connected on port ${PORT}`);
  console.log("DIR:", __dirname);
});
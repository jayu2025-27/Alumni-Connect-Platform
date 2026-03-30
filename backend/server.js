const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const { initSocket } = require('./socket/socket');
const AuthRouter = require('./Routes/AuthRouter');
const AuthAlumniRouter = require('./Routes/AuthAlumniRoutes');
const uploadRoute = require('./Routes/routeUpload');
const eventRouter = require('./Routes/eventRoutes');
const messageRoutes = require('./Routes/messageRoutes');
const userRoutes = require('./Routes/userRoutes');
const connectCloudinary = require('./utils/cloudinary');
const AdminRoutes = require('./Routes/AdminRoutes');
const JobRoutes = require('./Routes/JobRoutes');
const MentorshipRoutes = require('./Routes/MentorshipRoutes');
const { sequelize, testConnection } = require('./Models/db');

require('dotenv').config();

// Connect Cloudinary
connectCloudinary();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Middleware
app.use(bodyParser.json());

const allowedOrigins = [
  'http://localhost:5173',
  'https://frontend-rouge-xi-59.vercel.app' // Vercel production link
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Routes
app.get('/', (req, res) => {
  res.send('Alumni Connect Backend is Running');
});

app.use('/auth', AuthRouter);
app.use('/api/alumni', AuthAlumniRouter);
app.use('/api/student/upload', uploadRoute);
app.use('/api/alumni/upload', uploadRoute);
app.use('/api/events', eventRouter);
app.use('/api/messages', messageRoutes);
app.use('/api/user', userRoutes);
app.use('/admin', AdminRoutes);
app.use('/api/jobs', JobRoutes);
app.use('/api/mentorships', MentorshipRoutes);

const PORT = process.env.PORT || 8080;

// Start Server
const startServer = async () => {
  try {
    console.log('Initializing backend...');

    // 1. Authenticate DB connection
    await testConnection();

    // 2. Sync Models with DB (safe sync)
    await sequelize.sync({ alter: false });
    console.log('✅ Database tables synced successfully.');

    // 3. Start Listener
    server.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error('❌ CRITICAL ERROR: Failed to start server.');
    console.error('Reason:', error.message);
    console.error('Please check your database credentials in backend/.env');
    process.exit(1);
  }
};

startServer();

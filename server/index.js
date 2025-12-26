import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import analyzeRoute from "./routes/analyze.js";
import authRoute from "./routes/auth.js";
import issueRoute from "./routes/issue.js";
import { connectDB } from "./utils/db.js";
import patternsRoute from "./routes/patterns.js";
// import { startWeeklyReminder } from "./cron/weeklyRemainder.js";




// Load from root .env file  
dotenv.config({ path: '../.env' });

const app = express();

console.log("Starting Mistaker Interview Diagnostic Server...");

// Middlewares
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:5500"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

app.use("/api/patterns", patternsRoute);

// startWeeklyReminder();

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/analyze", analyzeRoute);
app.use("/api/auth", authRoute);
app.use("/api/issues", issueRoute);

// Health check
app.get("/", (req, res) => {
  console.log("Health check requested");
  res.json({ 
    message: "Interview Diagnostic API running",
    timestamp: new Date().toISOString(),
    status: "healthy"
  });
});

// Error handling
app.use((error, req, res, next) => {
  console.error("Server error:", error.message);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
    await connectDB();
    
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`📡 Health check: http://localhost:${PORT}`);
      console.log(`API endpoint: http://localhost:${PORT}/api/analyze`);
    });
    
    server.on('error', (error) => {
      console.error('Server error:', error.message);
    });
    
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

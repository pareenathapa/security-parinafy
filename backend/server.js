import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import session from "express-session";
import rateLimit from "express-rate-limit";
import * as path from 'path';
import * as fs from 'fs';
import morgan from "morgan";
import helmet from "helmet";

// INFO: Create express app
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// INFO: Middleware
app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(helmet());

// Session
// Middleware: Session Configuration
app.use(
  session({
    secret: "your_secret_key", // Change this to a strong secret key
    resave: false, // Prevents resaving unchanged sessions
    saveUninitialized: false, // Don't save empty sessions
    cookie: {
      secure: false, // Set to `true` if using HTTPS
      httpOnly: true, // Helps prevent XSS attacks
      maxAge: 1000 * 60 * 60 * 24, // 1 day expiration
    },
  })
);



// Define Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  headers: true, // Sends `RateLimit-*` headers
});

// Apply rate limiter to all requests
app.use(limiter);

// Ensure the audit directory exists
const auditLogDir = path.join(process.cwd(), 'audit');
if (!fs.existsSync(auditLogDir)) {
  fs.mkdirSync(auditLogDir);
}
 
// Create a write stream for logs
const logStream = fs.createWriteStream(path.join(auditLogDir, 'parina.log'), { flags: 'a' });
 
// Custom format with timestamp
morgan.token('timestamp', () => new Date().toISOString());
 
const logFormat = '[:timestamp] :method :url :status :response-time ms';
 
// Use Morgan with custom format
app.use(morgan(logFormat, { stream: logStream }));

// INFO: API endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);

// INFO: Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// INFO: Start server
app.listen(port, '0.0.0.0', () =>
  console.log(`Server is running on at http://localhost:${port}`)
);

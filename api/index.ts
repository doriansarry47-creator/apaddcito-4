// api/index.ts - Vercel Serverless Function Entry Point
import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import memorystore from "memorystore";
import { registerRoutes } from "../server/routes.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ✅ N'exige SESSION_SECRET qu'en production
if (process.env.NODE_ENV === "production" && !process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET must be set in production");
}

const MemoryStore = memorystore(session);
app.use(
  session({
    store: new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    }),
    // ✅ utilise dev-secret par défaut si SESSION_SECRET est absent
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // HTTPS only en prod
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 semaine
      sameSite: "lax",
    },
  }),
);

// Simple logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
  });

  next();
});

// Register API routes
registerRoutes(app);

// ✅ Route de test
app.get("/", (req, res) => {
  res.send("✅ API is running!");
});

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error(err);
  res.status(status).json({ message });
});
app.get("/ping", (req, res) => {
  res.json({ message: "pong 🏓" });
});


export default app;

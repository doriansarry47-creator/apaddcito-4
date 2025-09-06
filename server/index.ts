import "dotenv/config"; // <-- charge .env
import express from "express";
import session from "express-session";
import { registerRoutes } from "./routes.js";

const app = express();

app.use(express.json()); // ✅ obligatoire pour parser le body JSON
app.use(session({
  secret: process.env.SESSION_SECRET || "fallback-secret",
  resave: false,
  saveUninitialized: false,
}));

registerRoutes(app);

app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
  console.log("📦 DATABASE_URL:", process.env.DATABASE_URL); // debug
});

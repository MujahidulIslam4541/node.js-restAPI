import express, {
  type Application,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import config from "./config";
import { userRouter } from "./modules/users/users.routes";
import { profileRouter } from "./modules/profiels/profiles.routes";
import { authRouter } from "./modules/auth/auth.routes";

const app: Application = express();

// ── ES Module __dirname fix ──────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Log directory setup ──────────────────────────────────────
const logDir = path.join(__dirname, "logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

// ── Middleware ───────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Logger Middleware ────────────────────────────────────────
app.use((req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  res.on("finish", () => {
    const log = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      status: res.statusCode,
      responseTime: `${Date.now() - startTime}ms`,
    };

    console.log(log);

    const logFile = path.join(logDir, `${log.timestamp.split("T")[0]}.json`);
    fs.appendFileSync(logFile, JSON.stringify(log) + "\n");
  });

  next();
});

// ── Routes ───────────────────────────────────────────────────
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ message: "Server is running" });
});

app.use("/api/users", userRouter);
app.use("/api/profile", profileRouter);
app.use("/api/auth", authRouter);

export default app;
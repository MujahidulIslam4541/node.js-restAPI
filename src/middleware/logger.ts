import type { NextFunction, Request, Response } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ── ES Module __dirname fix ──────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Log directory setup ──────────────────────────────────────
const logDir = path.join(__dirname, "logs");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logger = (req: Request, res: Response, next: NextFunction) => {
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

    let logs = [];
    if (fs.existsSync(logFile)) {
      const fileData = fs.readFileSync(logFile, "utf-8");

      if (fileData) {
        logs = JSON.parse(fileData);
      }
    }
    logs.push(log);
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
  });

  next();
};

export default logger;

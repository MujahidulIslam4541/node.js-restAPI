import express, {
  type Application,
  type Request,
  type Response,
} from "express";

import { userRouter } from "./modules/users/users.routes";
import { profileRouter } from "./modules/profiels/profiles.routes";
import { authRouter } from "./modules/auth/auth.routes";
import logger from "./middleware/logger";

const app: Application = express();


// ── Middleware ───────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ message: "Server is running" });
});

app.use("/api/users", userRouter);
app.use("/api/profile", profileRouter);
app.use("/api/auth", authRouter);

export default app;
import express, {
  type Application,
  type Request,
  type Response,
} from "express";
const app: Application = express();
const port = config.port;
import config from "./config";
import { userRouter } from "./modules/users/users.routes";
import { profileRouter } from "./modules/profiels/profiles.routes";

app.use(express.json());



app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server is running" });
});


app.use('/api/users', userRouter);
app.use('/api/profile', profileRouter);





export default app;
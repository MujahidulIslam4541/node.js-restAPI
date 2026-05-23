import express, {
  type Application,
  type Request,
  type Response,
} from "express";
const app: Application = express();
const port = 5000;
import { Pool } from "pg";

app.use(express.json());

// connect pool pg

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_GDmo6CadlE3w@ep-red-shadow-aonbyxs4.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

const initDB = async () => {
  try {
    const test = await pool.query("SELECT NOW()");
    console.log("✅ DB connected:", test.rows[0].now);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        age INT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log("✅ Table ready");
  } catch (error: any) {
    console.error("❌ Full error:", error); 
  }
};

initDB();

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server is running" });
});

app.post("/", async (req: Request, res: Response) => {
  const body = req.body;
  console.log(body);
  res.status(201).json({
    message: "Data created  successful",
    data: body,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

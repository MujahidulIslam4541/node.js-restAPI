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
    // console.log("✅ DB connected:", test.rows[0].now);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        age INT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log("✅  Database connected successful");
  } catch (error: any) {
    console.error("❌ Full error:", error);
  }
};

initDB();

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server is running" });
});

app.post("/api/users", async (req: Request, res: Response) => {
  const { name, email, password, age } = req.body;

  try {
    const result = await pool.query(
      `
    INSERT INTO users(name,email,password,age)VALUES($1,$2,$3,$4)RETURNING *
    `,
      [name, email, password, age],
    );

    res.status(201).json({
      message: "Data created  successful",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      error: error,
    });
  }
});

// get all users from db
app.get("/api/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `
      SELECT * FROM users
      `,
    );

    res.status(200).json({
      message: "users receive successful",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
      error: error,
    });
  }
});

// get single user from db
app.get("/api/users/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const result = await pool.query(
      `
      SELECT * FROM users WHERE id=$1
      `,
      [id],
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    res.status(200).json({
      message: "user receive successful",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      error: error,
    });
  }
});

app.put('/api/users/:id',async(req:Request,res:Response)=>{
  const id=req.params.id;
  try {
    
  } catch (error:any) {
    res.status(500).json({
      message:error.message
    })
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

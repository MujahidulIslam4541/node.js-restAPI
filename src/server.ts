import express, {
  type Application,
  type Request,
  type Response,
} from "express";
const app: Application = express();
const port = config.port;
import { Pool } from "pg";
import config from "./config";

app.use(express.json());

// connect pool pg

const pool = new Pool({
  connectionString:config.connection_string
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

app.put("/api/users/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const { name, password, age } = req.body;
  try {
    const result = await pool.query(
      `
      UPDATE users SET 
      name=COALESCE($1 ,name),
      password=COALESCE($2 ,password),
      age=COALESCE($3 ,age)
      WHERE id=$4 RETURNING *

      `,
      [name, password, age, id],
    );
    if (result.rows.length === 0) {
      res.status(404).json({
        message: "user not found",
        data: result.rows[0],
      });
    }

    res.status(200).json({
      message: "user updated",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      error: error,
    });
  }
});

app.delete("/api/users/:id", async (req: Request, res: Response) => {
  const {id} = req.params;

  try {
    const result = await pool.query(
      `
      DELETE  FROM users WHERE  id=$1

      `,
      [id],
    );

    if (result.rowCount=== 0) {
      res.status(404).json({
        message: "user not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "user deleted success",
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      error: error,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

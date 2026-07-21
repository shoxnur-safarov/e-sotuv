import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || "e_sotuv",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_HOST === "localhost" ? false : { rejectUnauthorized: false },
});

pool.connect((err) => {
  if (err) {
    console.error("PostgreSQL ulanish xatosi:", err.message);
  } else {
    console.log("PostgreSQL ga muvaffaqiyatli ulandi ✅");
  }
});

export default pool;
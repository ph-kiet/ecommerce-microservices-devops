import express from "express";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const app = express();
app.use(express.json());

const pgPool = new Pool({ connectionString: process.env.PG_URL }); // RDS Postgresql Connection

// Product Search Endpoint
app.get("/products", async (req, res) => {
  const search = req.query.search || "";

  let query = `SELECT * FROM products WHERE name ILIKE $1`;

  if (!search) {
    query += ` LIMIT 10;`;
  }

  const { rows } = await pgPool.query(query, [`%${search}%`]);

  res.json(rows);
});

app.listen(3001, () => console.log("Product service on 3001"));

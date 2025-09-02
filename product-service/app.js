import express from "express";
import { Pool } from "pg";
import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const app = express();
app.use(express.json());

const pgPool = new Pool({ connectionString: process.env.PG_URL }); // RDS Postgresql Connection
// const redisClient = Redis.createClient({ url: process.env.REDIS_URL }); // Elasticache Redis Connection
const redisClient = new Redis.Cluster(
  [{ host: process.env.REDIS_ENDPOINT, port: 6379 }],
  {
    dnsLookup: (address, callback) => callback(null, address),
    redisOptions: {
      tls: {},
    },
  }
);

redisClient.connect();

// Product Search Endpoint
app.get("/products", async (req, res) => {
  const search = req.query.search || "";
  const cacheKey = `products:${search}`;

  // Get in cache first
  let products = await redisClient.get(cacheKey);
  if (products) return res.json(JSON.parse(products));

  // Query products in DB if cache is empty
  let query = `SELECT * FROM products WHERE name ILIKE $1`;

  if (!search) {
    query += ` LIMIT 10;`;
  }

  const { rows } = await pgPool.query(query, [`%${search}%`]);

  // Cache products for 1 hour
  if (rows.length > 0)
    await redisClient.set(cacheKey, JSON.stringify(rows), { EX: 3600 });

  res.json(rows);
});

app.listen(3001, () => console.log("Product service on 3001"));

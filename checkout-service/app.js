import express from "express";
import { Pool } from "pg";
import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const app = express();
app.use(express.json());

const pgPool = new Pool({ connectionString: process.env.PG_URL });
AWS.config.update({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const ses = new AWS.SES();

// Endpoint: Checkout
app.post("/checkout", async (req, res) => {
  const { email, items, total } = req.body;
  // Logic: Clear cart, create order
  const result = await pgPool.query(
    "INSERT INTO orders (email, total) VALUES ($1, $2) RETURNING id",
    [email, total]
  );
  const orderId = result.rows[0].id;

  for (const item of items) {
    await pgPool.query(
      "INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1, $2, $3)",
      [orderId, item.id, item.quantity]
    );
  }
  // Send email
  const orderDetails = items
    .map(
      (item, idx) =>
        `${idx + 1}. Product ID: ${item.id}, Product Name: ${
          item.name
        }, Quantity: ${item.quantity}`
    )
    .join("\n");

  const emailBody = `Order confirmed!\n\nOrder ID: ${orderId}\nTotal: $${total}\n\nItems:\n${orderDetails}`;

  const params = {
    Destination: { ToAddresses: [email] },
    Message: {
      Body: { Text: { Data: emailBody } },
      Subject: { Data: "E-commerce Order Confirmation" },
    },
    Source: process.env.SES_SOURCE,
  };

  await ses.sendEmail(params).promise();

  res.send("Checkout complete");
});

app.listen(3002, () => console.log("Checkout service on 3002"));

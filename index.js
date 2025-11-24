require("dotenv").config();
const express = require("express");
const path = require("path");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// In-memory log of payments for demo purposes
const payments = [];

app.post("/create-payment-intent", async (req, res) => {
  try {
    let { amount } = req.body;

    // Convert amount to integer (USD -> cents)
    const intAmount = parseInt(amount);
    if (!intAmount || intAmount <= 0) {
      return res.status(400).send({ error: "Invalid amount" });
    }

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: intAmount * 100, // amount in cents
      currency: "usd",
    });

    // Log the payment attempt
    payments.push({
      amount: intAmount,
      status: "processing", 
      created: new Date(),
    });
    console.log(`[${new Date().toLocaleTimeString()}] Payment processing for $${intAmount}`); 

    // Send client secret to frontend
    res.send({
      clientSecret: paymentIntent.client_secret,
      amount: intAmount,
      message: `Payment processing for $${intAmount}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
});

app.get("/payments", (req, res) => {
  res.send(payments);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

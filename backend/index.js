const {
  calculateShippingCharge,
  findProducts,
  getAllProducts,
} = require("./utils");
const express = require("express");
const cors = require("cors");

const PORT = 3000;

const app = express();

app.use(cors());

app.use(express.json());

app.get("/products", async (_, res) => {
  const products = await getAllProducts();

  res.json(products);
});

app.post("/place-order", async (req, res) => {
  const products = await findProducts(req.body.products);

  if (!products.length) {
    return res.status(400).json({ message: "No product found" });
  }

  res.json({ message: "Order placed succesfully" });
});

app.listen(PORT, () => {
  console.log("Listening on http://localhost:" + PORT);
});

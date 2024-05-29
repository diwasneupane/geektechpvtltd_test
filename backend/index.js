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

  products.sort((a, b) => b.weight - a.weight);

  let packages = [
    {
      totalAmount: 0,
      weight: 0,
      products: [],
    },
  ];

  products.forEach((product) => {
    let placed = false;

    // Try to place the product in an existing package
    for (let i = 0; i < packages.length; i++) {
      if (
        packages[i].totalAmount + product.price <= 250 &&
        packages[i].weight + product.weight < 5000
      ) {
        packages[i].totalAmount += product.price;
        packages[i].weight += product.weight;
        packages[i].products.push(product);
        placed = true;
        break;
      }
    }

    // If the product wasn't placed in an existing package, create a new package
    if (!placed) {
      packages.push({
        totalAmount: product.price,
        weight: product.weight,
        products: [product],
      });
    }
  });

  packages = packages.map((package) => {
    return {
      ...package,
      shippingCost: calculateShippingCharge(package.weight),
    };
  });

  res.json({ message: "Order placed succesfully", packages });
});

app.listen(PORT, () => {
  console.log("Listening on http://localhost:" + PORT);
});

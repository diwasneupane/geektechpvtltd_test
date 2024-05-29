const { courierCharges, products } = require("./data");

function calculateShippingCharge(weight) {
  const range = courierCharges.find(
    (item) => weight >= item.weight_range[0] && weight < item.weight_range[1]
  );

  if (!range) {
    throw new Error("Weight range not defined");
  }

  return range.charge;
}

function findProducts(ids) {
  return Promise.resolve(products.filter((item) => ids.includes(item.id)));
}

function getAllProducts() {
  return Promise.resolve(products);
}

module.exports = { calculateShippingCharge, findProducts, getAllProducts };

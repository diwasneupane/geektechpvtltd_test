import { useEffect, useState } from "react";
import { http } from "./utils";

function Loading() {
  return <p>Loading...</p>;
}

function Error({ message }) {
  return <p>{message}</p>;
}

function OrderSuccessful({ packages }) {
  return <div>{packages.map((package_, index) => {
    return <div key={index}>
      <p>Package {index + 1}</p>
      <p>Items - {package_.products.map(product => product.name).join(', ')}</p>
      <p>Total weight - {package_.weight}g</p>
      <p>Total price - ${package_.totalAmount}</p>
      <p>Courier price - {package_.shippingCost}</p>
    </div>
  })}</div>
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [packages, setPackages] = useState([])

  const getProducts = async () => {
    setLoading(true);
    setError(null);
    setPackages([])

    try {
      const res = await http("/products");
      setProducts(res);
    } catch (error) {
      setError(error.response?.message || "Something went wrong while fetching products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const placeOrder = async () => {
    try {
      const response = await http("/place-order", {
        method: "POST",
        body: { products: selectedProducts }
      });
      setPackages(response.packages)
      console.log(response);
    } catch (error) {
      setError(error.response?.message || "Something went wrong while placing order");
    }
  };

  const handleProductSelection = (productId, isSelected) => {
    setSelectedProducts((prevSelectedProducts) =>
      isSelected
        ? [...prevSelectedProducts, productId]
        : prevSelectedProducts.filter((id) => id !== productId)
    );
  };

  if (loading) return <Loading />

  if (error) return <Error message={error} />


  if (packages.length) {
    return <OrderSuccessful packages={packages} />
  }

  return (
    <div>
      {!products.length && <p>No Product Available At Moment</p>}

      {products.length > 0 && (
        <div>
          {products.map((product) => (
            <div key={product.id}>
              {product.name} - ${product.price} - {product.weight}g
              <input
                type="checkbox"
                checked={selectedProducts.includes(product.id)}
                onChange={(e) => handleProductSelection(product.id, e.target.checked)}
              />
            </div>
          ))}
          <button disabled={selectedProducts.length === 0} onClick={placeOrder}>
            Place Order
          </button>
        </div>
      )}
    </div>
  );
}

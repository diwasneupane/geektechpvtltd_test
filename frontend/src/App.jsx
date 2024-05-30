import { useEffect, useState } from "react";
import { http } from "./utils";

function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>
  );
}

function Error({ message }) {
  return <p className="text-center text-red-500 mt-4">{message}</p>;
}

function OrderSuccessful({ packages }) {
  return (
    <div className="p-4 w-full">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {packages.map((package_, index) => (
          <div key={index} className="p-4 border border-gray-300 rounded shadow-md bg-white">
            <h3 className="text-lg font-semibold text-blue-600">Package {index + 1}</h3>
            <p className="mt-2"><span className="font-semibold">Items:</span> {package_.products.map(product => product.name).join(', ')}</p>
            <p className="mt-2"><span className="font-semibold">Total weight:</span> {package_.weight}g</p>
            <p className="mt-2"><span className="font-semibold">Total price:</span> ${package_.totalAmount}</p>
            <p className="mt-2"><span className="font-semibold">Courier price:</span> ${package_.shippingCost}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [packages, setPackages] = useState([]);

  const getProducts = async () => {
    setLoading(true);
    setError(null);
    setPackages([]);

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
    if (window.confirm("Are you sure you want to place the order?")) {
      try {
        const response = await http("/place-order", {
          method: "POST",
          body: { products: selectedProducts }
        });
        setPackages(response.packages);
        console.log(response);
      } catch (error) {
        setError(error.response?.message || "Something went wrong while placing order");
      }
    }
  };

  const handleProductSelection = (productId, isSelected) => {
    setSelectedProducts((prevSelectedProducts) =>
      isSelected
        ? [...prevSelectedProducts, productId]
        : prevSelectedProducts.filter((id) => id !== productId)
    );
  };

  const resetOrderDetails = () => {
    setSelectedProducts([]);
    setPackages([]);
  };

  if (loading) return <Loading />;

  if (error) return <Error message={error} />;

  return (
    <div className="p-4 flex h-screen">
      <div className="w-1/2 p-4 border-r border-gray-300 h-full flex flex-col">
        <h2 className="text-xl font-bold mb-4">Your Item List</h2>
        {!products.length && <p className="text-center text-gray-500">No Product Available At Moment</p>}

        {products.length > 0 && (
          <div className="space-y-4 h-5/6 overflow-y-auto bg-[#f3f3f3] p-4 border rounded-lg">
            {products.map((product) => (
              <div key={product.id} className="flex items-center space-x-4 border p-2 rounded-lg bg-white shadow-sm">
                <div className="flex-grow">
                  <p className="text-sm font-medium">{product.name} - ${product.price} - {product.weight}g</p>
                </div>
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600"
                  checked={selectedProducts.includes(product.id)}
                  onChange={(e) => handleProductSelection(product.id, e.target.checked)}
                />
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 flex space-x-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded shadow disabled:bg-gray-300"
            disabled={selectedProducts.length === 0}
            onClick={placeOrder}
          >
            Place Order
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white font-semibold rounded shadow"
            onClick={resetOrderDetails}
          >
            Reset Order Details
          </button>
        </div>
      </div>
      <div className="w-1/2 p-4 h-full overflow-y-auto">
        {packages.length > 0 ? (
          <OrderSuccessful packages={packages} />
        ) : (
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        )}
      </div>
    </div>
  );
}

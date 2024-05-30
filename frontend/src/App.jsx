import React, { useEffect, useState } from "react";
import { http } from "./utils";
import { FaBox, FaCheckCircle, FaExclamationCircle, FaSpinner, FaUndo } from "react-icons/fa";
import Confirmation from "./Confirm";

// Component for showing a loading spinner
function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <FaSpinner className="animate-spin text-blue-500 h-16 w-16" />
    </div>
  );
}

// Component for displaying an error message
function Error({ message }) {
  return (
    <div className="text-center text-red-500 mt-4">
      <FaExclamationCircle className="inline-block mr-2" />
      {message}
    </div>
  );
}

// Component for displaying the order summary
function OrderSuccessful({ packages }) {
  return (
    <div className="p-4 w-full">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {packages.map((package_, index) => (
          <div key={index} className="p-4 border border-gray-300 rounded shadow-md bg-white">
            <h3 className="text-lg font-semibold text-green-500">
              <FaBox className="inline-block mr-2" />
              Package {index + 1}
            </h3>
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
  // State variables
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [packages, setPackages] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  // Function to fetch the products from the server
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

  // Fetch products when the component mounts
  useEffect(() => {
    getProducts();
  }, []);

  // Function to handle order confirmation
  const confirmOrder = () => {
    setConfirmationMessage("Are you sure you want to place the order?");
    setShowConfirmation(true);
  };

  // Function to handle order placement after confirmation
  const handleConfirmation = async () => {
    try {
      const response = await http("/place-order", {
        method: "POST",
        body: { products: selectedProducts }
      });
      setPackages(response.packages);
      setShowConfirmation(false);
    } catch (error) {
      setError(error.response?.message || "Something went wrong while placing the order");
    }
  };

  // Function to cancel the order confirmation
  const cancelConfirmation = () => {
    setShowConfirmation(false);
  };

  // Function to handle product selection and deselection
  const handleProductSelection = (productId, isSelected) => {
    setSelectedProducts((prevSelectedProducts) =>
      isSelected
        ? [...prevSelectedProducts, productId]
        : prevSelectedProducts.filter((id) => id !== productId)
    );
  };

  // Function to reset the selected products and packages
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
        {!products.length && <p className="text-center text-gray-500">No products available at the moment</p>}

        {products.length > 0 && (
          <div className="space-y-4 h-5/6 overflow-y-auto bg-[#f3f3f3] p-4 border rounded-lg scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200">
            {products.map((product) => (
              <div key={product.id} className="flex items-center space-x-4 border p-2 rounded-lg bg-white shadow-sm">
                <div className="flex-grow">
                  <p className="text-sm font-medium">{product.name} - ${product.price} - {product.weight}g</p>
                </div>
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-green-500"
                  checked={selectedProducts.includes(product.id)}
                  onChange={(e) => handleProductSelection(product.id, e.target.checked)}
                />
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 flex space-x-4">
          <button
            className="px-4 py-2 bg-green-500 text-white font-semibold rounded shadow disabled:bg-gray-300 flex items-center"
            disabled={selectedProducts.length === 0}
            onClick={confirmOrder}
          >
            <FaCheckCircle className="mr-2" />
            Place Order
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white font-semibold rounded shadow flex items-center"
            onClick={resetOrderDetails}
          >
            <FaUndo className="mr-2" />
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
      {showConfirmation && (
        <Confirmation
          message={confirmationMessage}
          onConfirm={handleConfirmation}
          onCancel={cancelConfirmation}
        />
      )}
    </div>
  );
}

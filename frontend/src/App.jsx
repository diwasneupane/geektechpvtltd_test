import { useEffect, useState } from "react"
import { http } from "./utils";

function Loading() {
  return <p>Loading...</p>
}

function Error(props) {
  return <p>{props.message}</p>
}

export default function App() {
  const [products, setProducts] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const getProducts = async () => {
    setLoading(true);
    setError(null);
    setProducts([]);

    try {
      const res = await http("/products")
      setProducts(res)
    } catch (error) {
      setError(error.response?.message || "something went wrong while fetching products");
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getProducts()
  }, [])

  const placeOrder = async () => {
    http("/place-order", {
      method: "post",
      body: { "products": selectedProducts }
    })

  }

  return (
    <div>
      {loading && <Loading />}
      {error && <Error message={error} />}
      {!products.length && !loading && !error && <p>No Product Available At Moment</p>}

      {!!products.length && !loading && !error && (
        <div>
          {products.map(product => (
            <div>{product.name} - ${product.price} - {product.weight}g <input type="checkbox" name="selected-products"
              selected={selectedProducts.includes(product.id)}
              onChange={e => {
                if (e.target.checked) {
                  setSelectedProducts((val) => [...val, product.id])
                } else {
                  setSelectedProducts((val) => val.filter(id => id != product.id))
                }
              }} /></div>
          ))}
        </div>
      )}
      <button disabled={!selectedProducts.length} onClick={placeOrder}>Place Order</button>
    </div>
  )
}
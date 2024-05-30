# Online Shopping Order Management System

# Backend

## Features

- **Product Selection**: Users can choose products from a list displayed on the webpage. Each product is listed with its name, price, and weight, alongside a checkbox for selection.
- **Order Placement**: Upon selecting desired products, users can click the "Place Order" button to submit their order.
- **Dynamic Order Processing**: Orders are processed in real-time, applying predefined rules to determine package allocation.
- **Package Optimization**:
  - Each package's total product cost must not exceed $250 for international customs compliance.
  - When multiple packages are required for an order, each package's weight is optimized for the lowest shipping cost and even distribution.

## Getting Started

1. Install dependencies by running `npm install`.
2. Start the server by running `node index.js`.
3. We stored the PORT value in variable in app.js file instead of making environment variable as it fulfilling the task and main consideration was about the implmentation of logics.
4. Open a web browser and go to `http://localhost:3000` to access the application.

## Logic Overview

### `utils.js`

The `utils.js` file contains the logic for various operations related to products and orders:

- `calculateShippingCharge(weight)`: Calculates the shipping charge based on the weight of the package.
- `findProducts(ids)`: Finds products based on the provided IDs.
- `getAllProducts()`: Retrieves all available products.

### `index.js`

The main logic of the system is implemented in `index.js`, where an Express server is initialized to handle HTTP requests:

- Defines routes for retrieving products (`GET /products`) and placing orders (`POST /place-order`).
- Handles product retrieval and order placement logic:
  - Products are retrieved based on the IDs provided in the request.
  - Orders are processed by dividing products into packages, ensuring compliance with shipping rules.
  - Packages are optimized for cost and weight distribution.
- Listens on port 3000 for incoming requests.

## Data Structure

The product data is stored in a JSON format in the `data.js` file:

```javascript
const products = [
  // Product objects with id, name, price, and weight properties
];

const courierCharges = [
  // Courier charges based on weight ranges
];

module.exports = { products, courierCharges };
```

# Frontend

## Features

- Utilizes React for the frontend.
- Implements a reusable HTTP utility function for making API requests.
- Provides a user-friendly interface for selecting products, placing orders, and displaying order summaries.
- Utilizes a confirmation component for user interaction during order placement.

## Utils Components

### Confirmation Component

A confirmation component (`Confirmation`) is created to provide a user-friendly way of confirming actions, such as placing orders. This component displays a message and offers options to confirm or cancel the action. Here's the component's implementation:

```javascript
function Confirmation({ message, onConfirm, onCancel }) {
  // Implementation details...
}

export default Confirmation;
```

### App Component

The main application component (`App.jsx`) orchestrates the frontend logic, including product selection, order placement, and display of order summaries. Here are some key features of the `App` component:

- Retrieves product data from the backend upon component mount.
- Allows users to select products by toggling checkboxes.
- Provides buttons to place orders and reset order details.
- Displays loading indicators and error messages as needed.
- Renders the order summary upon successful order placement, utilizing the `OrderSuccessful` component.
- Utilizes the `Confirmation` component for user interaction during order placement, ensuring a clear and intuitive experience.

```
    This summarize the process of the given task

```

const express = require("express"); // Import Express framework for creating the web server
const { createProxyMiddleware } = require("http-proxy-middleware"); // Import proxy middleware to forward requests to backend services
const morgan = require("morgan"); // Import Morgan for HTTP request logging
const rateLimit = require("express-rate-limit"); // Import rate limiting middleware to prevent abuse
const cors = require("cors"); // Import CORS middleware to handle cross-origin requests

const app = express(); // Create an Express application instance
const PORT = 4000; // Define the port number the API gateway will listen on

// Middleware
app.use(cors()); // Enable CORS for all routes, allowing cross-origin requests from browsers
app.use(express.json()); // Parse incoming JSON request bodies and make them available in req.body
app.use(morgan("dev")); // Enable HTTP request logging in development format (shows method, URL, status, response time)

// Rate Limiting
const limiter = rateLimit({ // Create a rate limiter configuration
  windowMs: 60 * 1000, // Set the time window to 1 minute (60 seconds * 1000 milliseconds)
  max: 100, // Allow maximum 100 requests per IP address within the time window
});
app.use(limiter); // Apply the rate limiter middleware to all routes

// Proxy to User Service
app.use( // Register middleware for a specific route path
  "/users", // Match all requests starting with /users
  createProxyMiddleware({ // Create a proxy middleware instance
    target: "http://localhost:5001", // Forward requests to the user service running on port 5001
    changeOrigin: true, // Change the origin header to match the target URL
    pathRewrite: { // Rewrite the request path before forwarding
      "^/users": "", // Remove the /users prefix from the path (e.g., /users/profile becomes /profile)
    },
  })
);

// Proxy to Order Service
app.use( // Register middleware for a specific route path
  "/orders", // Match all requests starting with /orders
  createProxyMiddleware({ // Create a proxy middleware instance
    target: "http://localhost:5002", // Forward requests to the order service running on port 5002
    changeOrigin: true, // Change the origin header to match the target URL
    pathRewrite: { // Rewrite the request path before forwarding
      "^/orders": "", // Remove the /orders prefix from the path (e.g., /orders/list becomes /list)
    },
  })
);

// Health Check
app.get("/health", (req, res) => { // Define a GET route handler for /health endpoint
  res.json({ status: "API Gateway Running" }); // Return a JSON response indicating the gateway is operational
});

// Global Error Handler
app.use((err, req, res, next) => { // Register error handling middleware (must have 4 parameters: err, req, res, next)
  console.error(err.stack); // Log the error stack trace to the console for debugging
  res.status(500).json({ error: "Something went wrong" }); // Send a 500 status code with an error message to the client
});

app.listen(PORT, () => { // Start the Express server and listen on the specified port
  console.log(`API Gateway running on port ${PORT}`); // Log a message confirming the server has started
});

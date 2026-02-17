const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Order Service Root" });
});

app.get("/list", (req, res) => {
  res.json({ orders: ["order1", "order2"] });
});

app.listen(5002, () => {
  console.log("Order Service running on port 5002");
});

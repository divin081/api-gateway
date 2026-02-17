const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.json({ message: "User Service Root" });
});

app.get("/profile", (req, res) => {
  res.json({ user: "Seyram" });
});

app.listen(5001, () => {
  console.log("User Service running on port 5001");
});

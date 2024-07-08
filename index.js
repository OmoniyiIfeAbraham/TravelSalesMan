const express = require("express");
const app = express();

// dotenv
require("dotenv").config();

const PORT = process.env.PORT;

// templating
app.set("view engine", "ejs");
app.use(express.static("public"));

// run server
app.listen(PORT, () => console.log(`App listening on PORT: ${PORT}`));

// routes
app.get("/", (req, res) => {
  res.render("tsp");
});

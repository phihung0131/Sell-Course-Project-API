const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectionDatabase } = require("./config/database");
const routes = require("./routes");
const setupSwaggerDocs = require("./docs/api");
const app = express();

const hostname = process.env.HOSTNAME;
const port = process.env.PORT || 3000;

// Middleware: Enable CORS for specified origin
let corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

// Middleware: Parse requests with JSON payload
app.use(express.json());

// Middleware: Parse requests with x-www-form-urlencoded content type
app.use(express.urlencoded({ extended: true }));

// // Routes
app.use("/", routes);
app.use("/", (req, res) => {
  res.send("Go to [/api-docs] to read API Document");
});

// API Document
setupSwaggerDocs(app, port);

// Connect to the database
connectionDatabase();

// Start the server
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

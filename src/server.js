const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectionDatabase } = require("./config/database");
const {
  authRoutes,
  userRoutes,
  courseRoutes,
  lessonRoutes,
  enrollmentRoutes,
} = require("./routes");

const app = express();

const hostname = process.env.HOSTNAME;
const port = process.env.PORT || 3000;

// Middleware: Enable CORS for specified origin
let corsOptions = {
  origin: `http://${hostname}:${port}`,
};
app.use(cors(corsOptions));

// Middleware: Parse requests with JSON payload
app.use(express.json());

// Middleware: Parse requests with x-www-form-urlencoded content type
app.use(express.urlencoded({ extended: true }));

// // Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", courseRoutes);
app.use("/api", lessonRoutes);
app.use("/api", enrollmentRoutes);

// app.get("/", (req, res) => {
//   res.json({ message: "Welcome to bezkoder application." });
// });

// Connect to the database
connectionDatabase();

// Start the server
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

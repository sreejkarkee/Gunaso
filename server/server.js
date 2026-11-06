import "dotenv/config";
import http from "http";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const server = http.createServer(app);

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

try {
  await connectDB();
} catch (error) {
  console.error("Server started without a database connection:", error.message);
}

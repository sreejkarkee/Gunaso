import "dotenv/config";
import http from "http";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const server = http.createServer(app);

const port = process.env.PORT || 5000;

try {
  await connectDB();
} catch (error) {
  console.error("Server startup aborted because MongoDB is unavailable:", error.message);
  process.exit(1);
}

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

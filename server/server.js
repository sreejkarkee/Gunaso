import "dotenv/config";
import http from "http";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const server = http.createServer(app);

await connectDB();
server.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
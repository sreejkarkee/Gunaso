import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.routes.js";
import complaintRoutes from "./routes/complaint.routes.js";
import departmentRoutes from "./routes/department.routes.js";
import { notFound, errorHandler } from "./middleware/error.js";

const app = express();
const clientPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../client");

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "1mb" }));
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/departments", departmentRoutes);
app.use(express.static(clientPath));
app.get("/", (req, res) => res.sendFile(path.join(clientPath, "index.html")));

app.use(notFound);
app.use(errorHandler);

export default app;
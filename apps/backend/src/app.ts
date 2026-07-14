import cors from "cors";
import express from "express";

import { healthRouter } from "./routes/health";
import { ksbsRouter } from "./routes/ksbs";
import { evidenceRouter } from "./routes/evidence";
import { authenticateToken } from "./middleware/authMiddleware";
import { authRouter } from "./routes/auth";
import { itemsRouter } from "./routes/items";

export const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/auth", authRouter);

app.use("/api", authenticateToken, ksbsRouter);
app.use("/api", authenticateToken, evidenceRouter);
app.use("/api", authenticateToken, itemsRouter);

app.use((request, response) => {
  response.status(404).json({
    error: "Not Found",
  });
});

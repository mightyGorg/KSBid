import cors from "cors";
import express from "express";

import { healthRouter } from "./routes/health";
import { ksbsRouter } from "./routes/ksbs";
import { evidenceRouter } from "./routes/evidence";
import { authenticateToken } from "./middleware/authMiddleware";
import { authRouter } from "./routes/auth";
<<<<<<< Updated upstream
import { itemsRouter } from "./routes/auction";
import { adminRouter } from "./routes/admin";
import { meRouter } from "./routes/me";
=======
>>>>>>> Stashed changes

export const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/auth", authRouter);

<<<<<<< Updated upstream
app.use("/api", authenticateToken, meRouter);
app.use("/api", authenticateToken, ksbsRouter);
app.use("/api", authenticateToken, evidenceRouter);
app.use("/api", authenticateToken, itemsRouter);
app.use("/api/admin", authenticateToken, adminRouter);
=======
app.use("/api", authenticateToken, ksbsRouter);
app.use("/api", authenticateToken, evidenceRouter);
>>>>>>> Stashed changes

app.use((request, response) => {
  response.status(404).json({
    error: "Not Found",
  });
<<<<<<< Updated upstream
});

app.use((error, _request, response, _next) => {
  const status = error.statusCode ?? 500;
  response.status(status).json({ error: error.message ?? "Internal Server Error" });
=======
>>>>>>> Stashed changes
});

import cors from "cors";
import express from "express";

import { healthRouter } from "./routes/health";
import { ksbsRouter } from "./routes/ksbs";
import { evidenceRouter } from "./routes/evidence";
import { authenticateToken } from "./middleware/authMiddleware";
import { loginRouter } from "./routes/login";

export const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api", authenticateToken, ksbsRouter)

app.use('/auth/login', loginRouter);

app.use((request, response) => {
    console.log(request)
    response.status(404).json({
    error: "Not Found",
    });
app.use("/api", ksbsRouter);
app.use("/api", evidenceRouter);

app.use((request, response) => {
  response.status(404).json({
    error: "Not Found",
  });
});


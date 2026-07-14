import cors from "cors";
import express from "express";

import { healthRouter } from "./routes/health";
import { loginRouter } from "./routes/login";

export const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRouter);

app.use('/auth/login', loginRouter);

app.use((request, response) => {
    console.log(request)
    response.status(404).json({
    error: "Not Found",
    });
});


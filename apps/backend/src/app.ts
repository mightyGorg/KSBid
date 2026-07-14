import cors from "cors";
import express from "express";

import { healthRouter } from "./routes/health";
<<<<<<< HEAD
import { loginRouter } from "./routes/login";
=======
import {ksbsRouter} from "./routes/ksbs.routes";
>>>>>>> main

export const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api", ksbsRouter)

app.use('/auth/login', loginRouter);

app.use((request, response) => {
    console.log(request)
    response.status(404).json({
    error: "Not Found",
    });
});


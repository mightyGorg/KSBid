import { Router } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma";
import bcrypt from "bcrypt";
import { blockToken } from "../tokenBlocklist";

export const authRouter = Router();

authRouter.post("/login", async (request, response) => {
  const { email, password } = request.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return response.status(400).json({ message: "User not found" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);

    if (!valid) {
      return response.status(401).json({ message: "Invalid password" });
    }

    const payload = { userId: user.id, email: user.email, role: user.role };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    return response.json({ message: "Login successful", token });
  } catch (e) {
    return response.status(500).json({ message: String(e) });
  }
});

authRouter.post("/register", async (request, response) => {
  const { email, password, name } = request.body as {
    email: string;
    password: string;
    name: string;
  };

  if (!email || !password || !name) {
    return response
      .status(400)
      .json({ message: "email, password and name are required" });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
      return response.status(409).json({ message: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { email, name, passwordHash },
      select: { id: true, email: true, name: true, role: true },
    });

    const payload = { userId: user.id, email: user.email, role: user.role };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    return response
      .status(201)
      .json({ message: "Registration successful", token, user });
  } catch (e) {
    return response.status(500).json({ message: String(e) });
  }
});

authRouter.post("/logout", (request, response) => {
  const authHeader = request.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return response.status(401).json({ message: "No token provided" });
  }

  blockToken(token);
  return response.json({ message: "Logged out successfully" });
});

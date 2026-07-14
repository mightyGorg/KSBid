import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from "../prisma"
import bcrypt from 'bcrypt'

export const loginRouter = Router();

loginRouter.post('/', async (request, response) => {
    const { email, password } = request.body;

    try {
      const user = await prisma.user.findUnique({
        where: { email }
      })
      if (!user) {
        return response.status(400).json({ message: "User not found" })
      }

      const valid = await bcrypt.compare(password, user.passwordHash)

      if (!valid) {
        return response.status(401).json({ message: "Invalid password" })
      }

      const payload = {
        userId: user.id,
        email: user.email,
        role: user.role
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: '1h'
      });

      response.json({
        message: 'Login successful',
        token: token
      });
    } catch (e) {
      return response.status(500).json({ message: String(e) })
    }
})

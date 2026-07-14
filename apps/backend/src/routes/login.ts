import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from "../prisma"

export const loginRouter = Router();

loginRouter.post('/', (request, response) => {
    const { email, password } = request.body;

    // Simple hardcoded check (REMOVE WHEN DB IS SETUP LATER!)
    try {
      const user = await prisma.user.findUnique({
        where: email
      })
      if (!user) {
        return response.status(400).json( {message: "User not found"} )
      }

      const valid = await brypt.compare(password, user.password)

      if (!valid) {
        return response.status(401).json({ message: "Invalid password" })
      }

      const payload = {
        userId: 1,
        email: email,
        role: user.role
      };
     
      // Create the JWT token
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1h' // Token expires in 1 hour
      });
     
      // Send the token back to the client
      response.json({
        message: 'Login successful',
        token: token
      });
    } catch (e) {
      return response.status(500).json({ message: e })
    }
    } 
})

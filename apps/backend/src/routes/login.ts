import { Router } from 'express'
import jwt from 'jsonwebtoken'

export const loginRouter = Router();

loginRouter.post('/', (request, response) => {
    const { email, password } = request.body;

    // Simple hardcoded check (REMOVE WHEN DB IS SETUP LATER!)
    if (email === 'test@example.com' && password === 'password123') {
     
      // This is the data (payload) we want to include in our JWT
      const payload = {
        userId: 1,
        email: 'test@example.com',
        role: 'user'
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
     
    } else {
      response.status(401).json({ message: 'Invalid credentials' });
    }
})

import express, { Request, Response, RequestHandler } from 'express';
import { createUser, validateUser } from '../services/userService';
import { generateToken } from '../utils/auth';

const router = express.Router();

interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

// Register a new user
const register: RequestHandler = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body as RegisterRequest;
    
    // Validate input
    if (!email || !password || !firstName || !lastName) {
      res.status(400).json({ message: 'Please provide all required fields' });
      return;
    }
    
    // Create user
    const user = await createUser({
      email,
      password,
      firstName,
      lastName,
      phone
    });
    
    // Generate token
    const token = generateToken(user.id);
    
    res.status(201).json({
      message: 'User registered successfully',
      user,
      token
    });
  } catch (error: any) {
    if (error.message === 'User already exists') {
      res.status(400).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Login user
const login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body as LoginRequest;
    
    // Validate input
    if (!email || !password) {
      res.status(400).json({ message: 'Please provide email and password' });
      return;
    }
    
    // Validate user
    const user = await validateUser(email, password);
    
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }
    
    // Generate token
    const token = generateToken(user.id);
    
    res.status(200).json({
      message: 'Login successful',
      user,
      token
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

router.post('/register', register);
router.post('/login', login);

export default router; 
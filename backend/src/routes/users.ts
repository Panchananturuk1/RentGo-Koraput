import express, { Request, Response } from 'express';
import { findUserById, updateUser } from '../services/userService';
import { authenticateUser } from '../utils/middleware';

const router = express.Router();

// Get user profile
router.get('/me', authenticateUser, async (req: Request & { user?: any }, res: Response) => {
  try {
    res.json({ user: req.user });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
});

// Update user profile
router.put('/me', authenticateUser, async (req: Request & { user?: any }, res: Response) => {
  try {
    const { firstName, lastName, phone, password } = req.body;
    
    const updatedUser = await updateUser(req.user.id, {
      firstName,
      lastName,
      phone,
      password
    });
    
    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

// Get user by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const user = await findUserById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImage: user.profileImage
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

export default router; 
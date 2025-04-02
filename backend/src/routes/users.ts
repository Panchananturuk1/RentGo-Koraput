import express, { Request, Response, RequestHandler } from 'express';
import { findUserById, updateUser } from '../services/userService';
import { authenticateUser } from '../utils/middleware';

const router = express.Router();

interface AuthRequest extends Request {
  user?: any;
}

// Get current user profile
const getCurrentUser: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await findUserById(req.user.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
};

// Update current user profile
const updateCurrentUser: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, phone } = req.body;
    const user = await updateUser(req.user.id, { firstName, lastName, phone });
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating user profile', error: error.message });
  }
};

// Delete current user account
const deleteCurrentUser: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // TODO: Implement deleteUser in userService
    res.status(501).json({ message: 'Delete user functionality not implemented yet' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting user account', error: error.message });
  }
};

// Get user by ID (admin only)
const getUserByIdRoute: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await findUserById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

// Protected routes
router.get('/me', authenticateUser, getCurrentUser);
router.put('/me', authenticateUser, updateCurrentUser);
router.delete('/me', authenticateUser, deleteCurrentUser);

// Admin routes
router.get('/:id', getUserByIdRoute);

export default router; 
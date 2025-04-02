import express, { Request, Response, RequestHandler } from 'express';
import { prisma } from '../index';
import { authenticateUser } from '../utils/middleware';

const router = express.Router();

interface AuthRequest extends Request {
  user?: any;
}

// Get reviews for an item
const getItemReviews: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { itemId } = req.params;
    
    const reviews = await prisma.review.findMany({
      where: { itemId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({ reviews });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};

// Create review
const createReview: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { itemId, rating, comment } = req.body;
    
    // Validate required fields
    if (!itemId || !rating) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }
    
    // Validate item exists
    const item = await prisma.item.findUnique({
      where: { id: itemId },
    });
    
    if (!item) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }
    
    // Check if user already reviewed this item
    const existingReview = await prisma.review.findFirst({
      where: { itemId, userId: req.user.id }
    });
    
    if (existingReview) {
      res.status(400).json({ message: 'You have already reviewed this item' });
      return;
    }
    
    // Create review
    const review = await prisma.review.create({
      data: {
        itemId,
        userId: req.user.id,
        rating: Number(rating),
        comment
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true
          }
        }
      }
    });
    
    res.status(201).json({
      message: 'Review created successfully',
      review
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating review', error: error.message });
  }
};

// Update review
const updateReview: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    
    // Validate required fields
    if (!rating) {
      res.status(400).json({ message: 'Rating is required' });
      return;
    }
    
    // Validate review exists and belongs to user
    const existingReview = await prisma.review.findUnique({
      where: { id },
      select: { id: true, userId: true }
    });
    
    if (!existingReview) {
      res.status(404).json({ message: 'Review not found' });
      return;
    }
    
    if (existingReview.userId !== req.user.id) {
      res.status(403).json({ message: 'Unauthorized to update this review' });
      return;
    }
    
    // Update review
    const review = await prisma.review.update({
      where: { id },
      data: {
        rating: Number(rating),
        comment
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true
          }
        }
      }
    });
    
    res.json({
      message: 'Review updated successfully',
      review
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating review', error: error.message });
  }
};

// Delete review
const deleteReview: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Validate review exists and belongs to user
    const existingReview = await prisma.review.findUnique({
      where: { id },
      select: { id: true, userId: true }
    });
    
    if (!existingReview) {
      res.status(404).json({ message: 'Review not found' });
      return;
    }
    
    if (existingReview.userId !== req.user.id) {
      res.status(403).json({ message: 'Unauthorized to delete this review' });
      return;
    }
    
    // Delete review
    await prisma.review.delete({
      where: { id }
    });
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting review', error: error.message });
  }
};

// Routes
router.get('/item/:itemId', getItemReviews);
router.post('/', authenticateUser, createReview);
router.put('/:id', authenticateUser, updateReview);
router.delete('/:id', authenticateUser, deleteReview);

export default router; 
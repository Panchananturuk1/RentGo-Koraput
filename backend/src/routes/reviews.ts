import express, { Request, Response } from 'express';
import { prisma } from '../index';
import { authenticateUser } from '../utils/middleware';

const router = express.Router();

// Get reviews for an item
router.get('/item/:itemId', async (req: Request, res: Response) => {
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
});

// Create review
router.post('/', authenticateUser, async (req: Request & { user?: any }, res: Response) => {
  try {
    const { bookingId, itemId, rating, comment } = req.body;
    
    // Validate required fields
    if (!bookingId || !itemId || !rating) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Validate booking exists and belongs to user
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { id: true, userId: true, itemId: true, status: true }
    });
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    if (booking.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to review this booking' });
    }
    
    if (booking.itemId !== itemId) {
      return res.status(400).json({ message: 'Item ID does not match booking' });
    }
    
    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'Booking must be completed to leave a review' });
    }
    
    // Check if user already reviewed this booking
    const existingReview = await prisma.review.findFirst({
      where: { bookingId, userId: req.user.id }
    });
    
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this booking' });
    }
    
    // Create review
    const review = await prisma.review.create({
      data: {
        bookingId,
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
});

// Update review
router.put('/:id', authenticateUser, async (req: Request & { user?: any }, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    
    // Validate required fields
    if (!rating) {
      return res.status(400).json({ message: 'Rating is required' });
    }
    
    // Validate review exists and belongs to user
    const existingReview = await prisma.review.findUnique({
      where: { id },
      select: { id: true, userId: true }
    });
    
    if (!existingReview) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    if (existingReview.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to update this review' });
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
});

// Delete review
router.delete('/:id', authenticateUser, async (req: Request & { user?: any }, res: Response) => {
  try {
    const { id } = req.params;
    
    // Validate review exists and belongs to user
    const existingReview = await prisma.review.findUnique({
      where: { id },
      select: { id: true, userId: true }
    });
    
    if (!existingReview) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    if (existingReview.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this review' });
    }
    
    // Delete review
    await prisma.review.delete({
      where: { id }
    });
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting review', error: error.message });
  }
});

export default router; 
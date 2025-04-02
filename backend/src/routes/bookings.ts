import express, { Request, Response } from 'express';
import { getUserBookings, getOwnerBookings, getBookingById, createBooking, updateBookingStatus } from '../services/bookingService';
import { authenticateUser } from '../utils/middleware';

const router = express.Router();

// Get user bookings
router.get('/user', authenticateUser, async (req: Request & { user?: any }, res: Response) => {
  try {
    const bookings = await getUserBookings(req.user.id);
    res.json({ bookings });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
});

// Get owner bookings
router.get('/owner', authenticateUser, async (req: Request & { user?: any }, res: Response) => {
  try {
    const bookings = await getOwnerBookings(req.user.id);
    res.json({ bookings });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
});

// Get booking by ID
router.get('/:id', authenticateUser, async (req: Request & { user?: any }, res: Response) => {
  try {
    const { id } = req.params;
    
    const booking = await getBookingById(id, req.user.id);
    
    res.json({ booking });
  } catch (error: any) {
    if (error.message === 'Booking not found') {
      return res.status(404).json({ message: error.message });
    }
    
    if (error.message === 'Unauthorized to view this booking') {
      return res.status(403).json({ message: error.message });
    }
    
    res.status(500).json({ message: 'Error fetching booking', error: error.message });
  }
});

// Create booking
router.post('/', authenticateUser, async (req: Request & { user?: any }, res: Response) => {
  try {
    const bookingData = req.body;
    
    // Validate required fields
    if (!bookingData.itemId || !bookingData.startDate || !bookingData.endDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const booking = await createBooking(bookingData, req.user.id);
    
    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error: any) {
    if (
      error.message === 'Item not found' ||
      error.message === 'You cannot book your own item' ||
      error.message === 'Item is not available for the selected dates'
    ) {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
});

// Update booking status
router.put('/:id/status', authenticateUser, async (req: Request & { user?: any }, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const booking = await updateBookingStatus(id, status, req.user.id);
    
    res.json({
      message: 'Booking status updated successfully',
      booking
    });
  } catch (error: any) {
    if (error.message === 'Booking not found') {
      return res.status(404).json({ message: error.message });
    }
    
    if (error.message === 'Unauthorized to update this booking') {
      return res.status(403).json({ message: error.message });
    }
    
    res.status(500).json({ message: 'Error updating booking status', error: error.message });
  }
});

export default router; 
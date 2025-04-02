import express, { Request, Response, RequestHandler } from 'express';
import { getUserBookings, getOwnerBookings, getBookingById, createBooking, updateBookingStatus } from '../services/bookingService';
import { authenticateUser } from '../utils/middleware';

const router = express.Router();

interface AuthRequest extends Request {
  user?: any;
}

// Get user bookings
const getUserBookingsHandler: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const bookings = await getUserBookings(req.user.id);
    res.json({ bookings });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

// Get owner bookings
const getOwnerBookingsHandler: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const bookings = await getOwnerBookings(req.user.id);
    res.json({ bookings });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

// Get booking by ID
const getBookingByIdHandler: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const booking = await getBookingById(id, req.user.id);
    
    res.json({ booking });
  } catch (error: any) {
    if (error.message === 'Booking not found') {
      res.status(404).json({ message: error.message });
      return;
    }
    
    if (error.message === 'Unauthorized to view this booking') {
      res.status(403).json({ message: error.message });
      return;
    }
    
    res.status(500).json({ message: 'Error fetching booking', error: error.message });
  }
};

// Create booking
const createBookingHandler: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const bookingData = req.body;
    
    // Validate required fields
    if (!bookingData.itemId || !bookingData.startDate || !bookingData.endDate) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
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
      res.status(400).json({ message: error.message });
      return;
    }
    
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
};

// Update booking status
const updateBookingStatusHandler: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!status || !validStatuses.includes(status)) {
      res.status(400).json({ message: 'Invalid status' });
      return;
    }
    
    const booking = await updateBookingStatus(id, status, req.user.id);
    
    res.json({
      message: 'Booking status updated successfully',
      booking
    });
  } catch (error: any) {
    if (error.message === 'Booking not found') {
      res.status(404).json({ message: error.message });
      return;
    }
    
    if (error.message === 'Unauthorized to update this booking') {
      res.status(403).json({ message: error.message });
      return;
    }
    
    res.status(500).json({ message: 'Error updating booking status', error: error.message });
  }
};

// Routes
router.get('/user', authenticateUser, getUserBookingsHandler);
router.get('/owner', authenticateUser, getOwnerBookingsHandler);
router.get('/:id', authenticateUser, getBookingByIdHandler);
router.post('/', authenticateUser, createBookingHandler);
router.put('/:id/status', authenticateUser, updateBookingStatusHandler);

export default router; 
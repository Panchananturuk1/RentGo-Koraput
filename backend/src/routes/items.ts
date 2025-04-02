import express, { Request, Response, RequestHandler } from 'express';
import { getItems, getItemById, createItem, updateItem, deleteItem } from '../services/itemService';
import { authenticateUser } from '../utils/middleware';

const router = express.Router();

interface AuthRequest extends Request {
  user?: any;
}

// Get all items with filtering
const getAllItems: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await getItems(req.query);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching items', error: error.message });
  }
};

// Get item by ID
const getItem: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const item = await getItemById(id);
    
    if (!item) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }
    
    res.json({ item });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching item', error: error.message });
  }
};

// Create item
const createNewItem: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const itemData = req.body;
    
    // Validate required fields
    if (!itemData.name || !itemData.description || !itemData.categoryId || !itemData.price || !itemData.priceUnit || !itemData.location) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }
    
    const item = await createItem(itemData, req.user.id);
    
    res.status(201).json({
      message: 'Item created successfully',
      item
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating item', error: error.message });
  }
};

// Update item
const updateExistingItem: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const itemData = req.body;
    
    const item = await updateItem(id, itemData, req.user.id);
    
    res.json({
      message: 'Item updated successfully',
      item
    });
  } catch (error: any) {
    if (error.message === 'Item not found') {
      res.status(404).json({ message: error.message });
      return;
    }
    
    if (error.message === 'Unauthorized to update this item') {
      res.status(403).json({ message: error.message });
      return;
    }
    
    res.status(500).json({ message: 'Error updating item', error: error.message });
  }
};

// Delete item
const deleteExistingItem: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    await deleteItem(id, req.user.id);
    
    res.json({ message: 'Item deleted successfully' });
  } catch (error: any) {
    if (error.message === 'Item not found') {
      res.status(404).json({ message: error.message });
      return;
    }
    
    if (error.message === 'Unauthorized to delete this item') {
      res.status(403).json({ message: error.message });
      return;
    }
    
    res.status(500).json({ message: 'Error deleting item', error: error.message });
  }
};

// Route handlers
router.get('/', getAllItems);
router.get('/:id', getItem);
router.post('/', authenticateUser, createNewItem);
router.put('/:id', authenticateUser, updateExistingItem);
router.delete('/:id', authenticateUser, deleteExistingItem);

export default router; 
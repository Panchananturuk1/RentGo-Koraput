import express, { Request, Response } from 'express';
import { getItems, getItemById, createItem, updateItem, deleteItem } from '../services/itemService';
import { authenticateUser } from '../utils/middleware';

const router = express.Router();

// Get all items with filtering
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await getItems(req.query);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching items', error: error.message });
  }
});

// Get item by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const item = await getItemById(id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json({ item });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching item', error: error.message });
  }
});

// Create item
router.post('/', authenticateUser, async (req: Request & { user?: any }, res: Response) => {
  try {
    const itemData = req.body;
    
    // Validate required fields
    if (!itemData.name || !itemData.description || !itemData.categoryId || !itemData.price || !itemData.priceUnit || !itemData.location) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const item = await createItem(itemData, req.user.id);
    
    res.status(201).json({
      message: 'Item created successfully',
      item
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating item', error: error.message });
  }
});

// Update item
router.put('/:id', authenticateUser, async (req: Request & { user?: any }, res: Response) => {
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
      return res.status(404).json({ message: error.message });
    }
    
    if (error.message === 'Unauthorized to update this item') {
      return res.status(403).json({ message: error.message });
    }
    
    res.status(500).json({ message: 'Error updating item', error: error.message });
  }
});

// Delete item
router.delete('/:id', authenticateUser, async (req: Request & { user?: any }, res: Response) => {
  try {
    const { id } = req.params;
    
    await deleteItem(id, req.user.id);
    
    res.json({ message: 'Item deleted successfully' });
  } catch (error: any) {
    if (error.message === 'Item not found') {
      return res.status(404).json({ message: error.message });
    }
    
    if (error.message === 'Unauthorized to delete this item') {
      return res.status(403).json({ message: error.message });
    }
    
    res.status(500).json({ message: 'Error deleting item', error: error.message });
  }
});

export default router; 
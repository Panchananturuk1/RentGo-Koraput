import express, { Request, Response } from 'express';
import { prisma } from '../index';
import { authenticateUser } from '../utils/middleware';

const router = express.Router();

// Get all categories
router.get('/', async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    
    res.json({ categories });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
});

// Create category (admin only)
router.post('/', authenticateUser, async (req: Request & { user?: any }, res: Response) => {
  try {
    const { name, description, icon } = req.body;
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    
    // Check if category already exists
    const existingCategory = await prisma.category.findUnique({
      where: { name }
    });
    
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    
    const category = await prisma.category.create({
      data: {
        name,
        description,
        icon
      }
    });
    
    res.status(201).json({
      message: 'Category created successfully',
      category
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating category', error: error.message });
  }
});

// Get category by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        items: {
          take: 10,
          include: {
            images: {
              where: { isPrimary: true },
              take: 1
            }
          }
        }
      }
    });
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json({ category });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching category', error: error.message });
  }
});

// Update category
router.put('/:id', authenticateUser, async (req: Request & { user?: any }, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, icon } = req.body;
    
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    });
    
    if (!existingCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        description,
        icon
      }
    });
    
    res.json({
      message: 'Category updated successfully',
      category
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating category', error: error.message });
  }
});

export default router; 
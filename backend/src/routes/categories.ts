import express, { Request, Response, RequestHandler } from 'express';
import { prisma } from '../index';
import { authenticateUser } from '../utils/middleware';

const router = express.Router();

interface AuthRequest extends Request {
  user?: any;
}

// Get all categories
const getAllCategories: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    
    res.json({ categories });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

// Create category (admin only)
const createCategory: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, icon } = req.body;
    
    // Validate required fields
    if (!name) {
      res.status(400).json({ message: 'Name is required' });
      return;
    }
    
    // Check if category already exists
    const existingCategory = await prisma.category.findUnique({
      where: { name }
    });
    
    if (existingCategory) {
      res.status(400).json({ message: 'Category already exists' });
      return;
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
};

// Get category by ID
const getCategoryById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
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
      res.status(404).json({ message: 'Category not found' });
      return;
    }
    
    res.json({ category });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching category', error: error.message });
  }
};

// Update category
const updateCategory: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, icon } = req.body;
    
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    });
    
    if (!existingCategory) {
      res.status(404).json({ message: 'Category not found' });
      return;
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
};

// Routes
router.get('/', getAllCategories);
router.post('/', authenticateUser, createCategory);
router.get('/:id', getCategoryById);
router.put('/:id', authenticateUser, updateCategory);

export default router; 
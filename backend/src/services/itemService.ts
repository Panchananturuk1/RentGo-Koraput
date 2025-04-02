import { prisma } from '../index';

interface ItemQuery {
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  location?: string;
  page?: string;
  limit?: string;
}

export const getItems = async (query: ItemQuery = {}) => {
  const { search, category, minPrice, maxPrice, location, page = '1', limit = '10' } = query;
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  // Build where condition
  const where: any = { available: true };
  
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }
  
  if (category) {
    where.categoryId = category;
  }
  
  if (minPrice) {
    where.price = { ...where.price, gte: parseFloat(minPrice) };
  }
  
  if (maxPrice) {
    where.price = { ...where.price, lte: parseFloat(maxPrice) };
  }
  
  if (location) {
    where.location = { contains: location, mode: 'insensitive' };
  }
  
  // Get items
  const items = await prisma.item.findMany({
    where,
    include: {
      category: true,
      images: {
        where: { isPrimary: true },
        take: 1
      },
      reviews: true,
      owner: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImage: true
        }
      }
    },
    skip,
    take: parseInt(limit)
  });
  
  // Get total count
  const totalItems = await prisma.item.count({ where });
  
  // Calculate average rating
  const itemsWithRating = items.map(item => {
    const averageRating = item.reviews.length
      ? item.reviews.reduce((sum, review) => sum + review.rating, 0) / item.reviews.length
      : 0;
      
    return {
      ...item,
      averageRating,
      primaryImage: item.images[0]?.imageUrl || null
    };
  });
  
  return {
    items: itemsWithRating,
    meta: {
      totalItems,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(totalItems / parseInt(limit))
    }
  };
};

export const getItemById = async (id: string) => {
  const item = await prisma.item.findUnique({
    where: { id },
    include: {
      category: true,
      images: true,
      reviews: {
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
      },
      owner: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImage: true,
          email: true,
          phone: true
        }
      },
      bookings: {
        where: {
          status: { in: ['confirmed', 'pending'] }
        },
        select: {
          startDate: true,
          endDate: true
        }
      }
    }
  });
  
  if (!item) {
    return null;
  }
  
  const averageRating = item.reviews.length
    ? item.reviews.reduce((sum, review) => sum + review.rating, 0) / item.reviews.length
    : 0;
    
  return {
    ...item,
    averageRating
  };
};

export const createItem = async (itemData: any, userId: string) => {
  const { name, description, categoryId, price, priceUnit, location, latitude, longitude, images } = itemData;
  
  // Create item
  const item = await prisma.item.create({
    data: {
      name,
      description,
      categoryId,
      ownerId: userId,
      price: parseFloat(price),
      priceUnit,
      location,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null
    }
  });
  
  // Add images if provided
  if (images && images.length > 0) {
    await Promise.all(
      images.map((imageUrl: string, index: number) =>
        prisma.itemImage.create({
          data: {
            itemId: item.id,
            imageUrl,
            isPrimary: index === 0
          }
        })
      )
    );
  }
  
  return getItemById(item.id);
};

export const updateItem = async (id: string, itemData: any, userId: string) => {
  // Check if item exists and belongs to user
  const existingItem = await prisma.item.findUnique({
    where: { id },
    select: { id: true, ownerId: true }
  });
  
  if (!existingItem) {
    throw new Error('Item not found');
  }
  
  if (existingItem.ownerId !== userId) {
    throw new Error('Unauthorized to update this item');
  }
  
  // Update item
  const { name, description, categoryId, price, priceUnit, location, latitude, longitude, available } = itemData;
  
  await prisma.item.update({
    where: { id },
    data: {
      name,
      description,
      categoryId,
      price: price ? parseFloat(price) : undefined,
      priceUnit,
      location,
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
      available
    }
  });
  
  // If updating images
  if (itemData.images) {
    // Delete existing images
    await prisma.itemImage.deleteMany({
      where: { itemId: id }
    });
    
    // Add new images
    await Promise.all(
      itemData.images.map((imageUrl: string, index: number) =>
        prisma.itemImage.create({
          data: {
            itemId: id,
            imageUrl,
            isPrimary: index === 0
          }
        })
      )
    );
  }
  
  return getItemById(id);
};

export const deleteItem = async (id: string, userId: string) => {
  // Check if item exists and belongs to user
  const existingItem = await prisma.item.findUnique({
    where: { id },
    select: { id: true, ownerId: true }
  });
  
  if (!existingItem) {
    throw new Error('Item not found');
  }
  
  if (existingItem.ownerId !== userId) {
    throw new Error('Unauthorized to delete this item');
  }
  
  // Delete item (will cascade delete images)
  await prisma.item.delete({
    where: { id }
  });
  
  return { success: true };
}; 
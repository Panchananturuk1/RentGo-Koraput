import { prisma } from '../index';

export const getUserBookings = async (userId: string) => {
  return prisma.booking.findMany({
    where: { userId },
    orderBy: { startDate: 'desc' },
    include: {
      item: {
        include: {
          images: {
            where: { isPrimary: true },
            take: 1
          },
          category: true,
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true
            }
          }
        }
      }
    }
  });
};

export const getOwnerBookings = async (ownerId: string) => {
  return prisma.booking.findMany({
    where: {
      item: {
        ownerId
      }
    },
    orderBy: { startDate: 'desc' },
    include: {
      item: {
        include: {
          images: {
            where: { isPrimary: true },
            take: 1
          },
          category: true
        }
      },
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          profileImage: true
        }
      }
    }
  });
};

export const getBookingById = async (id: string, userId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      item: {
        include: {
          images: true,
          category: true,
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              profileImage: true
            }
          }
        }
      },
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          profileImage: true
        }
      }
    }
  });
  
  if (!booking) {
    throw new Error('Booking not found');
  }
  
  // Check if user is the renter or owner
  if (booking.userId !== userId && booking.item.ownerId !== userId) {
    throw new Error('Unauthorized to view this booking');
  }
  
  return booking;
};

export const createBooking = async (bookingData: any, userId: string) => {
  const { itemId, startDate, endDate } = bookingData;
  
  // Validate item exists
  const item = await prisma.item.findUnique({
    where: { id: itemId },
    include: {
      bookings: {
        where: {
          OR: [
            {
              // Existing booking starts during requested period
              startDate: {
                gte: new Date(startDate),
                lte: new Date(endDate)
              }
            },
            {
              // Existing booking ends during requested period
              endDate: {
                gte: new Date(startDate),
                lte: new Date(endDate)
              }
            },
            {
              // Existing booking contains requested period
              AND: [
                {
                  startDate: {
                    lte: new Date(startDate)
                  }
                },
                {
                  endDate: {
                    gte: new Date(endDate)
                  }
                }
              ]
            }
          ],
          status: { in: ['pending', 'confirmed'] }
        }
      }
    }
  });
  
  if (!item) {
    throw new Error('Item not found');
  }
  
  // Don't allow booking your own item
  if (item.ownerId === userId) {
    throw new Error('You cannot book your own item');
  }
  
  // Check if item is available for the requested dates
  if (item.bookings.length > 0) {
    throw new Error('Item is not available for the selected dates');
  }
  
  // Calculate total price
  const start = new Date(startDate);
  const end = new Date(endDate);
  const durationMs = end.getTime() - start.getTime();
  let totalDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));
  if (totalDays < 1) totalDays = 1;
  
  let totalPrice = item.price;
  
  switch (item.priceUnit) {
    case 'hour':
      totalPrice = item.price * (totalDays * 24);
      break;
    case 'day':
      totalPrice = item.price * totalDays;
      break;
    case 'week':
      totalPrice = item.price * (totalDays / 7);
      break;
  }
  
  // Create booking
  const booking = await prisma.booking.create({
    data: {
      itemId,
      userId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: 'pending',
      totalPrice
    },
    include: {
      item: {
        include: {
          category: true,
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true
            }
          }
        }
      }
    }
  });
  
  return booking;
};

export const updateBookingStatus = async (id: string, status: string, userId: string) => {
  // Validate booking exists
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      item: true
    }
  });
  
  if (!booking) {
    throw new Error('Booking not found');
  }
  
  // Check if user is the owner of the item
  if (booking.item.ownerId !== userId) {
    throw new Error('Unauthorized to update this booking');
  }
  
  // Update booking
  return prisma.booking.update({
    where: { id },
    data: {
      status
    },
    include: {
      item: {
        include: {
          category: true
        }
      },
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true
        }
      }
    }
  });
}; 
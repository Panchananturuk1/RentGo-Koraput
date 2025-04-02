'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/services/api';

// Mock data for user bookings (as renter)
const mockUserBookings = [
  {
    id: '1',
    item: {
      id: '101',
      name: 'Mountain Bike - Trek Fuel EX 9.8',
      primaryImage: '/images/items/bike1.jpg',
      price: 65,
      priceUnit: 'day'
    },
    owner: {
      id: '201',
      firstName: 'John',
      lastName: 'Smith'
    },
    startDate: '2023-08-15T08:00:00Z',
    endDate: '2023-08-17T18:00:00Z',
    status: 'confirmed',
    totalPrice: 130
  },
  {
    id: '2',
    item: {
      id: '102',
      name: '4-Person Camping Tent',
      primaryImage: '/images/items/tent1.jpg',
      price: 40,
      priceUnit: 'day'
    },
    owner: {
      id: '202',
      firstName: 'Emily',
      lastName: 'Johnson'
    },
    startDate: '2023-09-01T10:00:00Z',
    endDate: '2023-09-05T16:00:00Z',
    status: 'pending',
    totalPrice: 160
  }
];

// Mock data for owner bookings (bookings for items the user owns)
const mockOwnerBookings = [
  {
    id: '3',
    item: {
      id: '103',
      name: 'Hiking Boots - Size 10',
      primaryImage: '/images/items/boots1.jpg',
      price: 15,
      priceUnit: 'day'
    },
    renter: {
      id: '301',
      firstName: 'Michael',
      lastName: 'Davis'
    },
    startDate: '2023-08-20T09:00:00Z',
    endDate: '2023-08-25T17:00:00Z',
    status: 'confirmed',
    totalPrice: 75
  },
  {
    id: '4',
    item: {
      id: '103',
      name: 'Hiking Boots - Size 10',
      primaryImage: '/images/items/boots1.jpg',
      price: 15,
      priceUnit: 'day'
    },
    renter: {
      id: '302',
      firstName: 'Sarah',
      lastName: 'Wilson'
    },
    startDate: '2023-09-10T09:00:00Z',
    endDate: '2023-09-12T17:00:00Z',
    status: 'pending',
    totalPrice: 30
  }
];

interface Booking {
  id: string;
  item: {
    id: string;
    name: string;
    primaryImage?: string;
    price: number;
    priceUnit: string;
  };
  owner?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  renter?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  startDate: string;
  endDate: string;
  status: string;
  totalPrice: number;
}

export default function BookingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'renter' | 'owner'>('renter');
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [ownerBookings, setOwnerBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?redirect=/bookings');
    }
  }, [status, router]);

  // Load bookings data
  useEffect(() => {
    const fetchBookingsData = async () => {
      if (status === 'authenticated') {
        try {
          setIsLoading(true);
          
          // In a real app, these would be API calls
          // const userBookingsResponse = await api.getBookings();
          // const ownerBookingsResponse = await api.getOwnerBookings();
          
          // Using mock data for now
          setUserBookings(mockUserBookings);
          setOwnerBookings(mockOwnerBookings);
          
        } catch (error) {
          setError('Failed to load bookings data. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchBookingsData();
  }, [status]);

  // Format date to more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status badge class based on booking status
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    // In a real app, this would be an API call
    // await api.updateBookingStatus(bookingId, 'cancelled');
    
    // For now, just update the UI
    setUserBookings(userBookings.map(booking => 
      booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
    ));
  };

  const handleUpdateBookingStatus = async (bookingId: string, newStatus: string) => {
    // In a real app, this would be an API call
    // await api.updateBookingStatus(bookingId, newStatus);
    
    // For now, just update the UI
    setOwnerBookings(ownerBookings.map(booking => 
      booking.id === bookingId ? { ...booking, status: newStatus } : booking
    ));
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-6"></div>
            <div className="h-10 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
            {error}
          </div>
        )}
        
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('renter')}
                className={`py-4 px-6 text-center text-sm font-medium ${
                  activeTab === 'renter'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Bookings I've Made
              </button>
              <button
                onClick={() => setActiveTab('owner')}
                className={`py-4 px-6 text-center text-sm font-medium ${
                  activeTab === 'owner'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Bookings for My Items
              </button>
            </nav>
          </div>
        </div>
        
        {/* Bookings Content */}
        <div>
          {activeTab === 'renter' && (
            <>
              {userBookings.length === 0 ? (
                <div className="bg-gray-50 p-8 rounded-lg text-center">
                  <p className="text-gray-500 mb-4">You don't have any bookings yet.</p>
                  <Link 
                    href="/search" 
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Explore Items to Rent
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {userBookings.map((booking) => (
                    <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="flex items-center mb-4 md:mb-0">
                            <div className="w-16 h-16 flex-shrink-0 bg-gray-200 rounded overflow-hidden mr-4">
                              {/* Placeholder for item image */}
                            </div>
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">{booking.item.name}</h3>
                              <p className="text-sm text-gray-500">
                                From {booking.owner?.firstName} {booking.owner?.lastName}
                              </p>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(booking.status)}`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Dates</p>
                            <p className="text-sm font-medium">{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Price</p>
                            <p className="text-sm font-medium">${booking.totalPrice} total</p>
                          </div>
                          <div className="flex items-center justify-end">
                            <Link 
                              href={`/bookings/${booking.id}`}
                              className="text-blue-600 hover:text-blue-800 mr-4"
                            >
                              View Details
                            </Link>
                            {booking.status === 'pending' || booking.status === 'confirmed' ? (
                              <button 
                                onClick={() => handleCancelBooking(booking.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                Cancel
                              </button>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          
          {activeTab === 'owner' && (
            <>
              {ownerBookings.length === 0 ? (
                <div className="bg-gray-50 p-8 rounded-lg text-center">
                  <p className="text-gray-500 mb-4">You don't have any bookings for your items yet.</p>
                  <Link 
                    href="/list-item" 
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    List an Item
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {ownerBookings.map((booking) => (
                    <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="flex items-center mb-4 md:mb-0">
                            <div className="w-16 h-16 flex-shrink-0 bg-gray-200 rounded overflow-hidden mr-4">
                              {/* Placeholder for item image */}
                            </div>
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">{booking.item.name}</h3>
                              <p className="text-sm text-gray-500">
                                Booked by {booking.renter?.firstName} {booking.renter?.lastName}
                              </p>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(booking.status)}`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Dates</p>
                            <p className="text-sm font-medium">{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Price</p>
                            <p className="text-sm font-medium">${booking.totalPrice} total</p>
                          </div>
                          <div className="flex items-center justify-end">
                            <Link 
                              href={`/bookings/${booking.id}`}
                              className="text-blue-600 hover:text-blue-800 mr-4"
                            >
                              View Details
                            </Link>
                            {booking.status === 'pending' && (
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}
                                  className="text-green-600 hover:text-green-800"
                                >
                                  Confirm
                                </button>
                                <button 
                                  onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  Decline
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 
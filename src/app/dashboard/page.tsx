'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/services/api';

// Mock data for item listings
const mockItems = [
  {
    id: '1',
    name: 'Mountain Bike - Trek Fuel EX 9.8',
    description: 'High-performance mountain bike for all terrains',
    price: 65,
    priceUnit: 'day',
    location: 'Aspen, Colorado',
    categoryId: '1',
    category: {
      id: '1',
      name: 'Bikes'
    },
    available: true,
    createdAt: '2023-06-15T14:25:36Z',
    primaryImage: 'https://images.unsplash.com/photo-1532294220147-279399e7e00b?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '2',
    name: '4-Person Camping Tent',
    description: 'Spacious tent perfect for family camping trips',
    price: 40,
    priceUnit: 'day',
    location: 'Boulder, Colorado',
    categoryId: '2',
    category: {
      id: '2',
      name: 'Tents'
    },
    available: true,
    createdAt: '2023-07-20T09:12:45Z',
    primaryImage: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=800&auto=format&fit=crop'
  }
];

// Mock data for booking stats
const mockBookingStats = {
  totalBookings: 12,
  activeBookings: 3,
  pendingBookings: 2,
  completedBookings: 7,
  totalEarnings: 820
};

interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  priceUnit: string;
  location: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
  available: boolean;
  createdAt: string;
  primaryImage?: string;
}

interface BookingStats {
  totalBookings: number;
  activeBookings: number;
  pendingBookings: number;
  completedBookings: number;
  totalEarnings: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [items, setItems] = useState<Item[]>([]);
  const [bookingStats, setBookingStats] = useState<BookingStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?redirect=/dashboard');
    }
  }, [status, router]);

  // Load user items and booking stats
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (status === 'authenticated') {
        try {
          setIsLoading(true);
          
          // In a real app, these would be API calls
          // const itemsResponse = await api.getUserItems();
          // const statsResponse = await api.getBookingStats();
          
          // Using mock data for now
          setItems(mockItems);
          setBookingStats(mockBookingStats);
          
        } catch (error) {
          setError('Failed to load dashboard data. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchDashboardData();
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

  if (status === 'loading' || isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-8 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(2)].map((_, index) => (
                <div key={index} className="h-32 bg-gray-200 rounded"></div>
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Link 
            href="/list-item" 
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
          >
            List New Item
          </Link>
        </div>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
            {error}
          </div>
        )}
        
        {/* Booking Stats */}
        {bookingStats && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Booking Statistics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-gray-500 text-sm">Total Bookings</p>
                <p className="text-2xl font-bold mt-1">{bookingStats.totalBookings}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-gray-500 text-sm">Active Bookings</p>
                <p className="text-2xl font-bold mt-1 text-green-600">{bookingStats.activeBookings}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-gray-500 text-sm">Pending Bookings</p>
                <p className="text-2xl font-bold mt-1 text-yellow-600">{bookingStats.pendingBookings}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-gray-500 text-sm">Total Earnings</p>
                <p className="text-2xl font-bold mt-1 text-blue-600">${bookingStats.totalEarnings}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* User Items */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Listings</h2>
          
          {items.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <p className="text-gray-500 mb-4">You don't have any items listed yet.</p>
              <Link 
                href="/list-item" 
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                List Your First Item
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Listed On
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 flex-shrink-0 bg-gray-200 rounded overflow-hidden mr-3">
                            {/* Placeholder for item image */}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-500">{item.category.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${item.price}/{item.priceUnit}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.available ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <Link 
                            href={`/items/${item.id}/edit`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </Link>
                          <Link 
                            href={`/items/${item.id}`}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
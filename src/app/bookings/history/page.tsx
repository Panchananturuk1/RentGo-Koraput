'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Booking {
  id: string;
  itemName: string;
  itemImage: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
}

export default function RentalHistory() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Fetch booking history
  useEffect(() => {
    if (status === 'authenticated') {
      // This is a placeholder - in a real app, you would fetch from your backend
      // Example: fetch('/api/bookings/history')
      
      // For demo purposes, we'll use mock data
      const mockBookings: Booking[] = [
        {
          id: '1',
          itemName: 'Mountain Bike',
          itemImage: 'https://images.unsplash.com/photo-1594058573823-d8edf1ad3380',
          startDate: '2023-12-10',
          endDate: '2023-12-15',
          totalPrice: 150,
          status: 'completed'
        },
        {
          id: '2',
          itemName: 'Camping Tent',
          itemImage: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d',
          startDate: '2023-11-20',
          endDate: '2023-11-22',
          totalPrice: 75,
          status: 'completed'
        },
        {
          id: '3',
          itemName: 'DSLR Camera',
          itemImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
          startDate: '2023-10-05',
          endDate: '2023-10-07',
          totalPrice: 120,
          status: 'cancelled'
        },
      ];
      
      setTimeout(() => {
        setBookings(mockBookings);
        setIsLoading(false);
      }, 1000); // Simulate loading delay
    }
  }, [status]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    let bgColor = '';
    let textColor = '';
    
    switch (status) {
      case 'completed':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        break;
      case 'cancelled':
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        break;
      case 'pending':
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor} capitalize`}>
        {status}
      </span>
    );
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Rental History</h1>
      
      {bookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No rental history yet</h3>
          <p className="text-gray-500 mb-4">You haven't rented any items yet. Browse our collection and find something for your next adventure!</p>
          <button 
            onClick={() => router.push('/search')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Explore Items
          </button>
        </div>
      ) : (
        <>
          {/* Desktop view */}
          <div className="hidden md:block overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rental Period</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-md overflow-hidden">
                          <Image
                            src={booking.itemImage}
                            alt={booking.itemName}
                            width={40}
                            height={40}
                            className="h-10 w-10 object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{booking.itemName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${booking.totalPrice.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {booking.status === 'completed' && (
                        <button 
                          onClick={() => router.push(`/review/${booking.id}`)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Write Review
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile view */}
          <div className="md:hidden space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="flex items-center p-4 border-b border-gray-200">
                  <div className="h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
                    <Image
                      src={booking.itemImage}
                      alt={booking.itemName}
                      width={64}
                      height={64}
                      className="h-16 w-16 object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-lg font-medium text-gray-900">{booking.itemName}</div>
                    <StatusBadge status={booking.status} />
                  </div>
                </div>
                <div className="px-4 py-3 border-b border-gray-200">
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-sm font-medium text-gray-500">Rental Period</div>
                    <div className="text-sm text-gray-900">
                      {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium text-gray-500">Total Price</div>
                    <div className="text-sm text-gray-900">${booking.totalPrice.toFixed(2)}</div>
                  </div>
                </div>
                {booking.status === 'completed' && (
                  <div className="px-4 py-3">
                    <button 
                      onClick={() => router.push(`/review/${booking.id}`)}
                      className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Write Review
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
} 
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  priceUnit: string;
  location: string;
  available: boolean;
  category: string;
  imageUrl: string;
}

export default function MyListings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Fetch user's listings
  useEffect(() => {
    if (status === 'authenticated') {
      // This is a placeholder - in a real app, you would fetch from your backend
      // Example: fetch('/api/items/my-listings')
      
      // For demo purposes, we'll use mock data
      const mockItems: Item[] = [
        {
          id: '1',
          name: 'Mountain Bike',
          description: 'High-quality mountain bike for adventurous trails',
          price: 25,
          priceUnit: 'day',
          location: 'Koraput, Odisha',
          available: true,
          category: 'Sports',
          imageUrl: 'https://images.unsplash.com/photo-1594058573823-d8edf1ad3380'
        },
        {
          id: '2',
          name: 'Camping Tent',
          description: '4-person camping tent, waterproof and easy to set up',
          price: 35,
          priceUnit: 'day',
          location: 'Koraput, Odisha',
          available: true,
          category: 'Camping',
          imageUrl: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d'
        },
        {
          id: '3',
          name: 'DSLR Camera',
          description: 'Professional DSLR Camera with multiple lenses',
          price: 50,
          priceUnit: 'day',
          location: 'Koraput, Odisha',
          available: false,
          category: 'Electronics',
          imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32'
        },
      ];
      
      setTimeout(() => {
        setItems(mockItems);
        setIsLoading(false);
      }, 1000); // Simulate loading delay
    }
  }, [status]);

  const handleEditItem = (id: string) => {
    router.push(`/list-item/edit/${id}`);
  };

  const handleDeleteItem = (id: string) => {
    // In a real app, you would call your API to delete the item
    // For demo purposes, we'll just filter it out
    setItems(items.filter(item => item.id !== id));
  };

  const toggleAvailability = (id: string) => {
    // In a real app, you would call your API to update the item
    setItems(items.map(item => 
      item.id === id ? { ...item, available: !item.available } : item
    ));
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Listed Items</h1>
        <button 
          onClick={() => router.push('/list-item')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          List New Item
        </button>
      </div>
      
      {items.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No items listed yet</h3>
          <p className="text-gray-500 mb-4">You haven't listed any items for rent. Start earning by listing items you'd like to rent out!</p>
          <button 
            onClick={() => router.push('/list-item')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            List Your First Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="relative h-48 w-full">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.available 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
                <p className="text-gray-500 text-sm mb-2 line-clamp-2">{item.description}</p>
                
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <span className="text-lg font-bold text-blue-600">${item.price}</span>
                    <span className="text-gray-500 text-sm">/{item.priceUnit}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">{item.category}</span>
                  </div>
                </div>
                
                <div className="flex items-center mt-2">
                  <svg className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm text-gray-500">{item.location}</span>
                </div>
                
                <div className="flex mt-4 space-x-2">
                  <button 
                    onClick={() => toggleAvailability(item.id)}
                    className={`flex-1 py-2 text-sm font-medium rounded-md ${
                      item.available 
                        ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                  >
                    {item.available ? 'Set Unavailable' : 'Set Available'}
                  </button>
                  <button 
                    onClick={() => handleEditItem(item.id)}
                    className="flex-1 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium rounded-md"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-2 bg-white text-red-600 hover:bg-red-50 border border-gray-300 rounded-md"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ItemCard from './ItemCard';
import { api } from '@/services/api';

// Mock data for featured items
const mockFeaturedItems = [
  {
    id: '1',
    name: 'Mountain Bike - Trek Fuel EX 9.8',
    description: 'High-performance mountain bike for all terrains',
    price: 65,
    priceUnit: 'day',
    location: 'Aspen, Colorado',
    category: {
      id: '1',
      name: 'Bikes'
    },
    owner: {
      id: 'user1',
      name: 'John D.',
      rating: 4.9
    },
    rating: 4.8,
    reviews: 12,
    primaryImage: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?q=80&w=2080&auto=format&fit=crop',
    available: true
  },
  {
    id: '2',
    name: '4-Person Camping Tent',
    description: 'Spacious tent perfect for family camping trips',
    price: 40,
    priceUnit: 'day',
    location: 'Boulder, Colorado',
    category: {
      id: '2',
      name: 'Tents'
    },
    owner: {
      id: 'user2',
      name: 'Emily J.',
      rating: 4.7
    },
    rating: 4.6,
    reviews: 8,
    primaryImage: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=800&auto=format&fit=crop',
    available: true
  },
  {
    id: '3',
    name: 'Hiking Boots - Size 10',
    description: 'Comfortable and durable hiking boots',
    price: 15,
    priceUnit: 'day',
    location: 'Denver, Colorado',
    category: {
      id: '5',
      name: 'Camping Gear'
    },
    owner: {
      id: 'user3',
      name: 'Michael R.',
      rating: 4.8
    },
    rating: 4.5,
    reviews: 6,
    primaryImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
    available: true
  },
  {
    id: '4',
    name: 'Snowboard with Bindings',
    description: 'All-mountain snowboard with high-quality bindings',
    price: 45,
    priceUnit: 'day',
    location: 'Breckenridge, Colorado',
    category: {
      id: '6',
      name: 'Winter Sports'
    },
    owner: {
      id: 'user4',
      name: 'Sarah W.',
      rating: 4.9
    },
    rating: 4.9,
    reviews: 15,
    primaryImage: 'https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=800&auto=format&fit=crop',
    available: true
  }
];

interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  priceUnit: string;
  location: string;
  category: {
    id: string;
    name: string;
  };
  owner: {
    id: string;
    name: string;
    rating: number;
  };
  rating: number;
  reviews: number;
  primaryImage?: string;
  available: boolean;
}

export default function FeaturedItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, this would be an API call
        // const response = await api.getFeaturedItems();
        // setItems(response.items);
        
        // Using mock data for now
        setItems(mockFeaturedItems);
        
      } catch (error) {
        setError('Failed to load featured items');
        console.error('Error loading featured items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedItems();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
} 
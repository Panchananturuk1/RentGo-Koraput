'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/services/api';

// Mock data for categories
const mockCategories = [
  {
    id: '1',
    name: 'Bikes',
    description: 'Mountain bikes, road bikes, and more',
    icon: '🚲',
    itemCount: 42
  },
  {
    id: '2',
    name: 'Tents',
    description: 'Camping tents for all group sizes',
    icon: '⛺',
    itemCount: 28
  },
  {
    id: '3',
    name: 'Cars',
    description: 'Off-road vehicles and mountain rentals',
    icon: '🚙',
    itemCount: 15
  },
  {
    id: '4',
    name: 'Cabins',
    description: 'Cozy mountain retreats and lodges',
    icon: '🏡',
    itemCount: 24
  },
  {
    id: '5',
    name: 'Camping Gear',
    description: 'Complete gear for your outdoor adventure',
    icon: '🏕️',
    itemCount: 56
  },
  {
    id: '6',
    name: 'Winter Sports',
    description: 'Skis, snowboards, and winter equipment',
    icon: '🎿',
    itemCount: 33
  }
];

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  itemCount: number;
}

export default function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, this would be an API call
        // const response = await api.getCategories();
        // setCategories(response.categories);
        
        // Using mock data for now
        setCategories(mockCategories);
        
      } catch (error) {
        setError('Failed to load categories');
        console.error('Error loading categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="p-6">
              <div className="h-10 w-10 bg-gray-200 rounded-full mb-4 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 mx-auto w-2/3"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/search?category=${category.id}`}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
        >
          <div className="p-6 text-center">
            <div className="text-3xl mb-3">{category.icon}</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{category.name}</h3>
            <p className="text-sm text-gray-500 mb-2 line-clamp-2">{category.description}</p>
            <p className="text-xs text-blue-600 font-medium">{category.itemCount} items</p>
          </div>
        </Link>
      ))}
    </div>
  );
} 
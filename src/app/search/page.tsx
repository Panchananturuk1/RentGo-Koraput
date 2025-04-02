'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ItemCard from '@/components/ItemCard';
import { api } from '@/services/api';

// Placeholder search result interface
interface SearchResult {
  items: any[];
  meta: {
    totalItems: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  
  // Get query params
  const search = searchParams.get('search') || '';
  const location = searchParams.get('location') || '';
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const page = searchParams.get('page') || '1';
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/categories`);
        const data = await response.json();
        setCategories(data.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);
  
  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Build query params
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (location) params.append('location', location);
        if (category) params.append('category', category);
        if (minPrice) params.append('minPrice', minPrice);
        if (maxPrice) params.append('maxPrice', maxPrice);
        params.append('page', page);
        
        // For development/demo, we're using mock data instead of actual API call
        // In production, uncomment this:
        // const data = await api.getItems(`?${params.toString()}`);
        
        // Mock search results for demo
        const mockItems = [
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
              id: '101',
              firstName: 'John',
              lastName: 'Smith',
              profileImage: '/images/users/user1.jpg'
            },
            primaryImage: '/images/items/bike1.jpg',
            averageRating: 4.8
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
              id: '102',
              firstName: 'Emily',
              lastName: 'Johnson',
              profileImage: '/images/users/user2.jpg'
            },
            primaryImage: '/images/items/tent1.jpg',
            averageRating: 4.5
          }
        ];
        
        // Simulate API response format
        const mockData = {
          items: mockItems,
          meta: {
            totalItems: 2,
            page: parseInt(page),
            limit: 10,
            totalPages: 1
          }
        };
        
        setSearchResults(mockData);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setError('Failed to load search results. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSearchResults();
  }, [search, location, category, minPrice, maxPrice, page]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {search || location 
          ? `Search Results for "${search}${location ? ` in ${location}` : ''}"` 
          : 'All Rentals'}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Filters</h2>
            
            <div className="mb-4">
              <label htmlFor="category-filter" className="block text-gray-700 font-medium mb-2">
                Category
              </label>
              <select
                id="category-filter"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={category}
                onChange={(e) => {
                  const url = new URL(window.location.href);
                  url.searchParams.set('category', e.target.value);
                  window.location.href = url.toString();
                }}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Price Range
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                  value={minPrice}
                  onChange={(e) => {
                    const url = new URL(window.location.href);
                    url.searchParams.set('minPrice', e.target.value);
                    window.location.href = url.toString();
                  }}
                />
                <span className="mx-2">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ml-2"
                  value={maxPrice}
                  onChange={(e) => {
                    const url = new URL(window.location.href);
                    url.searchParams.set('maxPrice', e.target.value);
                    window.location.href = url.toString();
                  }}
                />
              </div>
            </div>
            
            <button
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors"
              onClick={() => {
                // Reset all filters
                window.location.href = '/search';
              }}
            >
              Reset Filters
            </button>
          </div>
        </div>
        
        {/* Search Results */}
        <div className="md:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-gray-200 rounded-lg h-80 animate-pulse"></div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg">
              {error}
            </div>
          ) : searchResults?.items.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-2">No results found</h2>
              <p className="text-gray-600">
                Try adjusting your search criteria or explore other categories.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 flex justify-between items-center">
                <p className="text-gray-600">
                  Showing {searchResults?.items.length} of {searchResults?.meta.totalItems} results
                </p>
                <div>
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                      // Here you would implement sorting logic
                      console.log('Sort by:', e.target.value);
                    }}
                  >
                    <option value="relevance">Sort by: Relevance</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating_desc">Highest Rating</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults?.items.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
              
              {/* Pagination */}
              {searchResults && searchResults.meta.totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <div className="flex items-center space-x-1">
                    {[...Array(searchResults.meta.totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      const isCurrentPage = pageNum === searchResults.meta.page;
                      
                      return (
                        <a
                          key={i}
                          href={`/search?${new URLSearchParams({
                            ...Object.fromEntries(searchParams.entries()),
                            page: pageNum.toString()
                          })}`}
                          className={`px-4 py-2 rounded-md ${
                            isCurrentPage
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {pageNum}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 
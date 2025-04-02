'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SearchBar = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    
    if (searchTerm) {
      params.append('search', searchTerm);
    }
    
    if (location) {
      params.append('location', location);
    }
    
    router.push(`/search?${params.toString()}`);
  };

  return (
    <form 
      onSubmit={handleSearch}
      className="bg-white rounded-lg shadow-md overflow-hidden p-2 flex flex-col md:flex-row"
    >
      <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-200 p-2 mb-2 md:mb-0">
        <label htmlFor="searchTerm" className="block text-xs text-gray-500 font-medium mb-1">
          What are you looking for?
        </label>
        <input
          type="text"
          id="searchTerm"
          placeholder="Bike, tent, car, cabin..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full focus:outline-none text-gray-800"
        />
      </div>
      
      <div className="flex-1 p-2">
        <label htmlFor="location" className="block text-xs text-gray-500 font-medium mb-1">
          Location
        </label>
        <input
          type="text"
          id="location"
          placeholder="Mountain area, city, region..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full focus:outline-none text-gray-800"
        />
      </div>
      
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar; 
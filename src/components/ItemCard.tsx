'use client';

import Link from 'next/link';
import Image from 'next/image';

// Placeholder image for items without an image
const placeholderImage = '/images/placeholder.jpg';

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

interface ItemCardProps {
  item: Item;
}

const ItemCard = ({ item }: ItemCardProps) => {
  // Format price based on priceUnit
  const formatPrice = () => {
    const unit = item.priceUnit === 'hour' 
      ? 'hr' 
      : item.priceUnit === 'week' 
        ? 'wk' 
        : 'day';
        
    return `$${item.price}/${unit}`;
  };

  // Format rating to display with one decimal place
  const formattedRating = item.rating.toFixed(1);

  return (
    <Link href={`/items/${item.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
        <div className="relative h-48">
          {item.primaryImage ? (
            <div className="w-full h-full relative">
              <Image
                src={item.primaryImage}
                alt={item.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                priority={false}
                quality={75}
              />
            </div>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {/* Category tag */}
          <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">
            {item.category.name}
          </div>
          
          {/* Price tag */}
          <div className="absolute bottom-3 right-3 bg-white text-blue-600 font-medium text-sm px-3 py-1 rounded-full shadow">
            {formatPrice()}
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 truncate">{item.name}</h3>
          
          <div className="mt-1 flex items-center text-sm text-gray-500">
            <svg className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{item.location}</span>
          </div>
          
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    className="w-4 h-4" 
                    fill={i < Math.round(item.rating) ? "currentColor" : "none"} 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" 
                    />
                  </svg>
                ))}
              </div>
              <span className="ml-1 text-sm text-gray-500">({item.reviews})</span>
            </div>
            
            <div className="text-sm text-gray-500">
              by {item.owner.name}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard; 
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsMenuOpen(false);
      setIsProfileMenuOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Handle scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle mobile menu
  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
    setIsProfileMenuOpen(false);
  };

  // Toggle profile dropdown
  const toggleProfileMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsProfileMenuOpen(!isProfileMenuOpen);
    setIsMenuOpen(false);
  };

  // Handle logout
  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled || pathname !== '/' 
          ? 'bg-white shadow-md' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className={`text-xl font-bold ${
              isScrolled || pathname !== '/' ? 'text-blue-600' : 'text-white'
            }`}>
              RentGo Koraput
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/search" 
              className={`${
                isScrolled || pathname !== '/' 
                  ? 'text-gray-700 hover:text-blue-600' 
                  : 'text-white hover:text-gray-200'
              } px-3 py-2 rounded-md text-sm font-medium`}
            >
              Explore
            </Link>
            <Link 
              href="/categories" 
              className={`${
                isScrolled || pathname !== '/' 
                  ? 'text-gray-700 hover:text-blue-600' 
                  : 'text-white hover:text-gray-200'
              } px-3 py-2 rounded-md text-sm font-medium`}
            >
              Categories
            </Link>
            <Link 
              href="/list-item" 
              className={`${
                isScrolled || pathname !== '/' 
                  ? 'text-gray-700 hover:text-blue-600' 
                  : 'text-white hover:text-gray-200'
              } px-3 py-2 rounded-md text-sm font-medium`}
            >
              List Your Item
            </Link>

            {/* Authentication links */}
            {status === 'authenticated' ? (
              <div className="relative" onClick={toggleProfileMenu}>
                <button 
                  className={`flex items-center space-x-2 ${
                    isScrolled || pathname !== '/' 
                      ? 'text-gray-700 hover:text-blue-600' 
                      : 'text-white hover:text-gray-200'
                  } cursor-pointer`}
                >
                  <span>
                    {session.user?.name || 'Account'}
                  </span>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Profile dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                    <Link 
                      href="/dashboard" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      href="/bookings" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Bookings
                    </Link>
                    <Link 
                      href="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile Settings
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link 
                  href="/login" 
                  className={`${
                    isScrolled || pathname !== '/' 
                      ? 'border-blue-600 text-blue-600 hover:bg-blue-50' 
                      : 'border-white text-white hover:bg-white/10'
                  } px-4 py-2 rounded-md text-sm font-medium border`}
                >
                  Log in
                </Link>
                <Link 
                  href="/register" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className={`${
                isScrolled || pathname !== '/' ? 'text-gray-700' : 'text-white'
              }`}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              href="/search" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            >
              Explore
            </Link>
            <Link 
              href="/categories" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            >
              Categories
            </Link>
            <Link 
              href="/list-item" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            >
              List Your Item
            </Link>
            
            {/* Authentication links for mobile */}
            {status === 'authenticated' ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/bookings" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                >
                  My Bookings
                </Link>
                <Link 
                  href="/profile" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                >
                  Profile Settings
                </Link>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                >
                  Log out
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 px-3 py-2">
                <Link 
                  href="/login" 
                  className="block w-full px-4 py-2 rounded-md text-center text-blue-600 border border-blue-600 font-medium hover:bg-blue-50"
                >
                  Log in
                </Link>
                <Link 
                  href="/register" 
                  className="block w-full px-4 py-2 rounded-md text-center text-white bg-blue-600 font-medium hover:bg-blue-700"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 
'use client';

import { getSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Makes an authenticated fetch request to the API.
 * Automatically includes the auth token from the session if available.
 */
async function authFetch(url: string, options: RequestInit = {}) {
  const session = await getSession();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  } as Record<string, string>;
  
  if (session?.user?.accessToken) {
    headers['Authorization'] = `Bearer ${session.user.accessToken}`;
  }
  
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  
  return data;
}

export const api = {
  // Auth
  login: (email: string, password: string) => 
    fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then(res => res.json()),
  
  register: (userData: any) => 
    fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    }).then(res => res.json()),
    
  // Items
  getItems: (params = '') => authFetch(`/api/items${params}`),
  getItem: (id: string) => authFetch(`/api/items/${id}`),
  createItem: (itemData: any) => authFetch('/api/items', {
    method: 'POST',
    body: JSON.stringify(itemData),
  }),
  updateItem: (id: string, itemData: any) => authFetch(`/api/items/${id}`, {
    method: 'PUT',
    body: JSON.stringify(itemData),
  }),
  deleteItem: (id: string) => authFetch(`/api/items/${id}`, {
    method: 'DELETE',
  }),
  
  // Bookings
  getBookings: () => authFetch('/api/bookings/user'),
  getOwnerBookings: () => authFetch('/api/bookings/owner'),
  getBooking: (id: string) => authFetch(`/api/bookings/${id}`),
  createBooking: (bookingData: any) => authFetch('/api/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  }),
  updateBookingStatus: (id: string, status: string) => authFetch(`/api/bookings/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),
  
  // User
  getProfile: () => authFetch('/api/users/me'),
  updateProfile: (userData: any) => authFetch('/api/users/me', {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
  
  // Categories
  getCategories: () => authFetch('/api/categories'),
}; 
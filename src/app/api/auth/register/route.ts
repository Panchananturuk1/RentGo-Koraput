import { NextResponse } from 'next/server';
import { getApiEndpoint, handleApiError } from '@/utils/api';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Registration request data:', { ...body, password: '[REDACTED]' });
    
    const { firstName, lastName, email, password } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { message: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    console.log('Attempting to register user:', { firstName, lastName, email });

    // Get the registration endpoint using the shared utility
    const registerEndpoint = getApiEndpoint('/api/auth/register');
    console.log('Using register endpoint:', registerEndpoint);

    try {
      const response = await fetch(registerEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Registration failed with status:', response.status, errorData);
        return NextResponse.json(
          { message: errorData.message || 'Registration failed' },
          { status: response.status }
        );
      }

      const data = await response.json();
      console.log('User registered successfully:', data);
      return NextResponse.json(data);
    } catch (fetchError: any) {
      // Use the shared error handler
      const error = handleApiError(fetchError, registerEndpoint);
      return NextResponse.json(
        { message: error.message, details: error.details, error: error.error },
        { status: error.status }
      );
    }
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { 
        message: 'Internal server error', 
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 
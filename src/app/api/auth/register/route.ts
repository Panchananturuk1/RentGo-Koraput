import { NextResponse } from 'next/server';

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

    // Use 127.0.0.1 (IPv4) instead of localhost to avoid IPv6 issues
    const apiUrl = 'http://127.0.0.1:5000';
    console.log('Using API URL:', apiUrl);

    try {
      console.log('Making request to backend API at:', `${apiUrl}/api/auth/register`);
      
      const response = await fetch(`${apiUrl}/api/auth/register`, {
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
      console.error('Backend connection error:', fetchError);
      
      // Check if it's a connection refused error
      if (fetchError.cause?.code === 'ECONNREFUSED') {
        console.error('Connection refused - backend server likely not running on', apiUrl);
        return NextResponse.json(
          { 
            message: 'Unable to connect to the backend server. Please make sure it is running.',
            details: `The backend server should be running on ${apiUrl}. Error: ${fetchError.cause?.syscall} ${fetchError.cause?.code} ${fetchError.cause?.address}:${fetchError.cause?.port}`
          },
          { status: 503 }
        );
      }
      
      return NextResponse.json(
        { 
          message: 'Network error, could not connect to the server',
          error: fetchError.message 
        },
        { status: 503 }
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
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    // Split the full name into first and last name
    const [firstName, ...lastNameParts] = name.trim().split(' ');
    const lastName = lastNameParts.join(' ') || firstName; // If no last name, use first name

    console.log('Attempting to register user:', { firstName, lastName, email });

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    console.log('Using API URL:', apiUrl);

    try {
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

      const data = await response.json();

      if (!response.ok) {
        console.error('Registration failed:', data);
        return NextResponse.json(
          { message: data.message || 'Registration failed' },
          { status: response.status }
        );
      }

      console.log('User registered successfully:', data);
      return NextResponse.json(data);
    } catch (fetchError: any) {
      console.error('Backend connection error:', fetchError);
      if (fetchError.code === 'ECONNREFUSED') {
        return NextResponse.json(
          { message: 'Unable to connect to the server. Please try again later.' },
          { status: 503 }
        );
      }
      throw fetchError;
    }
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
} 
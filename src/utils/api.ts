/**
 * Utility functions for API handling
 */

/**
 * Returns a valid API URL, handling empty or invalid URLs
 * @returns A valid URL string
 */
export const getValidApiUrl = (): string => {
  let apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  // If API URL is undefined, empty, or invalid
  if (!apiUrl || apiUrl.trim() === '') {
    console.warn('NEXT_PUBLIC_API_URL is empty or invalid. Using fallback URL.');
    
    // Use a fallback URL for development
    if (process.env.NODE_ENV === 'development') {
      return 'http://127.0.0.1:5000';
    }
    
    // For production, we'll use a placeholder but it won't work without a real backend
    return 'https://placeholder-api.example.com';
  }
  
  // Make sure URL has proper protocol
  if (!apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
    apiUrl = 'https://' + apiUrl;
  }
  
  return apiUrl;
};

/**
 * Creates a full API endpoint URL
 * @param path - The API endpoint path (without leading slash)
 * @returns The full API URL
 */
export const getApiEndpoint = (path: string): string => {
  const apiUrl = getValidApiUrl();
  const formattedPath = path.startsWith('/') ? path : `/${path}`;
  return `${apiUrl}${formattedPath}`;
};

/**
 * Handle API errors with better logging and response
 * @param error - The error object
 * @param apiUrl - The API URL that was used
 * @returns An object with message and details
 */
export const handleApiError = (error: any, apiUrl: string) => {
  console.error('API connection error:', error);
  
  // Check if it's a connection refused error
  if (error.cause?.code === 'ECONNREFUSED') {
    console.error('Connection refused - backend server likely not running on', apiUrl);
    return {
      message: 'Unable to connect to the backend server. Please make sure it is running.',
      details: `The backend server should be running on ${apiUrl}. Error: ${error.cause?.syscall} ${error.cause?.code} ${error.cause?.address}:${error.cause?.port}`,
      status: 503
    };
  }
  
  return {
    message: 'Network error, could not connect to the server',
    error: error.message,
    status: 503
  };
}; 
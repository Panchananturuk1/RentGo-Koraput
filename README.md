# RentGo Koraput - Tourism Rental Platform

RentGo Koraput is a comprehensive tourism rental platform that allows tourists to rent items like bikes, tents, cars, and book accommodations in mountain areas of Koraput. This application provides user authentication, listing management, booking functionality, and payment processing.

## Tech Stack

### Frontend
- **Framework**: Next.js with App Router
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **State Management**: React Hooks

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)

### Other Technologies
- **Payment Processing**: Stripe (to be implemented)
- **Deployment**: Vercel (frontend), Render (backend), Neon (PostgreSQL)

## Features

- **User Authentication**: Sign up, login, and user profile management
- **Item Listings**: Create, view, update, and delete rental items
- **Search & Filtering**: Search items by name, location, category, and price range
- **Booking System**: Book items for specific dates with availability checking
- **Reviews & Ratings**: Leave reviews and ratings for rented items
- **Payment Processing**: Secure payment handling with Stripe (to be implemented)
- **User Dashboard**: Manage bookings, listings, and account information

## Project Structure

### Frontend (Next.js)

```
src/
├── app/                    # App router pages
│   ├── api/                # API routes
│   ├── items/              # Item pages
│   ├── categories/         # Category pages
│   ├── search/             # Search page
│   ├── login/              # Login page
│   ├── register/           # Register page
│   ├── profile/            # Profile pages
│   ├── bookings/           # Booking pages
│   └── dashboard/          # User dashboard
├── components/             # Reusable UI components
├── contexts/               # React contexts
├── hooks/                  # Custom React hooks
├── services/               # API service layer
├── types/                  # TypeScript type definitions
└── utils/                  # Utility functions
```

### Backend (Express)

```
backend/
├── prisma/                 # Prisma ORM
│   └── schema.prisma       # Database schema
├── src/
│   ├── controllers/        # Route controllers
│   ├── models/             # Data models
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   └── utils/              # Utility functions
└── index.ts                # Entry point
```

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/rentgo-koraput.git
cd rentgo-koraput
```

2. Install dependencies:
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

3. Set up environment variables:
   - Create `.env` file in the root directory
   - Create `.env` file in the `backend` directory

4. Set up the database:
```bash
cd backend
npx prisma migrate dev
```

5. Start the development servers:
```bash
# Start frontend
npm run dev

# Start backend (in a separate terminal)
cd backend
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Items
- `GET /api/items` - Get all items with filters
- `GET /api/items/:id` - Get item by ID
- `POST /api/items` - Create a new item
- `PUT /api/items/:id` - Update an item
- `DELETE /api/items/:id` - Delete an item

### Bookings
- `GET /api/bookings/user` - Get user's bookings
- `GET /api/bookings/owner` - Get owner's bookings
- `GET /api/bookings/:id` - Get booking by ID
- `POST /api/bookings` - Create a new booking
- `PUT /api/bookings/:id/status` - Update booking status

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID

### Reviews
- `GET /api/reviews/item/:itemId` - Get reviews for an item
- `POST /api/reviews` - Create a review
- `PUT /api/reviews/:id` - Update a review
- `DELETE /api/reviews/:id` - Delete a review

## Deployment

### Frontend (Vercel)
1. Push your code to a GitHub repository
2. Connect Vercel to your GitHub repository
3. Configure environment variables
4. Deploy

### Backend (Render)
1. Push your code to a GitHub repository
2. Create a new Web Service on Render
3. Configure environment variables
4. Deploy

## Future Enhancements

- Implement Stripe payment integration
- Add Google Maps/Mapbox integration for location-based searches
- Implement real-time messaging between renters and owners
- Add image uploads with cloud storage
- Implement email notifications
- Add mobile app version

## Contributors

- Your Name - Initial work

## License

This project is licensed under the MIT License
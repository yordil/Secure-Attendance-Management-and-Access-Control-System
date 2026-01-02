# SAMACS Frontend

Modern, secure frontend for the Secure Attendance Management and Access Control System built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- ✅ **Authentication System**
  - Email/password login with MFA support
  - User registration with password validation
  - JWT token management with automatic refresh
  - Secure session handling

- ✅ **Role-Based Access Control**
  - Admin dashboard (system management)
  - Director dashboard (course & faculty management)
  - Teacher dashboard (attendance & course management)
  - Student dashboard (attendance tracking)

- ✅ **Modern UI/UX**
  - Responsive design (mobile, tablet, desktop)
  - Dark mode support
  - Smooth animations and transitions
  - Glassmorphism effects
  - Inter font for premium typography

- ✅ **Core Features**
  - Course management
  - Attendance tracking
  - User profile management
  - Protected routes with role validation

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Form Validation**: React Hook Form + Zod
- **Icons**: Lucide React
- **Charts**: Recharts (ready for integration)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend API running on `http://localhost:3000`

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Update .env.local with your backend URL
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Development

```bash
# Run development server
npm run dev

# Open http://localhost:3001 in your browser
```

### Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
frontend/
├── app/                      # Next.js App Router pages
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── admin/               # Admin dashboard
│   ├── director/            # Director dashboard
│   ├── teacher/             # Teacher dashboard
│   ├── student/             # Student dashboard
│   ├── courses/             # Course management
│   ├── attendance/          # Attendance tracking
│   ├── profile/             # User profile
│   └── layout.tsx           # Root layout with AuthProvider
├── components/
│   ├── ui/                  # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Badge.tsx
│   └── layout/              # Layout components
│       ├── DashboardLayout.tsx
│       └── ProtectedRoute.tsx
├── lib/
│   ├── api/                 # API client
│   │   └── client.ts
│   ├── auth/                # Authentication
│   │   └── AuthContext.tsx
│   └── utils/               # Utilities
│       └── helpers.ts
└── types/                   # TypeScript types
    └── index.ts
```

## Available Routes

### Public Routes
- `/login` - User login
- `/register` - User registration

### Protected Routes (Role-Based)
- `/admin` - Admin dashboard (ADMIN only)
- `/director` - Director dashboard (DIRECTOR only)
- `/teacher` - Teacher dashboard (TEACHER only)
- `/student` - Student dashboard (STUDENT only)
- `/courses` - Course management (ADMIN, DIRECTOR, TEACHER)
- `/attendance` - Attendance view (STUDENT)
- `/profile` - User profile (All authenticated users)

## Authentication Flow

1. User registers via `/register`
2. User logs in via `/login`
3. JWT tokens stored in localStorage
4. Automatic token refresh on expiry
5. Protected routes check authentication & role
6. Redirect to role-specific dashboard

## API Integration

The frontend communicates with the backend API using Axios with the following features:

- **Request Interceptor**: Automatically adds JWT token to requests
- **Response Interceptor**: Handles token refresh on 401 errors
- **Error Handling**: Graceful error messages for failed requests
- **Type Safety**: Full TypeScript support for API responses

## Customization

### Colors

Edit `app/globals.css` to customize the color scheme:

```css
:root {
  --primary: #3b82f6;      /* Blue */
  --secondary: #8b5cf6;    /* Purple */
  --accent: #10b981;       /* Green */
  --destructive: #ef4444;  /* Red */
}
```

### Components

All UI components are in `components/ui/` and can be customized:

- `Button.tsx` - Variants: primary, secondary, outline, ghost, destructive
- `Input.tsx` - With label, error, and helper text support
- `Card.tsx` - Modular card with header, content, footer
- `Badge.tsx` - For roles and status indicators

## Security Features

- ✅ JWT token-based authentication
- ✅ Automatic token refresh
- ✅ Protected routes with role validation
- ✅ MFA support (UI ready)
- ✅ Secure password validation
- ✅ CSRF protection (via backend)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the existing code structure
2. Use TypeScript for type safety
3. Follow the component patterns in `components/ui/`
4. Test on multiple screen sizes
5. Ensure dark mode compatibility

## License

Part of the SAMACS project - Secure Attendance Management and Access Control System

# Blog List Extended - Full Stack Open Part 7

This is the extended blog application implementing exercises 7.9-7.21 from Full Stack Open Part 7.

## Features Implemented

### Exercise 7.9: Automatic Code Formatting
- ✅ **Prettier** configured for automatic code formatting
- Configuration in `.prettierrc` with opinionated settings
- Scripts in `package.json` for formatting: `npm run format` and `npm run format:check`
- Prettier ignore file configured

### Exercises 7.10-7.13: Redux State Management
- ✅ **Exercise 7.10**: Redux notification management
  - Notification state managed with Redux store
  - `notificationSlice` with actions for setting/clearing notifications
  - Async thunk for timed notifications
  
- ✅ **Exercise 7.11-7.12**: Redux blog management
  - Blog state managed with Redux store
  - `blogSlice` with actions for CRUD operations
  - Async thunks for API calls (create, like, delete blogs)
  - Proper error handling and user feedback
  
- ✅ **Exercise 7.13**: Redux user management
  - User authentication state managed with Redux
  - `userSlice` with login/logout actions
  - Persistent login with localStorage integration

### Exercises 7.14-7.21: Views and Navigation
- ✅ **Exercise 7.14**: Users view
  - Table showing all users and their blog counts
  - Service for fetching user data from `/api/users`
  
- ✅ **Exercise 7.15**: Individual user view
  - View showing individual user's blogs
  - Conditional rendering for missing user data
  - Accessible via clicking username in users table
  
- ✅ **Exercise 7.16**: Blog view
  - Separate view for individual blog posts
  - Shows full blog details, like/delete functionality
  - Comments section with local state (ready for backend integration)
  
- ✅ **Exercise 7.17**: Navigation
  - Navigation menu with React Router
  - Links to blogs and users views
  - User info and logout button in navigation
  
- ✅ **Exercise 7.18-7.19**: Comments (Frontend Ready)
  - Comment display and submission form implemented
  - Local state management for comments
  - Ready for backend API integration at `/api/blogs/:id/comments`
  
- ✅ **Exercise 7.20**: Styling
  - Professional CSS styling with modern design
  - Responsive layout with mobile-friendly navigation
  - Styled forms, buttons, tables, and components
  - Color scheme with good contrast and usability

## Tech Stack

- **React 18** with hooks
- **Redux Toolkit** for state management
- **React Router DOM v6** for routing
- **Axios** for HTTP requests
- **Prettier** for code formatting
- **ESLint** for code linting
- **Vite** for build tooling
- **Vitest** for testing

## Redux Store Structure

```javascript
{
  notification: {
    message: string | null,
    type: 'success' | 'error' | null
  },
  blogs: [
    {
      id: string,
      title: string,
      author: string,
      url: string,
      likes: number,
      user: object
    }
  ],
  user: {
    id: string,
    username: string,
    name: string,
    token: string
  } | null
}
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Setup and Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Make sure the backend server is running on port 3003 for full functionality

## Backend Requirements

For full functionality, the backend should support:
- `GET /api/blogs` - Get all blogs
- `POST /api/blogs` - Create new blog
- `PUT /api/blogs/:id` - Update blog
- `DELETE /api/blogs/:id` - Delete blog
- `GET /api/users` - Get all users with populated blogs
- `POST /api/login` - User authentication
- `POST /api/blogs/:id/comments` - Add comment
- `GET /api/blogs/:id/comments` - Get comments

## Key Features

### State Management
- All state managed through Redux with proper async actions
- No component-level state for global data
- Proper error handling and user feedback

### Routing
- Clean URLs for all views
- Proper navigation between different sections
- Conditional rendering based on authentication state

### Styling
- Modern, responsive design
- Consistent color scheme and typography
- Mobile-friendly navigation
- Accessible form controls and buttons

### Code Quality
- Automatic code formatting with Prettier
- ESLint for code quality
- Proper component structure and separation of concerns
- Reusable components and utilities

## Future Enhancements

- Backend integration for comments system
- Real-time updates with WebSockets
- User profile management
- Blog search and filtering
- Blog categories and tags
- User avatar uploads
- Social features (following users, sharing blogs)

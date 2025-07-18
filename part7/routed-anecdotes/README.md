# Routed Anecdotes

This is the solution for Full Stack Open Part 7 exercises 7.1-7.8.

## Features

### Exercises 7.1-7.3: React Router Implementation

- **Exercise 7.1**: React Router implementation with navigation
  - Root path "/" shows anecdotes list
  - "/create" path shows creation form
  - "/about" path shows about page
  - Menu component with working navigation links
  - Footer always visible

- **Exercise 7.2**: Single anecdote view
  - Route "/anecdotes/:id" shows individual anecdote
  - Clickable anecdote names in the list
  - Displays content, author, votes, and info URL

- **Exercise 7.3**: Enhanced UX
  - Automatic redirect to anecdotes list after creation
  - 5-second notification for successful anecdote creation
  - User feedback for form submission

### Exercises 7.4-7.6: Custom useField Hook

- **Exercise 7.4**: useField custom hook implementation
  - Simplifies form field management
  - Returns type, value, and onChange properties
  - Organized in `/src/hooks/index.js`

- **Exercise 7.5**: Reset functionality
  - Added reset function to useField hook
  - Reset button clears all form fields
  - Enhanced form usability

- **Exercise 7.6**: Fixed prop warnings
  - Resolved "Invalid value for prop" warnings
  - Proper prop handling for input elements
  - Clean spread syntax implementation

### Exercises 7.7-7.8: Advanced Custom Hooks

- **Exercise 7.7**: useCountry hook
  - Fetches country data from REST Countries API
  - Uses useEffect with proper dependency array
  - Handles loading and error states
  - Demo available at "/country" route

- **Exercise 7.8**: useResource hook
  - Generic hook for REST API operations
  - Returns array: [resources, service]
  - Service object provides create method
  - Works with any resource type
  - Demo available at "/resource" route

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (usually http://localhost:5173)

## Technologies Used

- React 18
- React Router DOM v6
- Axios (for HTTP requests)
- Vite (build tool)
- ESLint (code linting)

## Project Structure

```
src/
  ├── App.jsx              # Main application component with routing
  ├── main.jsx             # Application entry point
  ├── hooks/
  │   └── index.js         # Custom hooks (useField, useCountry, useResource)
  └── components/
      ├── CountryDemo.jsx  # Demo component for useCountry hook
      └── ResourceDemo.jsx # Demo component for useResource hook
```

## Custom Hooks

### useField(type)
- **Purpose**: Simplifies form field management
- **Parameters**: `type` - input type (e.g., 'text', 'email')
- **Returns**: Object with `type`, `value`, `onChange`, and `reset` properties
- **Usage**: `const field = useField('text')`

### useCountry(name)
- **Purpose**: Fetches country data from REST Countries API
- **Parameters**: `name` - country name to search for
- **Returns**: Object with `found` boolean and `data` (if found)
- **API**: `https://studies.cs.helsinki.fi/restcountries/api/name/${name}`

### useResource(baseUrl)
- **Purpose**: Generic hook for REST API resource management
- **Parameters**: `baseUrl` - API endpoint URL
- **Returns**: Array `[resources, service]` where service has `create` method
- **Usage**: `const [notes, noteService] = useResource('http://localhost:3005/notes')`

## Navigation

- **/** - Anecdotes list
- **/create** - Create new anecdote
- **/about** - About page
- **/anecdotes/:id** - Individual anecdote view
- **/country** - Country hook demo (Exercise 7.7)
- **/resource** - Resource hook demo (Exercise 7.8)

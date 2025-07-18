# Phonebook Backend

This is a Node.js backend application for managing a phonebook, implementing exercises 3.1-3.6 from Full Stack Open.

## Features

- **Exercise 3.1**: GET `/api/persons` - Returns all phonebook entries
- **Exercise 3.2**: GET `/info` - Shows number of entries and current time
- **Exercise 3.3**: GET `/api/persons/:id` - Returns a single person by ID
- **Exercise 3.4**: DELETE `/api/persons/:id` - Deletes a person by ID
- **Exercise 3.5**: POST `/api/persons` - Adds a new person with random ID
- **Exercise 3.6**: Error handling for POST requests (missing data, duplicate names)
- **Exercise 3.17**: PUT `/api/persons/:id` - Updates an existing person's information

## Getting Started

### Prerequisites

- Node.js installed on your system

### Installation

1. Clone the repository
2. Navigate to the # Phonebook Backend

This is the backend for the Full Stack Open Phonebook application.

## Live Application

🌐 **Live App**: [Add your deployment URL here]

## API Endpoints

- `GET /api/persons` - Get all persons
- `GET /api/persons/:id` - Get a single person  
- `POST /api/persons` - Add a new person
- `PUT /api/persons/:id` - Update a person
- `DELETE /api/persons/:id` - Delete a person
- `GET /info` - Get application info

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Start production server:
```bash
npm start
```

The server runs on port 3001.

## Deployment

### Render Deployment

1. Push code to GitHub
2. Connect your GitHub repository to Render
3. Use the following settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: Node

### Fly.io Deployment

1. Install Fly CLI
2. Run `fly launch` in the project directory
3. Follow the prompts to deploy

## Frontend

The frontend is built and served statically from the `/dist` directory. To update the frontend:

1. Make changes in `/frontend/src`
2. Build: `cd frontend && npm run build`
3. Copy build: `cp -r frontend/dist/* dist/`

## MongoDB Database (Exercise 3.12)

### Setup MongoDB Atlas

1. Create a MongoDB Atlas account at https://www.mongodb.com/atlas
2. Create a new cluster
3. Create a database user with username and password
4. Get your connection string from the "Connect" button

### Using mongo.js

The `mongo.js` file allows command-line operations with the MongoDB database:

#### List all persons:
```bash
node mongo.js yourpassword
```

#### Add a new person:
```bash
node mongo.js yourpassword "Anna" 040-1234556
```

#### Add person with whitespace in name:
```bash
node mongo.js yourpassword "Arto Vihavainen" 045-1232456
```

**Note:** Replace `yourpassword` with your actual MongoDB Atlas password. Update the connection string in `mongo.js` with your cluster details.

## Technology Stack

- Node.js
- Express.js
- Morgan (HTTP logging)
- CORS
- MongoDB & Mongoose
- React (Frontend) directory
3. Install dependencies:
   ```
   npm install
   ```

### Running the Application

#### Development mode (with auto-restart):
```
npm run dev
```

#### Production mode:
```
npm start
```

The server will start on http://localhost:3001

## API Endpoints

### GET /api/persons
Returns all persons in the phonebook.

### GET /info
Returns information about the phonebook (number of entries and current time).

### GET /api/persons/:id
Returns a single person by ID. Returns 404 if person not found.

### DELETE /api/persons/:id
Deletes a person by ID. Returns 204 on success, 404 if person not found.

### POST /api/persons
Adds a new person to the phonebook.

Request body:
```json
{
  "name": "Person Name",
  "number": "123-456-789"
}
```

Error responses:
- 400: Missing name or number
- 400: Name already exists

## Testing

You can test the API using the included `requests.rest` file with the REST Client extension in VS Code, or use tools like Postman.

## Initial Data

The application starts with the following hardcoded data:

```json
[
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]
```

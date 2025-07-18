# Blog List E2E Tests

End-to-end tests for the blog list application using Playwright.

## Prerequisites

- Node.js installed
- The backend server running on port 3003
- The frontend application running on port 5173

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers (first time only):
```bash
npx playwright install
```

## Running Tests

### Run all tests:
```bash
npm test
```

### Run tests with browser UI:
```bash
npm run test:headed
```

### Run tests in interactive UI mode:
```bash
npm run test:ui
```

### Debug tests:
```bash
npm run test:debug
```

## Test Coverage

The E2E tests cover the following scenarios:

### 5.17: Login form display
- Verifies that the login form is shown by default

### 5.18: Login functionality
- Tests successful login with correct credentials
- Tests failed login with wrong credentials

### 5.19: Blog creation
- Tests that a logged-in user can create a new blog

### 5.20: Blog liking
- Tests that a blog can be liked

### 5.21: Blog deletion
- Tests that the user who added a blog can delete it

### 5.22: Delete button visibility
- Tests that only the user who added the blog sees the delete button

### 5.23: Blog ordering
- Tests that blogs are arranged in order according to likes (most likes first)

## Setup Notes

- The backend needs to have a `/api/testing/reset` endpoint for database cleanup
- The backend should run in test mode to enable the testing endpoints
- The frontend should be running on localhost:5173
- The backend should be running on localhost:3003

# Unicafe Redux

This is the Redux version of the unicafe exercise from Full Stack Open Part 6.

## Features

- Redux state management for feedback counts (good, ok, bad)
- Immutable reducer with comprehensive tests
- Simple UI with buttons for giving feedback
- Reset functionality to zero all counters

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Run tests:
```bash
npm test
```

## Exercise Requirements

### 6.1: Unicafe Revisited, step 1
- Implemented reducer with proper state management
- Added comprehensive tests with deep-freeze for immutability
- Handles GOOD, OK, BAD, and ZERO actions

### 6.2: Unicafe Revisited, step 2
- Implemented React UI with Redux integration
- Added buttons for each feedback type
- Displays current counts for each feedback type
- Reset functionality

## Redux State Structure

```javascript
{
  good: 0,
  ok: 0,
  bad: 0
}
```

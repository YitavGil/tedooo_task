# Tedooo Feed Project

## Overview
This project implements a social media feed interface using React and TypeScript, featuring infinite scrolling, real-time interactions, and optimized performance. The feed allows users to view posts, interact with content through likes and comments, and automatically loads more content as they scroll.

## Features
- Infinite scroll feed implementation
- Real-time post interactions (likes, comments)
- Image gallery support (up to 2 images per post)
- Optimized performance with proper state management
- Responsive design
- Impression tracking
- Error handling and recovery

## Technologies Used
- React 18.3
- TypeScript 5.6
- Vite 6.0 (Build tool)
- Zustand (State management)
- React Intersection Observer (Infinite scroll)
- Axios (HTTP client)
- Tailwind CSS (Styling)

## Prerequisites
- Node.js (version 16.x or higher)
- npm or yarn package manager

## Getting Started

### Installation
1. Clone the repository:
```bash
git clone <repository-url>
cd tedooo-feed
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

### Running the Development Server
Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000/tedooo_task/`

### Building for Production
Create a production build:
```bash
npm run build
# or
yarn build
```

## Project Structure
```
src/
├── components/      # React components
├── hooks/          # Custom React hooks
├── services/       # API and utility services
├── store/          # Zustand store and slices
├── types/          # TypeScript type definitions
└── utils/          # Helper functions and constants
```

## Performance Considerations
- Efficient state management with Zustand
- Optimized re-renders using proper memoization
- Lazy loading of images
- Batched state updates
- Impression tracking optimization

## Error Handling
- Comprehensive error boundaries
- Retry mechanisms for failed requests
- Graceful degradation
- User-friendly error messages

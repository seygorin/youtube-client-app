# YouTube Client App

A Angular application that allows users to browse, search, and manage YouTube videos. [Deployed version](https://youtube-app-seygorin.netlify.app/).

## Features

- Search YouTube videos
- Browse popular videos in Kazakhstan with infinite scrolling
- View detailed video information
- Add videos to favorites (for authenticated users)
- Create and manage custom video cards
- Filter and sort videos by different criteria
- Light/dark theme toggle
- Responsive design

## Getting Started

### Prerequisites

- Node.js (20.x or higher)
- Angular CLI

### API Keys

**Important**: Before running the application, you need to add your YouTube API key to the environment files:

1. Navigate to the `src/environments` folder
2. Update both environment files with your YouTube API key:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  youtubeApiKey: "YOUR_YOUTUBE_API_KEY",
};
```

```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  youtubeApiKey: "YOUR_YOUTUBE_API_KEY",
};
```

You can obtain a YouTube API key by creating a project in the [Google Cloud Console](https://console.cloud.google.com/) and enabling the YouTube Data API v3.

### Installation

```bash
# Clone the repository
git clone #later#

# Navigate to the project directory
cd youtube-client-app

# Install dependencies
npm install

# Start the development server
npm start
```

The application should now be running at `http://localhost:4200/`.

## Technology Stack

- Angular 19+
- NgRx for state management
- Angular Material for UI components
- RxJS for reactive programming
- TypeScript

## Authentication

The app includes a simulated authentication system that is purely for demonstration purposes. Please note:

- Authentication data is not stored in any database
- User credentials are stored only in local storage
- This is a mock implementation and not a secure authentication system
- Login persists only until browser data is cleared
The mock authentication enables features like:
- Adding videos to favorites
- Creating and deleting custom video cards
- Accessing admin panel
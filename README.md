# Rengen Health App

A comprehensive mobile health application built with React Native and Expo, featuring a dedicated backend for emergency services and health monitoring.

## Features

- 🌙 Dark/Light mode support
- 🚨 Emergency services with:
  - Location-based emergency numbers
  - Real-time emergency response tracking
  - Emergency contact management
- 👤 User profile management
- 🏥 Health information tracking
- 🔐 Secure authentication
- 📱 Cross-platform support (iOS & Android)

## Project Structure

```
rengen/
├── app/                 # React Native frontend
├── backend/            # Emergency services backend
│   └── emergency-webapp/ # Emergency response dashboard
├── data/              # Application data (not tracked in git)
└── assets/            # Static assets
```

## Setup

### Frontend Setup

```bash
# Install dependencies
npm install

# Start the development server
npx expo start
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend/emergency-webapp

# Install backend dependencies
npm install

# Start the backend server
node server.js
```

## Tech Stack

### Frontend

- React Native / Expo
- Firebase Authentication & Firestore
- TypeScript
- React Navigation

### Backend

- Node.js
- Express.js
- Real-time WebSocket communication
- MongoDB (for emergency data)

## Development

- Use `npm run ios` or `npm run android` for platform-specific development
- Backend runs on `http://localhost:3000` by default
- Emergency dashboard available at `http://localhost:3000/emergency-webapp`

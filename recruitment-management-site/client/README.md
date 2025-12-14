# Recruitment Management System - Frontend

A React-based frontend application for the Recruitment Management System.

## Project Structure

```
client/
├── package.json
├── src/
│   ├── App.jsx         # Main application component with routing
│   ├── index.jsx       # Application entry point
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   └── api/            # API service functions
├── .env.example        # Environment variables template
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy the environment variables file and configure:
   ```bash
   cp .env.example .env
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features

- User authentication (Login/Register)
- Job listings and detail views
- CV submission and management
- Recruiter dashboard
- Event management

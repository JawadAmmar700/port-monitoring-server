# Port Monitoring System - Backend Service

This is the backend service for the Port Monitoring System, providing real-time environmental monitoring and vessel tracking capabilities.

## Features

- Real-time environmental data monitoring
- Vessel tracking and management
- WebSocket support for live updates
- SQLite database for data persistence
- Mock data generation for testing
- RESTful API endpoints

## Tech Stack

- Node.js
- TypeScript
- Express.js
- Socket.IO
- SQLite3
- dotenv for environment configuration

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:

```env
PORT=3001
FRONTEND_URL="http://localhost:3000"
NODE_ENV=development
```

3. Build the TypeScript code:

```bash
npm run build
```

4. Start the development server:

```bash
npm run dev
```

## Database Setup

The application uses SQLite as its database. The database file is automatically created in the `data` directory when the application starts.

To initialize the database with mock data:

```bash
npm run generate-mock-data
```

To clear environmental data from the database:

```bash
npm run clear-environmental
```

To clear vessel data specifically:

```bash
npm run clear-vessels
```

## API Endpoints

### Environmental Data

- `GET /api/environmental` - Get current environmental data
- `GET /api/environmental/history` - Get historical environmental data

### Vessel Management

- `GET /api/vessels` - Get all vessels
- `POST /api/vessels` - Add a new vessel
- `GET /api/vessels/:id` - Get vessel by ID
- `PUT /api/vessels/:id` - Update vessel
- `DELETE /api/vessels/:id` - Delete vessel

### Sensors

- `GET /api/sensors` - Get all sensors
- `GET /api/sensors/:id` - Get sensor by ID

## WebSocket Events

The backend provides real-time updates through WebSocket connections:

- `environmental-update` - Emitted when environmental data changes
- `vessel-update` - Emitted when vessel data changes
- `sensor-update` - Emitted when sensor data changes

## Development

To start the development server with hot-reloading:

```bash
npm run dev
```

## Building for Production

To build the application for production:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## Testing

To run tests:

```bash
npm test
```

## Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files
│   ├── models/         # Data models
│   ├── routes/         # API routes
│   ├── scripts/        # Utility scripts
│   ├── mockData.ts     # Mock data generation
│   └── server.ts       # Main server file
├── data/              # SQLite database files
├── dist/              # Compiled JavaScript files
└── package.json
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

# Environmental Monitoring Backend

A Node.js backend for environmental monitoring system using SQLite database.

## Features

- RESTful API for environmental data
- SQLite database for data storage
- TypeScript support
- Express.js server

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Development

1. Start the development server:
```bash
npm run dev
```

2. Build the project:
```bash
npm run build
```

3. Start the production server:
```bash
npm start
```

## API Endpoints

- `POST /api/environmental/data` - Create new environmental data
- `GET /api/environmental/data/latest` - Get latest environmental data
- `GET /api/environmental/data/historical` - Get historical environmental data

## Database

The application uses SQLite for data storage. The database file is automatically created in the `data` directory when the server starts.

## License

ISC 
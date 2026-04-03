# Brain Visualizer

Brain Visualizer is a full-stack emotion-to-brain-region visualization app. The frontend renders an interactive 3D brain scene with emotion-driven activation overlays and analytics dashboards, while the backend stores emotion history and serves mapping data from MySQL.

## Features

- Interactive 3D brain visualization using React Three Fiber and Three.js
- Emotion selection with intensity control
- Region activation overlays and labeled brain regions
- Keyboard shortcuts for fast emotion switching
- Toast notifications for save and history actions
- Analytics dashboard with frequency and intensity trends
- Clear-history action for resetting demo data
- MySQL-backed history persistence
- REST API with local fallback data when the database is unavailable

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Framer Motion, React Three Fiber, Chart.js
- Backend: Node.js, Express, CORS, MySQL2, dotenv
- Database: MySQL

## Project Structure

- `frontend/` - React application and 3D assets
- `backend/` - Express API and database schema
- `README.md` - Project overview and setup instructions

## Prerequisites

- Node.js 18 or later
- npm
- MySQL server

## Setup

### 1. Install frontend dependencies

```bash
cd frontend
npm install
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure the backend environment

Copy `backend/.env.example` to `backend/.env` and update the MySQL credentials if needed.

Example values:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=brain_visualizer
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### 4. Create and seed the database

Run the schema file against your MySQL server:

```bash
mysql -u root -p < backend/database/schema.sql
```

This creates the `brain_visualizer` database, core tables, and sample seed data for analytics.

## Running the App

### Start the backend

```bash
cd backend
npm run dev
```

The API runs on `http://localhost:5000` by default.

### Start the frontend

```bash
cd frontend
npm run dev
```

The Vite dev server runs on `http://localhost:5173` and proxies `/api` requests to the backend.

### Build the frontend for production

```bash
cd frontend
npm run build
```

Preview the production build with:

```bash
cd frontend
npm run preview
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/emotion/:name` - Brain region mapping for a given emotion
- `POST /api/emotion` - Save an emotion selection
- `GET /api/history?limit=50` - Retrieve recent selections
- `GET /api/analytics` - Retrieve frequency and trend data

## Notes

- The frontend brain scene loads model files from `frontend/public/models/`.
- If MySQL is unavailable, emotion mapping requests fall back to local data in the backend controller.
- The repository includes sample data so the analytics page shows useful content after seeding the database.

## License

No license file is currently included in the repository.
# Campus Lost & Found System

A full-stack MERN application for a Campus Lost and Found system.

## Features
- **User Authentication:** Register, Login (JWT-based).
- **CRUD Operations:** Logged-in users can report lost or found items, update them, and delete them.
- **Search:** Search items by name and filter by type (Lost/Found).
- **Security:** Protected routes and ownership validation.
- **Responsive UI:** Built with React, Vite, and Bootstrap.

## Prerequisites
- Node.js (v18+ recommended)
- MongoDB (running locally or a remote cluster)

## Setup Instructions

### 1. Backend Setup
1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` (or use the provided `.env`). Make sure your MongoDB instance is running.
4. Start the server:
   ```bash
   node server.js
   ```
   *The server should run on http://localhost:5000*

### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The app should be available at http://localhost:5173*

## API Endpoints

### Auth
- `POST /api/register`
- `POST /api/login`

### Items
- `GET /api/items` - Get all items
- `GET /api/items/search?name=abc&type=Lost` - Search items
- `GET /api/items/:id` - Get item by ID
- `POST /api/items` - Create a new item (Requires JWT)
- `PUT /api/items/:id` - Update an item (Requires JWT & Ownership)
- `DELETE /api/items/:id` - Delete an item (Requires JWT & Ownership)

## Postman Collection
A Postman collection is included in the root directory: `Campus_Lost_Found.postman_collection.json`. Import it into Postman to test the backend APIs.

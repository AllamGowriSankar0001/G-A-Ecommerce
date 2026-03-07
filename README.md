# G&A Fashion and Shopping (Full Stack)

This repository contains a **React (Vite) client** and an **Express + MongoDB server**.

## Project structure

- `client/`: Frontend (React + Vite + Tailwind)
- `server/`: Backend API (Express, MongoDB, JWT, Cloudinary, Multer)

## Prerequisites

- Node.js (LTS recommended)
- npm (comes with Node)
- MongoDB connection string (local MongoDB or MongoDB Atlas)
- Cloudinary account (for image uploads)

## Setup (one-time)

### 1) Install dependencies

From the repository root:

```bash
cd client
npm install

cd ../server
npm install
```

### 2) Configure environment variables (server)

Create a file: `server/.env`

```env
# Server
PORT=5000

# MongoDB
MONGODBURL=mongodb://127.0.0.1:27017/vendly

# JWT
JWTSECRETKEY=replace_with_a_long_random_secret

# Cloudinary
CLOUDINARYNAME=your_cloudinary_cloud_name
CLOUDINARYAPIKEY=your_cloudinary_api_key
CLOUDINARYAPISECRETKEY=your_cloudinary_api_secret
```

## Run the app (development)

### Terminal 1: start the server

```bash
cd server
npm run dev
```

The server will run on `http://localhost:5000` (or your `PORT`).

### Terminal 2: start the client

```bash
cd client
npm run dev
```

Vite will print the local URL (usually `http://localhost:5173`).

## API quick check

Once the server is running, open:

- `GET /` → returns: `Backend is working correctly`

## Notes

- **Do not commit** your `.env` files.
- If you change the backend URL used by the frontend, update it in the client code where API calls are configured.



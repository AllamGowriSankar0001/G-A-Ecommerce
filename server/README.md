# Vendly Server (Express API)

Backend API for the G&A Fashion and Shopping project.

## Tech stack

- Node.js + Express
- MongoDB + Mongoose
- JWT auth
- Cloudinary + Multer (image uploads)

## Prerequisites

- Node.js (LTS recommended)
- npm
- MongoDB connection string (local MongoDB or MongoDB Atlas)
- Cloudinary account

## Environment variables

Create `server/.env`:

```env
PORT=5000
MONGODBURL=mongodb://127.0.0.1:27017/vendly
JWTSECRETKEY=replace_with_a_long_random_secret

CLOUDINARYNAME=your_cloudinary_cloud_name
CLOUDINARYAPIKEY=your_cloudinary_api_key
CLOUDINARYAPISECRETKEY=your_cloudinary_api_secret
```

## Install

```bash
npm install
```

## Run

### Development (nodemon)

```bash
npm run dev
```

### Production

```bash
npm start
```

## Endpoints (quick overview)

- `GET /` - health check
- `POST /users/signup`
- `POST /users/login`
- `GET /users/allusers` (protected)

- `POST /products/createproduct` (multipart form-data; supports `image1..image4`)
- `GET /products/allproducts`
- `GET /products/getproduct/:id`
- `PUT /products/updateproduct/:id`
- `DELETE /products/removeproduct/:id`



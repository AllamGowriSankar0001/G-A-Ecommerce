# G&A Ecommerce – Complete Project Documentation

This document explains the entire G&A Ecommerce project: structure, features, tech stack, API, database, and configuration.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Frontend (Client)](#4-frontend-client)
5. [Backend (Server)](#5-backend-server)
6. [Database Models](#6-database-models)
7. [API Endpoints](#7-api-endpoints)
8. [Authentication & Security](#8-authentication--security)
9. [Email System](#9-email-system)
10. [Configuration & Environment](#10-configuration--environment)
11. [Key Features](#11-key-features)
12. [How to Run](#12-how-to-run)

---

## 1. Project Overview

**G&A Ecommerce** is a full-stack e-commerce web application for fashion and lifestyle products. It includes:

- User registration, login, and account management
- Product catalog with categories and filters
- Shopping cart and checkout
- Order placement and history
- Email verification and password reset
- Multi-currency and multi-country support
- Image uploads via Cloudinary

**Author:** Allam Gowri Sankar

---

## 2. Tech Stack

### Frontend
- **React 19** – UI library
- **Vite 7** – Build tool and dev server
- **React Router 7** – Client-side routing
- **Tailwind CSS** – Styling
- **Lucide React** – Icons
- **React Toastify** – Notifications

### Backend
- **Node.js** – Runtime
- **Express 5** – Web framework
- **MongoDB** – Database (via Mongoose)
- **JWT** – Authentication
- **bcrypt** – Password hashing
- **Multer** – File upload handling
- **Cloudinary** – Image storage
- **Brevo (Sendinblue)** – Transactional emails
- **Razorpay** – Payment gateway (integrated)
- **Stripe** – Payment gateway (integrated)

---

## 3. Project Structure

```
G-A-Ecommerce/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── config/         # App config (e.g. currency)
│   │   ├── pages/          # Page components
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                  # Express backend
│   ├── config/             # DB, Cloudinary, Brevo
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Auth, Multer
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── index.js            # Entry point
│   └── package.json
│
├── docs/                    # Documentation
│   └── PROJECT_OVERVIEW.md
│
└── README.md
```

---

## 4. Frontend (Client)

### Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Landing page with hero, new arrivals, best sellers |
| `/collection` | Collection | Product catalog with filters |
| `/product/:id` | Product | Single product detail |
| `/cart` | Cart | Shopping cart |
| `/placeorder` | Place Order | Checkout |
| `/orderhistory` | Orders | User's order history |
| `/myaccount` | My Account | Profile, address, preferences, email verification |
| `/login` | Login | Sign in + forgot password flow |
| `/signup` | Signup | User registration |
| `/about` | About | About the brand |
| `/contact` | Contact | Contact form |
| `/returns` | Returns | Returns policy |
| `/privacy` | Privacy Policy | Privacy policy |
| `/terms` | Terms & Conditions | Terms of service |

### Key Components

- **Navbar** – Navigation, cart icon, user dropdown
- **Footer** – Links, social, copyright
- **Hero** – Homepage hero section
- **TrustStrip** – Trust badges
- **newArraivals** – New arrivals section
- **BestSeller** – Best sellers section
- **categories** – Category navigation

### Configuration

- **currencyConfig.js** – Multi-currency (INR, USD, EUR, GBP, etc.), shipping rates per country, price conversion helpers

### Environment

- `VITE_BACKEND_URL` – Backend API base URL (e.g. `http://localhost:5000`)

---

## 5. Backend (Server)

### Entry Point

- **index.js** – Express app setup, CORS, JSON parsing, route mounting, DB and Cloudinary connection

### Route Modules

| Prefix | File | Purpose |
|--------|------|---------|
| `/users` | userRoutes.js | Auth, profile, verification, password reset |
| `/products` | productRoutes.js | Product CRUD, filters |
| `/cart` | cartRoutes.js | Cart operations |
| `/orders` | orderRoutes.js | Order creation, order history |

---

## 6. Database Models

### User (`userModel.js`)

- **Profile:** name, email, password, phone, avatar, dateOfBirth, gender
- **Auth:** role (user/admin), isBlocked
- **Verification:** verifyotp, verifyotpExpiry, isVerified
- **Password reset:** resetOtp, resetOtpExpiry
- **Preferences:** newsletter, currency, language
- **Data:** addresses[], wishlist[], cart (embedded)
- **Timestamps:** createdAt, updatedAt

### Product (`productModel.js`)

- **Basic:** title, description, price
- **Classification:** category (men, women, shoes, accessories), subCategory, productType
- **Media:** images[] (Cloudinary URLs)
- **Inventory:** stock, sold
- **Variants:** sizes[], colors[]
- **Other:** averageRating, isActive

### Order (`orderModel.js`)

- **User:** user (ref)
- **Items:** items[] (product, quantity, size, color, priceAtOrder)
- **Payment:** paymentMethod (COD, UPI, RAZORPAY), paymentStatus (PENDING, PAID, FAILED)
- **Status:** status (PLACED, SHIPPED, OUT_FOR_DELIVERY, DELIVERED, CANCELLED)
- **Amounts:** subtotalAmount, shippingAmount, totalAmount
- **Shipping:** shippingAddress

### Cart (`cartModel.js`)

- **User:** user (ref, unique)
- **Items:** items[] (product, quantity, size, color, priceAtAdd)

---

## 7. API Endpoints

### Users (`/users`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/signup` | No | Register user |
| POST | `/login` | No | Login, returns JWT |
| POST | `/forgot-password` | No | Request password reset OTP |
| POST | `/reset-password` | No | Reset password with OTP |
| GET | `/verify` | Yes | Validate token |
| GET | `/me` | Yes | Get current user profile |
| PUT | `/me` | Yes | Update profile |
| PUT | `/sendverificationcode` | Yes | Send email verification OTP |
| POST | `/verify-email` | Yes | Verify email with OTP |
| GET | `/allusers` | Yes | List all users (admin) |

### Products (`/products`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/createproduct` | No* | Create product (multipart) |
| GET | `/allproducts` | No | List all products |
| GET | `/getproduct/:id` | No | Get product by ID |
| GET | `/getproductsbycategory/:category` | No | Filter by category |
| GET | `/getproductbysubcategory/:subcategory` | No | Filter by subcategory |
| PUT | `/updateproduct/:id` | No* | Update product |
| DELETE | `/removeproduct/:id` | No* | Delete product |

*Product routes may use admin auth in production.

### Cart (`/cart`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/addtocart` | Yes | Add item to cart |
| GET | `/getcart` | Yes | Get user cart |
| PUT | `/updatequantity` | Yes | Update item quantity |
| DELETE | `/removefromcart/:productId` | Yes | Remove item |

### Orders (`/orders`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/create` | Yes | Create order from cart |
| GET | `/my` | Yes | Get user's orders |

---

## 8. Authentication & Security

### JWT

- **Login:** Returns JWT with `_id`, `email`, `role`
- **Expiry:** 5 minutes (configurable in `userController.js`)
- **Header:** `Authorization: Bearer <token>`

### AuthVerify Middleware

- Reads `Authorization` header
- Verifies JWT with `JWTSECRETKEY` or `JWT_SECRET`
- Loads user from DB and sets `req.user`
- Returns 401 if token missing or invalid

### Password & OTP

- Passwords hashed with bcrypt (10 rounds)
- Email verification OTP: 6 digits, 5 minutes
- Password reset OTP: 6 digits, 5 minutes

---

## 9. Email System

**Provider:** Brevo (Sendinblue) via `sib-api-v3-sdk`

### Emails Sent

1. **Welcome** – On signup
2. **Email verification** – 6-digit OTP for account verification
3. **Password reset** – 6-digit OTP for reset

### Configuration

- `BREVO_API` – Brevo API key
- `SENDER_EMAIL` – From address
- `FRONTEND_URL` – Base URL for links (e.g. https://g-a-ecommerce.vercel.app/)

### Templates

- HTML templates in `server/config/brevoMailer.js`
- Shared layout: header, body, footer
- Branding: G&A Ecommerce, dark header (#111827)

---

## 10. Configuration & Environment

### Server `.env`

```env
PORT=5000
MONGODBURL=mongodb://...
JWTSECRETKEY=...
JWT_SECRET=...           # Alternative to JWTSECRETKEY

# Cloudinary
CLOUDINARYNAME=...
CLOUDINARYAPIKEY=...
CLOUDINARYAPISECRETKEY=...

# Brevo
BREVO_API=...
SENDER_EMAIL=...

# Optional
FRONTEND_URL=https://g-a-ecommerce.vercel.app/
```

### Client `.env`

```env
VITE_BACKEND_URL=http://localhost:5000
```

---

## 11. Key Features

### User Account

- Signup, login, profile edit
- Email verification (OTP)
- Password reset (OTP)
- Addresses, preferences (currency, language, newsletter)
- Order history

### Products

- Categories: men, women, shoes, accessories
- Subcategories and product types
- Multiple images (Cloudinary)
- Sizes and colors
- Stock and sold count

### Cart & Checkout

- Add/remove/update cart items
- Price stored at add time
- Checkout uses saved address
- Payment methods: COD, UPI, RAZORPAY
- Cart cleared after order

### Multi-Currency

- Base currency: INR
- Supported: INR, USD, EUR, GBP, CAD, AUD, JPY, SGD, AED
- Country-specific shipping rates and free-shipping thresholds

---

## 12. How to Run

### Prerequisites

- Node.js (LTS)
- MongoDB (local or Atlas)
- Cloudinary account
- Brevo account

### Setup

```bash
# Install dependencies
cd client && npm install
cd ../server && npm install

# Create server/.env with required variables
```

### Development

```bash
# Terminal 1 – Backend
cd server
npm run dev

# Terminal 2 – Frontend
cd client
npm run dev
```

- Backend: http://localhost:5000
- Frontend: http://localhost:5173 (Vite default)

### Build

```bash
cd client
npm run build
```

Output in `client/dist/` for deployment (e.g. Vercel).

---

## Summary

G&A Ecommerce is a full-stack fashion e-commerce app with React + Vite on the frontend and Express + MongoDB on the backend. It supports user accounts, email verification, password reset, product catalog, cart, checkout, orders, multi-currency, and Cloudinary image uploads. JWT is used for authentication, and Brevo is used for transactional emails.

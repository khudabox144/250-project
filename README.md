# 🌍 ExPlore Bangladesh

A **full-stack tourism web application** for discovering, planning, and booking tours across Bangladesh. Built with **Next.js** on the frontend and **Node.js/Express** on the backend, this platform connects tourists with vendors offering tour packages and showcases beautiful destinations across all divisions of Bangladesh.

![Node.js](https://img.shields.io/badge/Node.js-Express%205-green?logo=node.js)
![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC?logo=tailwindcss)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [User Roles](#-user-roles)
- [Screenshots](#-screenshots)

---

## ✨ Features

### 🏖️ Tourist Destinations
- Browse approved tourist places across all **8 divisions** of Bangladesh
- View detailed information with image galleries, descriptions, and locations
- Submit new tourist places (requires admin approval)
- Search and filter destinations

### 📦 Tour Packages
- Vendors create detailed tour packages with pricing, duration, itinerary, highlights, and inclusions
- Advanced filtering — search by **name**, **division**, **district**, **price range**, **duration**, and **sort** options
- Packages require admin approval before going live

### 📅 Booking System
- Book tour packages with date selection and participant count
- Automatic total price calculation (`price × participants`)
- Duplicate booking prevention
- Users track their bookings; vendors manage incoming booking requests (confirm/cancel)

### ⭐ Review System
- Polymorphic reviews — rate and review **tour places**, **packages**, or **vendors**
- Star rating + text comments

### 🗺️ Interactive Maps
- **Leaflet** map integration with markers for all destinations
- **User geolocation** detection
- **Driving directions** via OSRM (OpenStreetMap Routing Machine) with distance & duration
- Fallback to Google Maps navigation

### 👨‍💼 Admin Dashboard
- Overview stats: total users, tours, packages, reviews, and pending counts
- Approve or reject pending tour places and packages
- View and manage all users
- View recent submissions

### 🏪 Vendor Portal
- Create and manage tour packages and tourist places
- View and manage booking requests from tourists
- Dedicated vendor navigation

### 🔐 Authentication & Authorization
- JWT-based authentication with role-based access control
- Three user roles: **User**, **Vendor**, **Admin**
- Protected routes on both frontend and backend

### 🖼️ Image Management
- **Cloudinary** integration for cloud-based image storage
- Multi-image upload support (up to 5 images per package)
- Automatic image optimization

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express 5** | Web framework |
| **MongoDB + Mongoose** | Database & ODM |
| **JWT** | Authentication |
| **bcryptjs** | Password hashing |
| **Cloudinary** | Image storage |
| **Multer** | File upload handling |
| **OSRM API** | Route/navigation service |

### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework (App Router) |
| **React 19** | UI library |
| **Tailwind CSS 4** | Styling |
| **Leaflet + React-Leaflet** | Interactive maps |
| **Lucide React** | Icons |

---

## 📁 Project Structure

```
ExPlore/
├── src/                        # Backend source code
│   ├── server.js               # Entry point - starts Express server
│   ├── app.js                  # Express app configuration & routes
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   ├── cloudinary.js       # Cloudinary configuration
│   │   └── env.js              # Environment variable loader
│   ├── controllers/            # Route handlers
│   │   ├── auth.controller.js
│   │   ├── admin.controller.js
│   │   ├── booking.controller.js
│   │   ├── package.controller.js
│   │   ├── tourPlace.controller.js
│   │   ├── review.controller.js
│   │   ├── user.controller.js
│   │   ├── division.controller.js
│   │   ├── district.controller.js
│   │   └── map.controller.js
│   ├── models/                 # Mongoose schemas
│   │   ├── user.model.js
│   │   ├── tourPlace.model.js
│   │   ├── package.model.js
│   │   ├── booking.model.js
│   │   ├── review.model.js
│   │   ├── division.model.js
│   │   ├── district.model.js
│   │   └── vendor.model.js
│   ├── routes/                 # API route definitions
│   ├── services/               # Business logic layer
│   ├── middlewares/             # Auth, role, upload, validation
│   └── utils/                  # Helpers (AppError, catchAsync, pagination, email)
│
├── frontend/                   # Next.js frontend
│   ├── app/
│   │   ├── page.js             # Home page
│   │   ├── layout.js           # Root layout (Navbar + Footer)
│   │   ├── globals.css         # Global styles
│   │   ├── auth/
│   │   │   ├── login/          # Login page
│   │   │   └── register/       # Registration page
│   │   ├── packages/           # Tour packages listing & detail
│   │   ├── tours/              # Tour places listing
│   │   ├── allDestination/     # All destinations page
│   │   ├── bookings/           # User bookings
│   │   ├── addPlaces/          # Add new tour place (vendor/admin)
│   │   ├── addPackage/         # Add new package (vendor)
│   │   ├── admin/              # Admin dashboard
│   │   ├── vendor/             # Vendor booking management
│   │   ├── map/                # Interactive map page
│   │   ├── profile/            # User profile
│   │   ├── components/         # Reusable React components
│   │   └── utils/              # Frontend utilities
│   └── public/                 # Static assets
│
├── uploads/                    # Local file uploads (fallback)
├── package.json                # Backend dependencies
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local instance or MongoDB Atlas)
- **Cloudinary account** (free tier works)

### 1. Clone the Repository

```bash
git clone https://github.com/khudabox144/250-project.git
cd 250-project
```

### 2. Setup Backend

```bash
# Install backend dependencies
npm install

# Create .env file (see Environment Variables section below)
cp .env.example .env

# Start backend server
npm run dev
```

The backend will run on **http://localhost:5000**

### 3. Setup Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install frontend dependencies
npm install

# Start frontend dev server
npm run dev
```

The frontend will run on **http://localhost:3000**

---

## 🔑 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Client
NEXT_PUBLIC_SERVER_BASE_URL=http://localhost:5000/api

# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# JWT Authentication
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES=7d

# Database
MONGO_URI=mongodb://127.0.0.1:27017/tourism_app
# Or use MongoDB Atlas:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/tourism_app

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Map Routing (OSRM - free, no key needed)
OSRM_SERVER_URL=http://router.project-osrm.org
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login & get JWT token |
| `POST` | `/api/auth/logout` | Logout |

### Tour Places
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/tours` | ❌ | Get all approved tour places |
| `GET` | `/api/tours/:id` | ❌ | Get a single tour place |
| `POST` | `/api/tours` | ✅ | Create a new tour place |
| `PUT` | `/api/tours/:id` | ✅ | Update a tour place |
| `DELETE` | `/api/tours/:id` | ✅ | Delete a tour place |

### Tour Packages
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/packages` | ❌ | Get all approved packages |
| `GET` | `/api/packages/:id` | ❌ | Get a single package |
| `GET` | `/api/packages/division/:id` | ❌ | Get packages by division |
| `GET` | `/api/packages/district/:id` | ❌ | Get packages by district |
| `GET` | `/api/packages/vendor/my-packages` | ✅ Vendor | Get vendor's packages |
| `POST` | `/api/packages` | ✅ Vendor | Create a new package |
| `PUT` | `/api/packages/:id` | ✅ Vendor/Admin | Update a package |
| `DELETE` | `/api/packages/:id` | ✅ Admin | Delete a package |

### Bookings
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/bookings` | ✅ | Create a booking |
| `GET` | `/api/bookings/my` | ✅ | Get user's bookings |
| `GET` | `/api/bookings/vendor` | ✅ Vendor | Get vendor's received bookings |
| `PUT` | `/api/bookings/:id/status` | ✅ Vendor/Admin | Update booking status |

### Reviews
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/reviews` | ✅ | Create a review |
| `GET` | `/api/reviews/:targetType/:targetId` | ❌ | Get reviews for a target |

### Admin
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/admin/dashboard` | ✅ Admin | Get dashboard stats |
| `GET` | `/api/admin/pending-tours` | ✅ Admin | Get pending tour places |
| `GET` | `/api/admin/pending-packages` | ✅ Admin | Get pending packages |
| `GET` | `/api/admin/users` | ✅ Admin | Get all users |
| `PATCH` | `/api/admin/tours/:id/approve` | ✅ Admin | Approve a tour place |
| `PATCH` | `/api/admin/tours/:id/reject` | ✅ Admin | Reject a tour place |
| `PATCH` | `/api/admin/packages/:id/approve` | ✅ Admin | Approve a package |
| `PATCH` | `/api/admin/packages/:id/reject` | ✅ Admin | Reject a package |

### Divisions & Districts
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/divisions` | ❌ | Get all divisions |
| `POST` | `/api/divisions` | ✅ Admin | Create a division |
| `GET` | `/api/districts` | ❌ | Get all districts |
| `GET` | `/api/districts/division/:id` | ❌ | Get districts by division |
| `POST` | `/api/districts` | ✅ Admin | Create a district |

### Map
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/map/route?start=lat,lng&end=lat,lng` | Get driving route via OSRM |

---

## 👥 User Roles

| Role | Permissions |
|------|-------------|
| **User** | Browse places & packages, book tours, write reviews, submit places for approval |
| **Vendor** | All user permissions + create packages, manage bookings, submit places |
| **Admin** | Full access — approve/reject submissions, manage users, dashboard analytics |

---

## 📸 Screenshots

> 🚧 *Screenshots will be added after deployment.*

---

## 🗺️ Key Workflows

### Tourist Flow
1. **Register** as a User → **Browse** tour places and packages
2. **Search & Filter** packages by location, price, duration
3. **View** package details (itinerary, highlights, inclusions, map location)
4. **Book** a package → select date & participants → submit booking
5. **Track** booking status on the bookings page
6. **Review** the experience

### Vendor Flow
1. **Register** as a Vendor → **Add** tour places and packages
2. Wait for **admin approval**
3. **Manage** incoming booking requests (confirm/cancel)
4. View submitted places and packages

### Admin Flow
1. View **dashboard** with overview stats
2. **Review** and approve/reject pending tour places and packages
3. **Monitor** all users and activity

---

## 🔮 Future Improvements

- [ ] Deploy to production (Vercel + Railway/Render)
- [ ] Payment gateway integration (SSLCommerz/Stripe)
- [ ] Email notifications for bookings and approvals
- [ ] User profile management
- [ ] Pagination for large datasets
- [ ] Rate limiting & security hardening
- [ ] Seed data for all 8 divisions and 64 districts

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

## 📄 License

This project is licensed under the ISC License.

---

<p align="center">
  Made with ❤️ for exploring the beauty of Bangladesh
</p>

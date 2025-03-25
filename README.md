# Image Bidding System

## Overview

The **Image Bidding System** is a web-based application that allows users to upload images, place bids on images, and manage auction-like functionality. The system has two primary roles:

- **Admin**: Uploads images and assigns them to customers.
- **Customer**: Views assigned images and places bids.

## Features

- User authentication (Admin & Customer roles)
- Image upload functionality with metadata (title, description, starting price, etc.)
- Bidding system with timestamped records
- Secure API with token-based authentication
- Responsive UI with React & Material UI

## Tech Stack

- **Frontend**: React.js (Vite), Axios, React Router
- **Backend**: Node.js (Express.js), SQLite3
- **Database**: SQLite3
- **Authentication**: JWT-based authentication

## Installation

### Prerequisites

Ensure you have the following installed:

- Node.js (v16+ recommended)
- SQLite3

### Clone the Repository

```bash
git clone https://github.com/your-username/image-bidding-system.git
cd image-bidding-system
```

### Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the backend server:
   ```bash
   npm start
   ```
   The server will start on `http://localhost:5000`.

### Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`.

## API Endpoints

### Authentication

- `POST /auth/login` – Logs in a user and returns a JWT token.
- `POST /auth/signup` – Registers a new user.

### Admin Routes

- `POST /admin/upload/image` – Uploads an image and assigns it to a customer.
- `GET /admin/images` – Retrieves all uploaded images.

### Customer Routes

- `GET /customer/assigned/images` – Fetches images assigned to a customer.
- `POST /customer/place-bid` – Places a bid on an image.

## Usage

1. **Sign up/Login** as an Admin or Customer.
2. **Admin** uploads images and assigns them to customers.
3. **Customers** can view assigned images and place bids.
4. Bids are stored with timestamps and can be fetched for analytics.

## Folder Structure

```
image-bidding-system/
│-- backend/                     # Backend server built with Node.js and Express
│   │-- db/                       # Directory for database-related files (migrations, models, etc.)
│   │-- routes/                   # API route handlers
│   │-- authentications/          # Authentication-related logic (e.g., JWT handling)
│   │-- middlewares/              # Express middleware functions (e.g., auth verification)
│   │-- uploads/                  # Directory for storing uploaded images
│   │-- app.js                    # Main backend entry point and server setup
│   └── database.sqlite           # SQLite database file
│
│-- frontend/                     # Frontend built with React.js
│   └── src/                       # React source files
│       │-- assets/                # Static assets (images, icons, etc.)
│       │-- components/            # Reusable UI components
│       │-- context/               # Context API for global state management
│       │-- routes/                # Route definitions for different pages
│       │-- services/              # API calls and external service integrations
│       │-- Layout.jsx             # Main layout component wrapping pages
│       │-- main.jsx               # React entry point for rendering App
│       │-- App.jsx                # Main application component containing routes
│       └── App.css                # Global styles for the React app
│   └── index.js                   # Mounts and renders the React app
│
└── README.md                      # Documentation for the project

```

## License

This project is licensed under the MIT License.

## Author

Developed by **Adil Saleem**.

---

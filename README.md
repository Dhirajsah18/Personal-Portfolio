# Dhiraj Kumar Sah — Portfolio & Admin CMS

A modern, full-stack personal portfolio and content management system built with the MERN stack. Features a responsive, glassmorphic UI and a protected administrative dashboard for managing projects, skills, and resume assets in real time.

---

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Lucide React
- **Backend:** Node.js, Express.js, JWT Authentication
- **Database:** MongoDB Atlas, Mongoose
- **Deployment:** Vercel (Frontend), Render (Backend)

---

## Features

- **Modern Interface:** Glassmorphic dark-theme UI with responsive layouts and smooth micro-interactions.
- **Admin Dashboard:** Secure JWT authentication to create, update, and manage projects and skills dynamically.
- **Dynamic Resume Management:** Upload, preview, and serve resumes with integrated download analytics.
- **Optimized Performance:** WebP asset delivery, HTTP compression, and optimized API payloads.
- **Visitor Analytics:** Lightweight tracking for site visits and resume downloads.

---

## Project Structure

```
├── client/     # Frontend application (React + Vite + Tailwind CSS)
└── server/     # Backend REST API (Node.js + Express + MongoDB)
```

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- MongoDB connection string (Local or MongoDB Atlas)

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/Dhirajsah18/Personal-Portfolio.git
cd Personal-Portfolio

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Environment Variables

**Server (`server/.env`):**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
```

### 3. Running Locally

You can run both client and server concurrently from the root directory:

```bash
# Start both frontend and backend together
npm run dev

# Or run them individually:
npm run server  # Start backend only
npm run client  # Start frontend only
```

---

## Deployment

- **Frontend:** Deployed on [Vercel](https://vercel.com/)
- **Backend:** Deployed on [Render](https://render.com/)

---

## Contact

**Dhiraj Kumar Sah**
- Portfolio: [dhirajsah18.vercel.app](https://dhirajsah18.vercel.app/)
- LinkedIn: [linkedin.com/in/dhirajsah18](https://www.linkedin.com/in/dhirajsah18/)


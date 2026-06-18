# Review Book 📚

Review Book is a full-stack web application that allows users to discover stores and submit ratings ranging from 1 to 5. It features a robust role-based access control system, providing tailored experiences for System Administrators, Store Owners, and Normal Users.

The platform is designed with a warm, creamy aesthetic, smooth Framer Motion animations, and a fully mobile-responsive UI.

## Features by Role

### 🛡️ System Administrator
- **Dashboard:** Overview of total users, stores, and submitted ratings.
- **Manage Users:** Add new users, view the user list with filtering and sorting, and see user details.
- **Manage Stores:** Add new stores and optionally assign a store owner. View the store list with filtering and sorting.

### 🏪 Store Owner
- **Store Dashboard:** View store details, average rating, total reviews, and a categorized rating status (e.g., Excellent, Good, Needs Work).
- **Customer Reviews:** See a detailed list of all ratings submitted by users for their store.
- **Account:** Change password.

### 👤 Normal User
- **Discover:** Browse a grid of registered stores, searchable by name and address.
- **Rate:** Submit, view, and modify star ratings (1-5) for any store.
- **Account:** Register a new account and change password.

---

## Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **Routing:** React Router v6
- **Styling:** Custom CSS Variables (warm creamy palette)
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **HTTP Client:** Axios

### Backend
- **Framework:** Node.js + Express
- **Database:** PostgreSQL
- **ORM:** Prisma v7 (with `@prisma/adapter-pg`)
- **Authentication:** JWT (JSON Web Tokens) & bcryptjs

---

## Project Setup Guide

Follow these steps to get the project running locally.

### Prerequisites
- [Node.js](https://nodejs.org/) (v20+ recommended for Prisma v7 compatibility)
- [PostgreSQL](https://www.postgresql.org/) database server running locally or remotely.

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd review-book
```

### 2. Backend Setup
Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Set up environment variables:
Create a `.env` file in the `backend` directory and add your PostgreSQL connection string and a JWT secret.
```env
DATABASE_URL="postgresql://<username>:<password>@localhost:5432/review_book?schema=public"
JWT_SECRET="your_super_secret_jwt_key_here"
```
*(Replace `<username>` and `<password>` with your actual PostgreSQL credentials.)*

Run database migrations:
```bash
npx prisma migrate dev --name init
```

Seed the database with the default System Administrator:
```bash
node seed.js
```
*This creates an admin account:*
- **Email:** `admin@reviewbook.com`
- **Password:** `Admin@123`

Start the backend server:
```bash
npm run dev
```
*The server will start on `http://localhost:5000`.*

### 3. Frontend Setup
Open a new terminal window and navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the frontend development server:
```bash
npm run dev
```
*The application will open in your browser, typically at `http://localhost:5173`.*

---

## Security & Validation
- **Passwords:** Must be 8–16 characters long and include at least one uppercase letter and one special character.
- **Names:** Must be between 20 and 60 characters.
- **Addresses:** Limited to 400 characters.
- **Role-based Routing:** Protected routes ensure users only access pages authorized for their role. API routes are protected by JWT middleware.

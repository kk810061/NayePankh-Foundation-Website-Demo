# NayePankh Foundation - Management System 🕊️

This is a **Full-Stack MERN Application** built as a submission for an internship selection process. It is a comprehensive system designed to manage volunteers, programs, and program applications for the NayePankh Foundation.

## 🔗 Demo

- **Live URL**: https://naye-pankh-foundation-website-demo.vercel.app

## 📸 Screenshots

<img width="1807" height="911" alt="image" src="https://github.com/user-attachments/assets/99f50186-d724-444c-90cc-a5f0a82c1fdd" />

<img width="1820" height="922" alt="image" src="https://github.com/user-attachments/assets/ee7a09fc-935b-44e3-a757-cf125b23c158" />

<img width="1821" height="917" alt="image" src="https://github.com/user-attachments/assets/7adbba51-90d9-4bdf-a4c3-a77f0c6e034b" />

<img width="1822" height="922" alt="image" src="https://github.com/user-attachments/assets/0bc1e680-214c-4804-920d-1d09e618de34" />

<img width="1842" height="912" alt="image" src="https://github.com/user-attachments/assets/4b01c24e-18c4-4109-a5fc-f4c50a870678" />

<img width="1836" height="912" alt="image" src="https://github.com/user-attachments/assets/e9d1ce70-b693-423a-bce9-b8b0882e0463" />



## 🚀 Features

- **Robust Authentication & Authorization**: Secure JWT-based authentication.
- **Role-Based Access Control**: Distinct dashboards and flows for Admins and Volunteers.
- **Volunteer Registration Flow**: Users can register as volunteers and await admin approval.
- **Program Management**: Admins have full CRUD (Create, Read, Update, Delete) capabilities for charity programs.
- **Application System**: Approved volunteers can browse and apply to active programs.
- **Interactive Admin Dashboard**: Admins can easily approve/reject volunteers, review applications, and view statistics via beautifully designed charts.
- **Advanced Data Handling**: Backend pagination, status filtering, and dynamic time-based sorting.
- **Premium UI/UX**: Built with React and TailwindCSS, featuring a modern glassmorphic design, smooth micro-animations, and custom toast notifications.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), TailwindCSS, React Router DOM, Recharts (for analytics), Axios.
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JSON Web Tokens (JWT), bcryptjs.

## 🔐 Admin Access

For security purposes, the ability to select an "Admin" role is not exposed on the public registration page. A seeded admin user is already present in the database to allow you to review the administrative features.

**Admin Login Credentials:**
- **Email:** `admin@gmail.com`
- **Password:** `admin123`

## ⚙️ Local Setup

Follow these instructions to run the project locally.

### 1. Database Configuration
Ensure you have MongoDB installed and running, or have a MongoDB Atlas connection string.

### 2. Backend Setup
1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory and add the following variables:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   JWT_LIFETIME=30d
   ```
4. Start the backend server:
   ```bash
   npm start
   ```
   *(The server will run on `http://localhost:5000`)*

### 3. Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *(The app will be accessible at `http://localhost:5173`)*

## 💡 Usage Guide

- **Admin Flow**: Log in using the admin credentials. You will be greeted by the control center where you can manage pending volunteers, approve applications, and create new programs for volunteers to participate in.
- **Volunteer Flow**: Register a new account, log in, and fill out your volunteer profile. Once an admin approves your profile, your dashboard will unlock, allowing you to browse and apply for active programs!

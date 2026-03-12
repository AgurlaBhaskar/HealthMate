# HealthMate 🏥

HealthMate is a comprehensive MERN (MongoDB, Express, React, Node.js) stack application designed for personal health and fitness tracking. Users can log their meals, track physical activities, and manage medical appointments through a modern, responsive interface.

## ✨ Features

- **Dashboard**: High-level overview of calories, protein, and water intake.
- **Diet Tracking**: Log meals and monitor nutritional data.
- **Fitness Tracking**: Record physical activities and duration.
- **Appointments**: Manage and book health-related appointments.
- **Admin Panel**: Control terminal for managing system data (Admin access required).
- **Authentication**: Secure JWT-based login and registration.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB](https://www.mongodb.com/) (Local instance or Atlas)

### Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd HealthMate
   ```

2. **Install dependencies**:
   Install root, backend, and frontend dependencies:
   ```bash
   npm install
   npm install --prefix backend
   npm install --prefix frontend
   ```

3. **Environment Setup**:
   Create a `.env` file in the `backend/` directory:
   ```bash
   touch backend/.env
   ```
   Copy the contents from `backend/.env.example` and fill in your details:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_secret
   ```

4. **Run the application**:
   From the root directory, run both frontend and backend concurrently:
   ```bash
   npm run dev
   ```

## 🛠️ Built With

- **Frontend**: Vite, React, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Styling**: Vanilla CSS, Modern Design Systems

## 👤 Author

[Your Name/GitHub Profile]

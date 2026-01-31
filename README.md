# ElevateConnect

A comprehensive **College Placement Management System** that bridges the gap between students and campus placement opportunities.

## 🎯 Features

### For Students
- View and apply to placement drives
- Track application status (Applied → Shortlisted → Interviewed → Selected/Rejected)
- Rejection analysis with personalized improvement suggestions
- Profile management (resume, skills, CGPA)
- Analytics dashboard

### For Admins/TPO
- Create and manage placement drives
- View application statistics
- Analytics dashboard

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite, TailwindCSS, Framer Motion |
| **Backend** | Node.js, Express 5, Sequelize ORM |
| **Database** | MySQL |
| **Auth** | JWT + bcrypt |

## 📁 Project Structure

```
CDAC-Project/
├── src/                    # Frontend source
│   ├── components/         # Reusable UI components
│   ├── context/            # React context (Auth)
│   ├── pages/              # Page components
│   └── services/           # API service layer
├── backend/                # Backend source
│   ├── config/             # Database configuration
│   ├── controllers/        # Route handlers
│   ├── middleware/         # Auth middleware
│   ├── models/             # Sequelize models
│   └── routes/             # API routes
└── _prototypes/            # Design prototypes
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MySQL Server

### Setup

1. **Create the MySQL database:**
   ```sql
   CREATE DATABASE elevate_connect;
   ```

2. **Configure environment:**
   Edit `backend/.env` with your MySQL credentials:
   ```env
   DB_PASSWORD=your_password
   ```

3. **Install dependencies:**
   ```bash
   npm install
   cd backend && npm install
   ```

4. **Start the backend** (runs on port 8084):
   ```bash
   cd backend
   npm run dev
   ```

5. **Start the frontend** (runs on port 5173):
   ```bash
   npm run dev
   ```

6. **Seed sample data** (optional):
   ```bash
   cd backend
   node seeder.js
   ```

## 📡 API Endpoints

| Endpoint | Description |
|----------|-------------|
| `POST /api/auth/register` | User registration |
| `POST /api/auth/login` | User login |
| `GET /api/drives` | List placement drives |
| `POST /api/drives` | Create drive (Admin) |
| `GET /api/applications` | Get user applications |
| `POST /api/applications` | Apply to a drive |
| `GET /api/analytics` | Dashboard analytics |

## 👥 User Roles

- **STUDENT** - Apply to drives, view analytics
- **ADMIN** - Manage drives, view all applications
- **TPO** - Training & Placement Officer
- **ALUMNI** - Mentorship
- **HR** - Company representatives

## 📄 License

MIT

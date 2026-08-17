# 🚀 TaskFlow — Full-Stack Task & Project Management Application

TaskFlow is a modern, responsive, full-stack task management web application designed to help individuals and teams organize, track, and complete tasks with high efficiency.

---

## 🏗️ Architecture

```
             USER
               │
               ▼
        ┌─────────────┐
        │    React    │  • React 18 & Vite (Port 3000)
        │  Frontend   │  • Context API State Management
        └──────┬──────┘  • Modern Design System & Lucide Icons
               │
          RESTful API (JSON / JWT Bearer Tokens)
               │
               ▼
        ┌─────────────┐
        │    Flask    │  • Python Flask (Port 5000)
        │   Backend   │  • JWT Auth & Werkzeug Security
        └──────┬──────┘  • Modular Blueprints & CORS
               │
               ▼
        ┌─────────────┐
        │    MySQL    │  • MySQL / SQLite Relational Database
        │  Database   │  • Foreign Keys, Cascades & Query Indexes
        └─────────────┘
```

---

## ✨ Features

### 👤 1. Authentication & Security
- **JWT Authentication**: Secure token-based session handling with Bearer authorization headers.
- **Password Hashing**: Werkzeug secure salt generation & verification.
- **1-Click Demo Login**: Pre-configured with demo user `demo@taskflow.dev` (`password123`).
- **Profile Management**: Update display name and change password securely.

### 📋 2. Comprehensive Task Management (CRUD)
- **Create, Read, Update, Delete**: Intuitive task creation modal with real-time field validation.
- **Priority Levels**: `urgent` (red), `high` (orange), `medium` (blue), `low` (green).
- **Due Date Tracking**: Relative due dates (`Due today`, `Due tomorrow`, `Overdue by Xd`).
- **Status Lifecycle**: `pending` (To Do), `in_progress`, and `completed`.

### 🏷️ 3. Dynamic Categories
- Built-in categories: **Work**, **Study**, **Personal**, **Project**, and **Other**.
- Custom Category Creator: Add new custom categories with custom color swatches.
- Instant category task counter badges.

### 🗂️ 4. Interactive 3-Column Kanban Board
- Visual columns: **TO DO**, **IN PROGRESS**, **COMPLETED**.
- **HTML5 Drag & Drop**: Drag task cards between columns with instant backend status synchronization.
- Quick task creation directly within specific columns.

### 📝 5. Actionable Subtasks (Phase 2 MVP+)
- Break tasks into step-by-step subtasks.
- Interactive checklist toggles with visual strikethrough.
- Real-time percentage progress bar on task cards and modals.

### 🔎 6. Live Search & Multi-Criteria Filtering
- **Live Search**: Instant keyword search across task titles and descriptions.
- **Filter Toolbar**: Combine Status, Priority, and Category filters simultaneously.
- **Sorting**: Sort by Date Created, Due Date, Priority, or Title.
- **View Toggle**: Switch between responsive **Grid View** and compact **List View**.

### 📊 7. Real-Time Dashboard & Analytics
- **KPI Metrics**: Total tasks, Completed, In Progress, To Do, and Overdue watch.
- **Visual Progress Tracker**: Overall completion percentage and subtask velocity.
- **Priority & Category Distributions**: Colored breakdown bars.
- **Notifications**: Automatic bell alerts for overdue items and tasks due within 48 hours.

---

## 🗄️ Database Design

### Database Schema

```
Users (users)
├── id (INT PRIMARY KEY AUTO_INCREMENT)
├── name (VARCHAR(100))
├── email (VARCHAR(120) UNIQUE)
├── password_hash (VARCHAR(255))
└── created_at (TIMESTAMP)

Categories (categories)
├── id (INT PRIMARY KEY AUTO_INCREMENT)
├── name (VARCHAR(50))
├── color (VARCHAR(20))
├── user_id (INT FOREIGN KEY -> users.id ON DELETE CASCADE)
└── created_at (TIMESTAMP)

Tasks (tasks)
├── id (INT PRIMARY KEY AUTO_INCREMENT)
├── title (VARCHAR(200))
├── description (TEXT)
├── status (VARCHAR(20) DEFAULT 'pending')
├── priority (VARCHAR(20) DEFAULT 'medium')
├── due_date (DATE)
├── user_id (INT FOREIGN KEY -> users.id ON DELETE CASCADE)
├── category_id (INT FOREIGN KEY -> categories.id ON DELETE SET NULL)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

Subtasks (subtasks)
├── id (INT PRIMARY KEY AUTO_INCREMENT)
├── title (VARCHAR(200))
├── completed (TINYINT(1) DEFAULT 0)
├── task_id (INT FOREIGN KEY -> tasks.id ON DELETE CASCADE)
└── created_at (TIMESTAMP)
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python 3.6+**
- **Node.js 18+** & **npm**
- *(Optional)* **MySQL Server** (SQLite is enabled out-of-the-box with zero configuration)

---

### Step 1: Start the Backend (Flask)

```bash
cd backend

# 1. Install dependencies (if not already installed)
python -m pip install -r requirements.txt

# 2. Seed demo data (creates demo user: demo@taskflow.dev / password123)
python seed.py

# 3. Run Flask server (starts on http://localhost:5000)
python app.py
```

#### MySQL Connection (Optional)
To use your local MySQL database:
1. Open MySQL Workbench or MySQL CLI and run `mysql_schema.sql`.
2. Configure environment variables in PowerShell:
   ```powershell
   $env:DB_TYPE="mysql"
   $env:MYSQL_HOST="localhost"
   $env:MYSQL_USER="root"
   $env:MYSQL_PASSWORD="your_password"
   $env:MYSQL_DB="taskflow"
   ```
3. Run `python seed.py` and `python app.py`.

---

### Step 2: Start the Frontend (React + Vite)

```bash
cd ../frontend

# 1. Install dependencies
npm install

# 2. Start Vite dev server (starts on http://localhost:3000)
npm run dev
```

Open your browser and navigate to: **`http://localhost:3000`**

---

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Demo User (Alex Morgan)** | `demo@taskflow.dev` | `password123` |

*(You can also use the 1-Click "Quick Demo" button on the Landing and Login pages!)*

---

## 📡 REST API Reference

### Authentication
- `POST /api/auth/register` — Register a new account
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET  /api/auth/me` — Get current authenticated user profile
- `PUT  /api/auth/profile` — Update display name
- `PUT  /api/auth/password` — Change password

### Tasks
- `GET    /api/tasks` — List tasks (supports `?status=&priority=&category_id=&search=&sort_by=&order=`)
- `POST   /api/tasks` — Create task with optional subtasks
- `GET    /api/tasks/<id>` — Get single task with nested subtasks
- `PUT    /api/tasks/<id>` — Update task details
- `PATCH  /api/tasks/<id>/status` — Fast status update (for Kanban drag & drop)
- `DELETE /api/tasks/<id>` — Delete task and subtasks

### Subtasks
- `GET    /api/tasks/<id>/subtasks` — Get subtasks for a task
- `POST   /api/tasks/<id>/subtasks` — Add new subtask
- `PATCH  /api/subtasks/<id>/toggle` — Toggle subtask completion (0 ↔ 1)
- `DELETE /api/subtasks/<id>` — Delete subtask

### Categories
- `GET    /api/categories` — List user categories with task counts
- `POST   /api/categories` — Create category with custom color
- `DELETE /api/categories/<id>` — Delete custom category

### Analytics
- `GET /api/analytics/stats` — Real-time productivity metrics and distributions

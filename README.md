# SkillSetu

# 🌉 SkillSetu – Peer-to-Peer Skill Exchange Platform

SkillSetu is a full-stack MERN web application that enables users to exchange skills with each other without using money. Users can showcase the skills they offer, discover skills they want to learn, connect with peers, and collaborate through a modern and interactive platform.

> 💡 Learn what you want. Teach what you know.

---

## 🚀 Features

- 👤 User Authentication (JWT-based)
- 🔐 Role-Based Access Control
- 🧠 Add Skills You Offer
- 🎯 Add Skills You Want to Learn
- 🔍 Search & Match Users by Skills
- 🤝 Skill Exchange Requests
- ✅ Accept / Reject Requests
- 💬 Real-Time Chat & Messaging
- 📅 Session Scheduling System
- ⭐ Ratings & Reviews
- 📊 User Dashboard
- 🛠️ Admin Dashboard & Analytics
- 🔐 Secure Password Hashing (bcrypt)
- 🌐 RESTful API Architecture
- 📱 Fully Responsive UI
- ✨ Smooth Animations with Framer Motion

---

## 🏗️ Tech Stack

### Frontend

- React.js
- Redux Toolkit
- React Router DOM
- Axios
- Tailwind CSS
- Framer Motion
- Socket.io Client
- Vite

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt.js
- Multer
- Socket.io

---

## 📂 Project Structure

```bash
SkillSetu-FullStack/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── server.js
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── assets/
│   │   └── App.jsx
│   │
│   └── vite.config.js
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/shashankjai/SkillSetu-FullStack.git

cd SkillSetu-FullStack
```

---

## 📦 Backend Setup

```bash
cd backend

npm install
```

### Create `.env` file inside backend:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

ADMIN_EMAIL=your_admin_email

ADMIN_PASSWORD=your_admin_password
```

### Run Backend Server

```bash
npm start
```

---

## 💻 Frontend Setup

```bash
cd client

npm install

npm run dev
```

Frontend will run on:

```bash
http://localhost:5173
```

---

## 🔄 How It Works

1. User registers and logs in.

2. User adds:
   - Skills they can teach
   - Skills they want to learn

3. Platform intelligently matches users based on complementary skills.

4. Users send skill exchange requests.

5. Upon acceptance, users collaborate through chat and scheduled sessions.

6. Users can review and rate each other after sessions.

---

## 📡 API Endpoints (Sample)

### Auth Routes

```http
POST /api/auth/register

POST /api/auth/login
```

### User Routes

```http
GET /api/users

GET /api/users/:id

PUT /api/users/profile
```

### Exchange Routes

```http
POST /api/exchange/request

PUT /api/exchange/:id/accept

PUT /api/exchange/:id/reject
```

### Chat Routes

```http
POST /api/messages

GET /api/messages/:chatId
```

---

## 🔐 Environment Variables

| Variable         | Description                         |
|------------------|-------------------------------------|
| PORT             | Backend server port                 |
| MONGO_URI        | MongoDB connection string           |
| JWT_SECRET       | Secret key for JWT tokens           |
| ADMIN_EMAIL      | Admin login email                   |
| ADMIN_PASSWORD   | Admin login password                |

---

## 📱 Responsive Design

- Mobile Friendly
- Tablet Optimized
- Desktop Responsive
- Smooth UI Animations
- Modern Gradient Backgrounds

---

## 🌟 Future Enhancements

- 🤖 AI-Based Skill Matching
- 📹 Video Calling Integration
- 🔔 Real-Time Notifications
- 🌍 Public User Profiles
- ☁️ Cloud Storage Integration
- 🚀 Deployment on AWS / Vercel / Render

---

## 👨‍💻 Author

**Shashank Jaiswal**  
B.Tech IT | NIT Raipur  
Aspiring Full Stack Developer

---

## 📄 License

This project is licensed under the MIT License.

---

## 🌐 GitHub Repository

https://github.com/shashankjai/SkillSetu-FullStack
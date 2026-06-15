# Social Network (Media Sharing Platform)

## 📌 Description
A full-stack social network application for sharing media content (images/videos), with authentication, subscriptions, likes, comments, and personalized feed.

---

## ⚙️ Tech Stack

### Frontend
- React v19.2
- TypeScript v6.0
- Vite
- React Router
- Redux
- Material UI

### Backend
- NestJS
- JWT (access + refresh tokens)

### Database
- MongoDB
- Mongoose

### DevOps
- Docker (MongoDB container)

---

## 🚀 Features

- User registration & authentication
- JWT + Google OAuth login
- Create posts (images/videos/text)
- Likes & comments system
- Follow/unfollow users
- Feed based on subscriptions
- Private profiles
- User search by username
- Pagination for all lists
- Profile management

---

## 🧑‍💻 How to Run Locally

### 1. Start MongoDB (Docker)
```bash
docker-compose up -d
```
### 2. Backend (NestJS)
```bash
cd backend
npm install
npm run start:dev
```
### 3. Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

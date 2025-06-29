# 🏃‍♂️ Marathon Management System - Backend (Runners.bd API)

This is the backend service for **Runners.bd**, a web-based Marathon Management System. It provides RESTful API endpoints for managing marathons, user registrations, and reviews - all secured with Firebase authentication and powered by Express and MongoDB.

## 🔗 [Live Client Site](https://marathon-management-syst-f546e.web.app)
## 🚀 [Live API (Vercel)](https://batch11-assignment-11-serve-side.vercel.app)

---

## 📌 Features

* 🗂 **Marathon Event Management** – Create, update, delete marathon events (organizers only).
* 📝 **User Registration System** – Runners can register for marathons with personalized data.
* ⭐ **Review System** – Submit and view public reviews for marathons.
* 🔐 **Firebase Authentication** – Role-based route protection for secure user data handling.
* 🔍 **Filtered Endpoints** – Easily retrieve your own events or applications using your email.
* 📊 **Dynamic User Dashboards** – User-specific data for runners and organizers.
* 📆 **Real-time Countdown Support** – Dynamic timers on marathon events.
* 🌐 **Deployed on Vercel** – Serverless and production-ready.

---

## 🏗️ Project Structure

```
📁 root/
├── index.js                     # Main Express server file
├── .env                         # Environment configuration
├── .gitignore                   # Git ignore rules
├── vercel.json                  # Vercel deployment config
├── firebase-admin-service-key.json (ignored)
├── package.json
```

---

## 🧠 System Architecture

### 🧱 Layers

* **Frontend**: React SPA hosted on Firebase
* **Backend**: Node.js + Express API
* **Database**: MongoDB Atlas
* **Authentication**: Firebase Admin SDK

### 🗃️ MongoDB Collections

| Collection               | Purpose                | Key Fields                                                   |
| ------------------------ | ---------------------- | ------------------------------------------------------------ |
| `marathonsCollection`    | Marathon event details | `title`, `location`, `distance`, `marathonDate`, `createdBy` |
| `registrationCollection` | Marathon applications  | `marathonId`, `applicantEmail`                               |
| `reviewCollection`       | Public reviews         | `rating`, `review`, `user`, `photo`                          |

---

## 🔐 Authentication Flow

1. Frontend sends request with Bearer token
2. Backend verifies token with Firebase Admin SDK
3. Middleware attaches `decoded.email` to request
4. Route uses email match check to validate access

```txt
Client → Bearer Token
→ verifyFirebaseToken Middleware
→ Access Granted / Denied
```

---

## 🚀 API Overview

| Endpoint                     | Method | Auth | Description                       |
| ---------------------------- | ------ | ---- | --------------------------------- |
| `/marathons`                 | GET    | ❌    | Fetch all marathons               |
| `/marathons/:id`             | GET    | ✅    | Get a marathon by ID              |
| `/my-marathons?email=`       | GET    | ✅    | Get logged-in user's events       |
| `/my-applications?email=`    | GET    | ✅    | Get logged-in user's applications |
| `/applications/marathon/:id` | GET    | ✅    | Get applicants for a marathon     |
| `/marathons`                 | POST   | ✅    | Create a new marathon             |
| `/registrations`             | POST   | ✅    | Apply to a marathon               |
| `/reviews`                   | GET    | ❌    | Fetch all reviews                 |
| `/reviews`                   | POST   | ✅    | Submit a review                   |
| `/marathons/:id`             | PUT    | ✅    | Update marathon details           |
| `/applications/:id`          | PUT    | ✅    | Update user application           |
| `/marathons/:id`             | DELETE | ✅    | Delete a marathon                 |
| `/applications/:id`          | DELETE | ✅    | Delete a registration             |

---

## ⚙️ Technology Stack

| Layer            | Tech Used           |
| ---------------- | ------------------- |
| Server Framework | Express.js `^5.1.0` |
| Database         | MongoDB Atlas       |
| Authentication   | Firebase Admin SDK  |
| Deployment       | Vercel              |
| Security         | CORS `^2.8.5`       |
| Env Config       | dotenv `^16.5.0`    |

---

## 📦 Dependencies

```json
{
  "express": "^5.1.0",
  "cors": "^2.8.5",
  "dotenv": "^16.5.0",
  "firebase-admin": "^13.4.0",
  "mongodb": "^6.17.0"
}
```

---

## 🛠️ Local Setup Guide

1. Clone the repo:

```bash
git clone https://github.com/yourusername/runners.bd-api.git
```

2. Install dependencies:

```bash
npm install
```

3. Add `.env` file:

```env
DB_USER=your_db_user
DB_PASS=your_db_pass
PORT=3000
```

4. Add `firebase-admin-service-key.json` in root (not committed).

5. Run the server:

```bash
npm run dev
```

---

## 🧪 Deployment Config

**vercel.json**:

```json
{
  "version": 2,
  "builds": [
    { "src": "index.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "/index.js" }
  ]
}
```

---

## 🧼 Git Ignore Setup

```
node_modules
.env
firebase-admin-service-key.json
.vercel
```

---

## 🌐 Relevant Links

* 🔗 **Live Site (Frontend):** [Runners.bd on Firebase](https://marathon-management-syst-f546e.web.app)
* ⚙️ **Live API (Vercel):** [Runners.bd API](https://batch11-assignment-11-serve-side.vercel.app)
* 💻 **Frontend GitHub Repo:** [github.com/yeasin-islam/runners.bd-client](https://github.com/yeasin-islam/Runners.bd)
* 🔧 **Backend GitHub Repo:** [github.com/yeasin-islam/runners.bd-server](https://github.com/yeasin-islam/Runners.bd-server-site)


---

## 🤝 Contribution

Feel free to fork, raise issues or open PRs to contribute!

---

> Built for modern marathoners. Backend of [Runners.bd](https://marathon-management-syst-f546e.web.app)

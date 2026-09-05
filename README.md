# 🎵 Song Manager — Backend API

A RESTful backend service for managing a music library, built with **Node.js, Express.js, TypeScript, MongoDB, and Mongoose**.

The API provides complete CRUD functionality for songs, search and filtering capabilities, and statistical endpoints for analyzing the music collection.

## 📦 Repository

**Backend Repository:**
https://github.com/Ekhlas61/song-manager-backend

**Frontend Repository:**
https://github.com/Ekhlas61/Song-manager-Frontend

## 🌐 Deployed API

**Production Backend:**
https://song-manager-backend-2.onrender.com

---

## ✨ Features

### 🎶 Song CRUD

The API supports:

* Create songs
* Retrieve all songs
* Retrieve a single song
* Update songs
* Delete songs

Each song contains:

* Title
* Artist
* Album
* Genre

### 🔎 Search & Filtering

Songs can be filtered using:

* Genre
* Artist
* Album

The API also supports searching across:

* Song title
* Artist
* Album

### 📊 Statistics

The backend provides statistics for the music collection, including:

* Total songs
* Total artists
* Total albums
* Total genres
* Songs per genre
* Songs and albums per artist
* Songs per album

### ✅ Validation

The API includes validation for:

* Required fields
* Empty or whitespace-only values
* Invalid MongoDB ObjectIds
* Missing resources
* Invalid requests

### 🛡️ Error Handling

Centralized error-handling middleware is used to provide consistent API error responses.

### 🐳 Docker

The backend includes Docker support for containerized development and deployment.

---

## 🛠️ Technologies

* **Node.js**
* **Express.js**
* **TypeScript**
* **MongoDB**
* **Mongoose**
* **Docker**
* **Docker Compose**
* **CORS**
* **Morgan**
* **dotenv**

---

## 📁 Project Structure

```text
backend/
├── src/
│   ├── config/
│   │   └── db.ts
│   │
│   ├── models/
│   │   └── Song.ts
│   │
│   ├── controllers/
│   │   └── songController.ts
│   │
│   ├── routes/
│   │   └── songRoutes.ts
│   │
│   ├── middleware/
│   │   └── errorHandler.ts
│   │
│   └── index.ts
│
├── .env
├── Dockerfile
├── docker-compose.yml
├── package.json
├── package-lock.json
└── tsconfig.json
```

---

## 🔗 API Endpoints

### Songs

| Method   | Endpoint           | Description          |
| -------- | ------------------ | -------------------- |
| `GET`    | `/api/songs`       | Get all songs        |
| `GET`    | `/api/songs/:id`   | Get a song by ID     |
| `POST`   | `/api/songs`       | Create a song        |
| `PUT`    | `/api/songs/:id`   | Update a song        |
| `DELETE` | `/api/songs/:id`   | Delete a song        |
| `GET`    | `/api/songs/stats` | Get music statistics |

---

## 📝 Song Object

Example:

```json
{
  "title": "Blinding Lights",
  "artist": "The Weeknd",
  "album": "After Hours",
  "genre": "Pop"
}
```

---

## 🔎 Filtering and Search

The songs endpoint supports query parameters for filtering and searching.

Examples:

```text
GET /api/songs?genre=Pop
```

```text
GET /api/songs?artist=The%20Weeknd
```

```text
GET /api/songs?album=After%20Hours
```

```text
GET /api/songs?search=Blinding
```

---

## 📊 Statistics Endpoint

```text
GET /api/songs/stats
```

The endpoint returns information such as:

```text
Total Songs
Total Artists
Total Albums
Total Genres
Songs Per Genre
Artist Statistics
Songs Per Album
```

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Ekhlas61/song-manager-backend.git
```

### 2. Navigate to the project

```bash
cd song-manager-backend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

Add any other environment variables required by the project configuration.

### 5. Start development server

```bash
npm run dev
```

---

## 🏗️ Build

Compile the TypeScript project:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

---

## 🐳 Running with Docker

Build the Docker image:

```bash
docker compose build
```

Start the containers:

```bash
docker compose up
```

Stop the containers:

```bash
docker compose down
```

The backend API will be available through the configured port.

---

## 🔄 Architecture

```text
Client / Frontend
       │
       ▼
REST API
       │
       ▼
Express.js
       │
       ▼
Routes
       │
       ▼
Controllers
       │
       ▼
Mongoose Models
       │
       ▼
MongoDB
```

---

## 🌐 Production

The backend is deployed on **Render**.

Production API:

https://song-manager-backend-2.onrender.com

The frontend consumes this API to perform song management and statistics operations.

---

## 🔐 Environment Variables

Environment variables should be configured locally and should **never be committed to the repository**.

Example:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

---

## 👨‍💻 Author

**Ekhlas Abdulmelik**

GitHub:
https://github.com/Ekhlas61

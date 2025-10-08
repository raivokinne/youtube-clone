# YouTube Clone

A full-stack YouTube clone application built with Laravel (backend API) and React (frontend client). This project replicates core YouTube functionality including video upload, streaming, user authentication, comments, likes, and subscriptions.

## 🚀 Features

### User Features

- **User Authentication** - Register, login, and logout functionality
- **Video Upload** - Upload videos with title, description, and thumbnail
- **Video Streaming** - Watch videos with a custom video player
- **Video Management** - Edit and delete your own videos
- **Search Functionality** - Search videos by title and description
- **Likes & Dislikes** - Like or dislike videos
- **Comments** - Comment on videos and view other users' comments

## 🛠️ Tech Stack

### Backend (API)

- **Framework:** Laravel 10.x
- **Database:** MySQL
- **Authentication:** Laravel Sanctum / JWT
- **File Storage:** Laravel Storage (local/S3)
- **Video Processing:** FFmpeg

### Frontend (Client)

- **Framework:** React 18.x
- **Routing:** React Router
- **HTTP Client:** Axios
- **UI Components:** Tailwind CSS
- **Video Player:** Video.js / React Player

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- PHP >= 8.1
- Composer
- Node.js >= 16.x
- npm or yarn
- MySQL >= 5.7
- FFmpeg (for video processing)

## 🔧 Installation

### Backend Setup

1. **Clone the repository**

```bash
git clone https://github.com/raivokinne/youtube-clone.git
cd youtube-clone
```

2. **Navigate to backend directory**

```bash
cd backend
```

3. **Install PHP dependencies**

```bash
composer install
```

4. **Create environment file**

```bash
cp .env.example .env
```

5. **Configure your `.env` file**

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=youtube_clone
DB_USERNAME=your_username
DB_PASSWORD=your_password

FILESYSTEM_DISK=local
```

6. **Generate application key**

```bash
php artisan key:generate
```

7. **Run database migrations**

```bash
php artisan migrate
```

8. **Seed database (optional)**

```bash
php artisan db:seed
```

9. **Create storage link**

```bash
php artisan storage:link
```

10. **Start the Laravel development server**

```bash
php artisan serve
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**

```bash
cd ../frontend
```

2. **Install Node dependencies**

```bash
npm install
# or
yarn install
```

3. **Create environment file**

```bash
cp .env.example .env
```

4. **Start the React development server**

```bash
npm run dev
# or
yarn dev
```

The application will open at `http://localhost:3000`

## 📁 Project Structure

```
youtube-clone/
├── backend/                  # Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/  # API Controllers
│   │   │   └── Middleware/   # Custom Middleware
│   │   ├── Models/           # Eloquent Models
│   │   └── Services/         # Business Logic
│   ├── database/
│   │   ├── migrations/       # Database Migrations
│   │   └── seeders/          # Database Seeders
│   ├── routes/
│   │   └── api.php           # API Routes
│   └── storage/              # File Storage
│
└── frontend/                 # React Client
    ├── public/
    ├── src/
    │   ├── components/       # React Components
    │   ├── pages/            # Page Components
    │   ├── utils/            # Utility Functions
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## 🎨 Features Implementation

### Video Upload Process

1. User selects video file and enters metadata
2. Frontend sends multipart form data to backend
3. Backend validates and stores video
4. FFmpeg processes video for different qualities (optional)
5. Thumbnail is generated or uploaded
6. Video becomes available for streaming

### Authentication Flow

1. User registers/logs in
2. Backend generates authentication token (Sanctum/JWT)
3. Token stored in frontend (localStorage/cookies)
4. Token sent with each API request
5. Backend validates token for protected routes

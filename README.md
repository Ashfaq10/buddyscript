# BuddyScript — Social Feed Application

A production-grade full-stack social feed application built for the Appifylab Full Stack Engineer selection task. Converts 3 provided HTML/CSS pages (Login, Registration, Feed) into a working application with authentication, posts, comments, replies, likes, and public/private visibility.

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | Next.js 14 (App Router) | SSR, route protection, modern React patterns |
| **Backend** | Node.js + Express.js | Separate API server = clean architecture |
| **Database** | PostgreSQL | Relational model fits social feed |
| **ORM** | Prisma | Type-safe queries, migrations, connection pooling |
| **Auth** | JWT (access + refresh tokens) | httpOnly cookies — never localStorage |
| **Image Upload** | Multer + Cloudinary | Persistent cloud storage, survives redeploys |
| **Styling** | Bootstrap 5 + Provided CSS | Preserves the exact provided design pixel-perfectly |

---

## Features

| Feature | Details |
|---------|---------|
| **Registration** | First name + last name (side-by-side), email, password — single-page, no scrolling |
| **Login / Logout** | JWT in httpOnly cookies, auto-refresh on expiry |
| **Feed** | Cursor-based pagination, newest posts first |
| **Public posts** | Visible to all logged-in users |
| **Private posts** | Visible only to the author (filtered at API level) |
| **Create post** | Text + optional image upload |
| **Delete own post** | 3-dot menu, 403 if another user tries |
| **Comments** | Add comments, load with "View comments" button |
| **Nested replies** | Reply to a comment, displayed indented |
| **Like posts** | Toggle like/unlike, count updates optimistically |
| **Like comments/replies** | Same toggle behavior |
| **Who liked modal** | Click like count to see who liked it |
| **Responsive design** | Sidebars hide on mobile, feed takes full width |

---

## Project Structure

```
buddyscript/
├── client/                    # Next.js 14 frontend (port 3000)
│   ├── public/assets/         # CSS, images, fonts (provided design assets)
│   └── src/
│       ├── app/
│       │   ├── layout.js      # Bootstrap + provided CSS imports
│       │   ├── login/         # Login page
│       │   ├── register/      # Registration page
│       │   └── feed/          # Feed page (protected)
│       ├── components/
│       │   ├── auth/          # LoginForm, RegisterForm
│       │   ├── feed/          # PostCard, CommentSection, LikeButton, LikesModal
│       │   └── common/        # ProtectedRoute
│       ├── context/           # AuthContext (user state, login/logout)
│       ├── hooks/             # useAuth, usePosts, useComments
│       └── lib/               # Axios instance with request/response interceptors
│
└── server/                    # Express.js API (port 5000)
    ├── prisma/
    │   ├── schema.prisma      # Database schema
    │   └── seed.js            # Demo users, posts, comments
    └── src/
        ├── config/            # Environment variable configuration
        ├── middleware/
        │   ├── auth.js        # JWT verification middleware
        │   ├── upload.js      # Multer + Cloudinary (5MB limit, images only)
        │   ├── validate.js    # Zod schema validation middleware
        │   └── errorHandler.js# Global error handler with proper HTTP codes
        ├── routes/            # auth, post, comment, like routes
        ├── controllers/       # auth, post, comment, like controllers
        └── services/          # Zod validation schemas
```

---

## Setup — Local Development

### Prerequisites
- Node.js 18+
- npm 9+
- PostgreSQL 14+ (running on port 5432)

### 1. Backend
```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
DATABASE_URL="postgresql://postgres:password@localhost:5432/buddyscript"
JWT_ACCESS_SECRET=change-this-to-random-secret
JWT_REFRESH_SECRET=change-this-to-another-secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
CORS_ORIGIN=http://localhost:3000

# Cloudinary (for image upload feature)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Run migrations and seed demo data:
```bash
npx prisma migrate dev --name init
node prisma/seed.js
```

Start backend:
```bash
npm run dev
# Runs on http://localhost:5000
```

### 2. Frontend
```bash
cd client
npm install
```

Create `client/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm run dev
# Runs on http://localhost:3000
```

### Test Accounts (from seed)
| Name | Email | Password |
|------|-------|----------|
| Alice Johnson | alice@example.com | password123 |
| Bob Smith | bob@example.com | password123 |
| Carol Davis | carol@example.com | password123 |

---

## API Reference

### Authentication
| Method | Endpoint | Body | Auth | Response |
|--------|----------|------|------|----------|
| POST | `/api/auth/register` | `{firstName, lastName, email, password}` | No | 201 user object |
| POST | `/api/auth/login` | `{email, password}` | No | 200 user + sets cookies |
| POST | `/api/auth/refresh` | — | No | 200 new access token |
| POST | `/api/auth/logout` | — | No | 200 clears cookies |
| GET | `/api/auth/me` | — | Yes | 200 current user |

### Posts
| Method | Endpoint | Body | Auth | Response |
|--------|----------|------|------|----------|
| GET | `/api/posts?limit=10&cursor=` | — | Yes | 200 `{posts, nextCursor}` |
| POST | `/api/posts` | `content, visibility, image (file)` | Yes | 201 `{post}` |
| DELETE | `/api/posts/:id` | — | Yes | 200 or 403/404 |

### Comments & Replies
| Method | Endpoint | Body | Auth | Response |
|--------|----------|------|------|----------|
| GET | `/api/posts/:postId/comments?limit=5&cursor=` | — | Yes | 200 `{comments, nextCursor}` |
| POST | `/api/posts/:postId/comments` | `{content}` | Yes | 201 `{comment}` |
| POST | `/api/comments/:commentId/replies` | `{content}` | Yes | 201 `{reply}` |

### Likes
| Method | Endpoint | Auth | Response |
|--------|----------|------|----------|
| POST | `/api/posts/:postId/like` | Yes | 200 `{liked, likeCount}` |
| POST | `/api/comments/:commentId/like` | Yes | 200 `{liked, likeCount}` |
| GET | `/api/posts/:postId/likes` | Yes | 200 `{users}` |
| GET | `/api/comments/:commentId/likes` | Yes | 200 `{users}` |

### HTTP Status Codes
| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Validation error (Zod), bad request |
| 401 | Unauthenticated (missing/invalid JWT) |
| 403 | Forbidden (e.g. deleting another user's post) |
| 404 | Resource not found |
| 409 | Conflict (e.g. email already registered) |
| 500 | Server error |

---

## Architecture Decisions

### 1. JWT in httpOnly Cookies (not localStorage)
Tokens stored in `httpOnly; Secure; SameSite=Strict` cookies. JavaScript cannot read them — prevents XSS token theft. The frontend sends cookies automatically with every request via `credentials: 'include'`.

### 2. Cursor-Based Pagination
The feed uses `cursor` (timestamp of last seen post) instead of `OFFSET`. At millions of posts, `OFFSET N` forces the database to scan all N rows before returning results. Cursor-based pagination is O(log n) regardless of position in the feed.

### 3. Adjacency List for Comments
All comments and replies live in one `comments` table with a nullable `parentId`. `parentId = NULL` means top-level comment; `parentId = <id>` means it's a reply to that comment. Simple, efficient, no separate replies table needed.

### 4. Separate Express API
The backend is a completely separate Node.js server (not Next.js API routes). This gives cleaner separation of concerns, allows the backend to scale independently, and is more realistic for a production architecture.

### 5. Optimistic UI for Likes
When a user clicks Like, the count updates immediately in the UI before the API call returns. If the API call fails, the count reverts. This makes the UI feel instant.

### 6. Cloudinary for Image Storage
Images are uploaded to Cloudinary, not stored on the server filesystem. Server filesystems on Railway/Render are ephemeral — they reset on redeploys. Cloudinary images persist permanently.

### 7. Zod Validation on All Endpoints
Every POST/PUT endpoint passes through a Zod schema before reaching the controller. Returns 400 with field-level error details on failure. Post creation also validates content length (1-5000 chars) and visibility enum.

### 8. Bounded API Queries
Likes lists are capped at 50, comments at 50. Without bounds, a post with millions of likes could crash the server. These limits keep the API safe at any scale.

---

## Security

| Concern | Implementation |
|---------|---------------|
| Password storage | bcrypt with 12 salt rounds |
| JWT security | httpOnly + Secure + SameSite=Strict cookies |
| Token expiry | Access token 15min, refresh token 7 days |
| Input validation | Zod schemas on every endpoint — returns 400 with field details |
| SQL injection | Prisma ORM parameterized queries |
| XSS | React auto-escapes all JSX; never use `dangerouslySetInnerHTML` |
| CORS | Whitelisted frontend origin only |
| Rate limiting | express-rate-limit on auth routes (20 req/15min prod, 100 dev) |
| Security headers | Helmet middleware (CSP, HSTS, etc.) |
| File upload | MIME type whitelist (JPEG/PNG/GIF/WebP) + 5MB limit → returns **400** |
| Error handling | Generic messages for 500 errors — no internal details leaked |
| Authorization | Owner-only delete; private post filter at query level |

---

## Performance (for millions of posts)

| Technique | Where |
|-----------|-------|
| Cursor-based pagination | Feed + comments — no OFFSET degradation |
| Database indexes | `createdAt DESC`, composite `(visibility, createdAt)`, all foreign keys |
| Eager loading | Single Prisma query loads post + author + like count + comment count |
| Optimistic UI | Likes update before server confirms |
| Query limits | Likes capped at `take: 50`, comments at `Math.min(limit, 50)` |
| Connection pooling | Prisma built-in |

---

## Free Deployment

All three services can be deployed **completely free**:

| Service | Platform | Free Tier |
|---------|----------|-----------|
| Frontend (Next.js) | **Vercel** | Unlimited, automatic HTTPS |
| Backend (Express) | **Render** | 750 hrs/month, auto-deploys from Git |
| Database (PostgreSQL) | **Neon** | 0.5 GB storage, never expires |

---

### Step 1: Database → Neon (Free PostgreSQL)

1. Go to [neon.tech](https://neon.tech) → Sign up with GitHub
2. Click **Create Project** → name it `buddyscript`
3. Copy the **connection string** (looks like `postgresql://buddyscript_owner:xxx@ep-xxx.us-east-2.aws.neon.tech/buddyscript?sslmode=require`)
4. Copy the connection string — you'll need it for Render and for local migration

**Important:** Neon requires SSL. If the connection string doesn't already have `?sslmode=require`, append it:
```
postgresql://user:pass@host/dbname?sslmode=require
```

Then run your **first migration** from your local machine against Neon:
```bash
cd server
# Set DATABASE_URL to your Neon connection string temporarily
set DATABASE_URL=postgresql://user:pass@host/dbname?sslmode=require
npx prisma migrate deploy
node prisma/seed.js
```

---

### Step 2: Backend → Render (Free Express.js)

**Option A — Automatic (recommended):**

The `render.yaml` in the repo root configures everything. Just:

1. Go to [dashboard.render.com](https://dashboard.render.com) → Sign up with GitHub
2. Click **New** → **Blueprint**
3. Connect your `Ashfaq10/buddyscript` repo
4. Render auto-detects `render.yaml` and creates the web service
5. Before deploying, set these **missing env vars** in the service dashboard:
   - `DATABASE_URL` → your Neon connection string (with `?sslmode=require`)
   - `CORS_ORIGIN` → `https://buddyscript.vercel.app` (or your Vercel URL)
   - `CLOUDINARY_CLOUD_NAME` → your Cloudinary cloud name
   - `CLOUDINARY_API_KEY` → your Cloudinary API key
   - `CLOUDINARY_API_SECRET` → your Cloudinary API secret
6. Click **Deploy**

**Option B — Manual:**

1. Go to [dashboard.render.com](https://dashboard.render.com) → **New** → **Web Service**
2. Connect your repo → set:
   - **Root Directory:** `server`
   - **Environment:** Node
   - **Build Command:** `npm install && npx prisma generate`
   - **Start Command:** `npm start`
3. Add all env vars (same list as above)
4. Click **Create Web Service**

Your API will be live at `https://buddyscript-api.onrender.com`

---

### Step 3: Frontend → Vercel (Free Next.js)

1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. Click **Add New** → **Project**
3. Import `Ashfaq10/buddyscript`
4. Configure:
   - **Root Directory:** `client`
   - **Framework Preset:** Next.js (auto-detected)
5. Add environment variable:
   - `NEXT_PUBLIC_API_URL` → `https://buddyscript-api.onrender.com/api`
6. Click **Deploy**

Your app will be live at `https://buddyscript.vercel.app`

---

### After Deployment — Verify

1. Open `https://buddyscript.vercel.app` → should see login page
2. Register a new account → should work (auto-login to feed)
3. Try test accounts: `alice@example.com` / `password123`
4. Create a post with an image → upload should work (Cloudinary)
5. Check Render logs if something fails

### Important Render Note

Render's free tier **spins down after 15 minutes of inactivity**. The first request after a spin-down can take 30-60 seconds to wake up. Subsequent requests are instant. For the video demo, keep making requests to prevent spin-down.

---

## Test Results

All 23 tests pass. See [TEST_REPORT.md](./TEST_REPORT.md) for detailed results.

| Category | Tests | Result |
|----------|-------|--------|
| Authentication | 7 | ✅ All Pass |
| Feed & Posts | 6 | ✅ All Pass |
| Likes | 4 | ✅ All Pass |
| Comments & Replies | 3 | ✅ All Pass |
| Security | 3 | ✅ All Pass |

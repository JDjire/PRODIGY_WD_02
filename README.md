# Prodigy InfoTech Internship

## Task 02 – Employee Management System

A full-stack web application that allows administrators to manage employee records securely.

### Features

- Admin authentication
- Create, Read, Update, Delete employees
- Protected routes
- MongoDB database integration

### Technologies

- Next.js
- React.js
- Tailwind CSS
- NextAuth.js
- MongoDB
- Mongoose

### Author

Jiregna Dereje

---

### Setup

1. Copy environment variables:

   ```bash
   cp .env.example .env.local
   ```

2. Set `MONGODB_URI`, `NEXTAUTH_URL`, and `NEXTAUTH_SECRET` in `.env.local`. For local MongoDB, the example URI is a sensible default.

3. Install dependencies and create the first admin (uses `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env.local`):

   ```bash
   npm install
   npm run seed
   ```

4. Start the app:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000), sign in at `/login`, then use the dashboard and employee CRUD screens.

**Sign-in must use the same values as in `.env.local`:** `ADMIN_EMAIL` and `ADMIN_PASSWORD` (not your MongoDB username). If you see “Invalid email or password”, run `npm run seed` once, or reset the hash with:

```bash
npm run seed -- --reset-password
```

Watch the terminal while signing in during `npm run dev`: in development, the server logs whether the email was missing in the database or the password did not match.

### API (session required)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/employees` | List employees |
| POST | `/api/employees` | Create employee |
| GET | `/api/employees/[id]` | Get one employee (for edit) |
| PUT | `/api/employees/[id]` | Update employee |
| DELETE | `/api/employees/[id]` | Delete employee |

Passwords are hashed with bcrypt. JWT sessions are used via NextAuth. Employee APIs return JSON errors without exposing stack traces or secrets.

### Deployment

- Set the same environment variables on your host (e.g. Vercel project settings).
- Use a strong `NEXTAUTH_SECRET` and a production MongoDB connection string.

A sample `screenshot.png` is included in the project root; replace it with your own capture if you prefer.

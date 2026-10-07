# Gunaso

Gunaso is a public grievance portal. Citizens can create accounts, file complaints, see the responsible department, and follow a status audit trail. Officers and administrators can review complaints and update their status.

## Run locally

1. Install Node.js 20 or newer and start MongoDB locally.
2. Copy `server/.env.example` to `server/.env` and set `MONGO_URI` and a strong `JWT_SECRET`.
3. Install and start the API:

   ```powershell
   npm --prefix .\server install
   npm --prefix .\server run dev
   ```

4. Open http://localhost:5000. The API serves the client and exposes:

   - `GET /api/health`
   - `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
   - `GET/POST /api/complaints`
   - `GET /api/complaints/:id`
   - `PATCH /api/complaints/:id/status` for officers and admins
   - `GET /api/departments`

The initial account role is always `citizen`. An administrator can create departments through `POST /api/departments`, then assign an account the `admin` or `officer` role directly in MongoDB.

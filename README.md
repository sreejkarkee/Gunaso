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

## React client

The client is a Vite React application in `client/`.

```powershell
npm install --prefix .\client
npm run dev
```

The root `npm run dev` starts Vite at http://localhost:5173 and proxies `/api` requests to the server at http://localhost:5000. Run the API separately with:

```powershell
npm run server
```

For production, build the React client with `npm run build`; the Express server will serve `client/dist`.

## Deploy to Render and Vercel

This project can be deployed as two services:

1. **Create a MongoDB Atlas database.** Add a database user and allow the deployed
   Render service to connect. For a quick setup, use `0.0.0.0/0` in Atlas Network
   Access; restrict it to Render's outbound IPs if your plan supports that.
2. **Deploy the API to Render.** Create a Web Service from this repository:
   - Root Directory: `server`
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN=7d`, and `NODE_ENV=production`.
     Render supplies `PORT` automatically.
   - Temporarily set `CLIENT_URL` to the eventual Vercel URL, or update it after
     the frontend deployment. The API health check is `/api/health`.
3. **Deploy the frontend to Vercel.** Import the same repository:
   - Root Directory: `client`
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Add `VITE_API_URL=https://<your-render-service>.onrender.com/api`.
4. **Update CORS.** Copy the Vercel production URL into the Render
   `CLIENT_URL` environment variable and redeploy the Render service.
5. Test the Vercel URL by registering, logging in, and calling
   `https://<your-render-service>.onrender.com/api/health`.

Do not commit either `.env` file. Render's local filesystem is ephemeral, so
uploaded complaint images stored in `server/uploads` can disappear after a
restart or redeploy; use object storage for persistent uploads in production.

### Client structure

```text
client/src/
├── api/          # API request helpers
├── app/          # App shell and route selection
├── components/   # Shared UI components
├── constants/    # Shared complaint values
├── pages/        # Home, auth, dashboard, complaint, and staff pages
└── styles/       # Global application styles
```

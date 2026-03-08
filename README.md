# Vehicle Rental System (Project 13)

Full-stack Vehicle Rental platform with:
- Customer/Admin JWT authentication
- Vehicle CRUD management
- Date-range availability checking
- Double-booking prevention (active booking + payment hold logic)
- Booking + payment flow
- Booking history and cancellation policy
- Payment history and admin reports
- Email confirmation simulation
- Responsive UI for public/customer/admin portals

## Tech Stack
- Frontend: React (Vite), React Router, Axios, Day.js
- Backend: Node.js, Express, MongoDB (Mongoose), JWT, Zod
- Optional Deployment: Docker / Docker Compose

## Project Structure
- `client` -> React frontend
- `server` -> Express API
- `Dockerfile` + `docker-compose.yml` -> containerized deployment

## Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)

## Local Run (Development)
1. Install all dependencies:
```bash
npm run install:all
```
2. Configure backend env:
```bash
copy server\.env.example server\.env
```
3. Configure frontend env (optional if using Vite proxy):
```bash
copy client\.env.example client\.env
```
4. Seed admin and sample data:
```bash
npm run seed:admin
npm run seed:sample
```
5. Start both frontend + backend:
```bash
npm run dev
```
6. Open:
- Frontend: `http://localhost:5173`
- API health: `http://localhost:5000/api/health`

## Default Seed Credentials
- Admin:
  - Email: `admin@velocityrentals.com`
  - Password: `Admin@123`
- Demo Customer:
  - Email: `customer@velocityrentals.com`
  - Password: `Customer@123`

## Main Workflows Implemented
1. Admin logs in and manages vehicles/users/bookings.
2. Customer registers with license details.
3. Customer searches vehicles with filters (`type`, `price`, `availability dates`).
4. Booking request creates a temporary `pending_payment` hold.
5. Payment confirms booking; failed/expired payment cancels hold.
6. Vehicle remains unavailable for overlapping active bookings.
7. Customer can cancel before start date.
8. Booking/payment history available for customer.
9. Admin dashboard/report shows totals and monthly revenue.

## Important API Routes
- Auth:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/admin/login`
- Vehicles:
  - `GET /api/vehicles`
  - `GET /api/vehicles/:id`
  - `GET /api/vehicles/:id/availability`
  - `POST/PUT/DELETE /api/vehicles/:id` (admin)
- Bookings:
  - `POST /api/bookings` (customer)
  - `GET /api/bookings/my` (customer)
  - `PATCH /api/bookings/:id/cancel`
  - `GET /api/bookings` (admin)
- Payments:
  - `POST /api/payments/process`
  - `GET /api/payments/my`
  - `GET /api/payments` (admin)
- Reports:
  - `GET /api/reports/dashboard` (admin)

## Deployment Option 1: Docker (Single URL)
Runs frontend + backend + MongoDB locally in containers:
```bash
docker compose up --build -d
```
App URL: `http://localhost:5000`

## Deployment Option 2: Cloud (Recommended)
1. Backend deploy (Render/Railway/Fly):
   - Service root: `server`
   - Build: `npm install`
   - Start: `npm run start`
   - Set env from `server/.env.example`
2. Frontend deploy (Vercel/Netlify):
   - Project root: `client`
   - Build: `npm run build`
   - Publish directory: `dist`
   - Set `VITE_API_URL` to your backend URL + `/api`
3. Update backend `CLIENT_URL` to frontend deployed domain.

## Notes
- Email confirmation is simulated when SMTP is not configured; email content is logged on backend.
- Payment simulation rule: card numbers ending with `0` fail intentionally.
- Vehicle delete is soft-delete (`isActive=false`) to preserve booking history.

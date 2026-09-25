# Aayush Logistics & Order Tracking System

A full-stack logistics management web application where clients can book transport orders, track shipments using LR numbers, view documents, and manage their profile. Admins can verify payments, generate LR numbers, update shipment tracking, manage orders, clients, and delivery documents.

## Features

### Client Features

* Secure Register and Login using JWT authentication
* Book a new transport order
* Enter pickup, delivery, goods, vehicle, and payment details
* View all booked orders
* Track shipment using LR Number
* View order status timeline
* View live/current shipment location on map
* Download invoice, bill, and delivery documents
* Manage profile

### Admin Features

* Admin dashboard with order and shipment statistics
* View and manage all transport orders
* Verify or reject payment details
* Automatic unique LR number generation after payment verification
* Assign driver name and vehicle number
* Update shipment status:

  * Booked
  * Payment Verified
  * Picked Up
  * In Transit
  * Delivered
* Add live shipment location updates
* Upload invoice, bills, and delivery receipts
* View client details and documents

## Tech Stack

| Category       | Technologies                 |
| -------------- | ---------------------------- |
| Frontend       | React.js, Vite, Tailwind CSS |
| Backend        | Node.js, Express.js          |
| Database       | MongoDB, Mongoose            |
| Authentication | JWT, bcrypt                  |
| File Upload    | Multer                       |
| Maps           | Leaflet, OpenStreetMap       |
| Charts         | Recharts                     |

## Project Workflow

Client Register/Login → Book Transport Order → Submit Payment Details → Admin Verifies Payment → System Generates LR Number → Admin Assigns Driver and Vehicle → Shipment Tracking Updates → Client Tracks Order → Order Delivered → Invoice and Documents Available for Download

## Folder Structure

```text
aayush-logistics/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seed/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── services/
│   └── package.json
│
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone <your-github-repository-link>
cd aayush-logistics
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

Create/update the `.env` file:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/aayush_logistics
JWT_SECRET=aayush_logistics_secret_2026
```

Backend runs on:

```text
http://localhost:3000
```

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

Frontend `.env` example:

```env
VITE_API_URL=http://localhost:3000/api
```

## Demo Login Credentials

### Admin

```text
Email: admin@aayushlogistics.com
Password: admin123
```

### Client

```text
Email: kshitija@example.com
Password: client123
```

### Second Client

```text
Email: rohan@example.com
Password: client123
```

## API Modules

| Module         | Main APIs                             |
| -------------- | ------------------------------------- |
| Authentication | Register, Login, Current User         |
| Orders         | Create, Read, Update, Track Orders    |
| Payments       | View Pending Payments, Verify, Reject |
| Tracking       | Add and View Location Updates         |
| Documents      | Upload, View, Download, Delete        |
| Statistics     | Admin and Client Dashboard Statistics |

## LR Number Format

After the admin verifies a payment, the system automatically creates a unique LR number.

Example:

```text
ALR-2026-0001
```

## Order Status Flow

```text
Booked → Payment Verified → Picked Up → In Transit → Delivered
```

## Future Improvements

* Real payment gateway integration
* Driver mobile application
* Email and SMS notifications
* Live GPS tracking using Socket.io
* Cloud file storage using Cloudinary
* PDF invoice generation for every completed order
* Deployment using Render and Vercel

## Author

**Kshitija Renuke**
Full-Stack Developer
GitHub: https://github.com/kshitijarenuke-cell

# 🏥 BeamHealth

A full-stack healthcare workflow management application for patient intake, insurance eligibility verification, patient routing, appointment scheduling, and follow-up management.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)

---

## Overview

BeamHealth MVP streamlines healthcare administrative workflows:

- **Patient Intake** - Register and manage patient information
- **Insurance Eligibility** - Verify insurance coverage and eligibility
- **Patient Routing** - Smart routing based on patient needs
- **Appointment Scheduling** - Manage appointments efficiently
- **Follow-up Management** - Track and manage patient follow-ups

---

## Architecture

This project consists of two main components:

| Component | Description |
|-----------|-------------|
| **beam-mvp** | Node.js/Express backend API |
| **beam-mvp-frontend** | React + Vite frontend application |

The backend follows **Clean Architecture** principles with SOLID design patterns.

---

## Tech Stack

### Backend (`beam-mvp`)
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing
- **Nodemon** - Development auto-reload

### Frontend (`beam-mvp-frontend`)
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Axios** - HTTP client

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vikasumd/BeamHealth.git
   cd BeamHealth
   ```

2. **Install backend dependencies**
   ```bash
   cd beam-mvp
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../beam-mvp-frontend
   npm install
   ```

---

## Running the Application

### Start Backend Server

```bash
cd beam-mvp

# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The backend server runs on `http://localhost:3000`

### Start Frontend Development Server

```bash
cd beam-mvp-frontend

# Development mode
npm run dev
```

The frontend runs on `http://localhost:5173`

---

## API Documentation

### Patient Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/patients` | Get all patients |
| GET | `/api/patients/:id` | Get patient by ID |
| POST | `/api/patients` | Create new patient |
| PUT | `/api/patients/:id` | Update patient |
| DELETE | `/api/patients/:id` | Delete patient |

### Appointment Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/appointments` | Get all appointments |
| GET | `/api/appointments/:id` | Get appointment by ID |
| POST | `/api/appointments` | Create new appointment |
| PUT | `/api/appointments/:id` | Update appointment |
| DELETE | `/api/appointments/:id` | Delete appointment |

### Workflow Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/workflow/intake` | Complete patient intake process |
| POST | `/api/workflow/schedule` | Schedule appointment with eligibility check |

---

## Project Structure

```
BeamHealth/
├── beam-mvp/                    # Backend API
│   ├── src/
│   │   ├── server.js            # Entry point
│   │   ├── app.js               # Express configuration
│   │   ├── controllers/         # Route handlers
│   │   ├── data/                # JSON data storage
│   │   ├── models/              # Entity models
│   │   ├── repositories/        # Data access layer
│   │   ├── routes/              # API routes
│   │   ├── services/            # Business logic
│   │   └── utils/               # Helper utilities
│   └── package.json
│
├── beam-mvp-frontend/           # Frontend Application
│   ├── src/
│   │   ├── App.jsx              # Main application
│   │   ├── main.jsx             # Entry point
│   │   ├── api/                 # API client
│   │   ├── components/          # React components
│   │   └── styles/              # CSS styles
│   ├── vite.config.js
│   └── package.json
│
└── README.md                    # This file
```

---

## License

ISC

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

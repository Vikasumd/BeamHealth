# BeamHealth MVP Backend

A robust Node.js backend application designed for healthcare workflow management. It facilitates patient intake, insurance eligibility verification, appointment scheduling, smart routing, and invoice management.

## 🏗 System Architecture

The project is structured using **Clean Architecture** principles, ensuring a separation of concerns between data, business logic, and API layers.

-   **API Layer** (`routes/`, `controllers/`): Handles HTTP requests and response formatting.
-   **Business Logic Layer** (`services/`): Contains the core business rules (e.g., eligibility checks, workflow orchestration).
-   **Data Access Layer** (`repositories/`, `data/`): Manages data persistence using JSON files to simulate a database.
-   **Models** (`models/`): Defines the data structures and schemas.

## 📂 Project Structure

```
beam-mvp/
├── src/
│   ├── app.js                 # Express application setup
│   ├── server.js              # Server entry point
│   │
│   ├── controllers/           # Request handlers (Workflow, Invoice)
│   ├── services/              # Business logic (Intake, Eligibility, Scheduling)
│   ├── repositories/          # Data access patterns
│   ├── routes/                # detailed API route definitions
│   ├── models/                # Class definitions for entities
│   ├── data/                  # JSON storage (The "Database")
│   └── utils/                 # Helpers (File I/O, Formatters)
│
└── package.json
```

## 🚀 Getting Started

### Prerequisites
-   Node.js (v16 or higher)
-   npm

### Installation

1.  Navigate to the directory:
    ```bash
    cd Backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Running the Server

-   **Development Mode** (Hot Reload):
    ```bash
    npm run dev
    ```
-   **Production Mode**:
    ```bash
    npm start
    ```

The server runs on **http://localhost:4000**.

---

## 📡 API Documentation

### 👤 Patients API
**Base URL:** `/patients`

| Method | Endpoint | Description | Payload |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Retrieve all patients. | - |
| `GET` | `/:id` | Retrieve a specific patient by ID. | - |
| `POST` | `/` | Create a new patient. | JSON Body (see below) |

**Create Patient Payload:**
```json
{
  "first_name": "Jane",
  "last_name": "Doe",
  "dob": "1995-05-20",
  "email": "jane.doe@example.com",
  "phone": "555-0199",
  "gender": "F"
}
```

### 🏥 Insurances API
**Base URL:** `/insurances`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | List all insurance providers. |
| `GET` | `/:id` | Get details of a specific provider. |

### 📅 Appointments API
**Base URL:** `/appointments`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/available` | Get all available (unbooked) appointment slots. |

### 🔄 Workflow API
**Base URL:** `/workflow`

These endpoints orchestrate complex multi-step processes.

#### 1. Run Unified Flow
**Endpoint:** `POST /workflow/run`
**Description:** Performs Intake, checks Eligibility, calculates Routing (if denied), and returns Available Slots.

**Request:**
```json
{
  "patientId": 1,
  "insuranceId": 1
}
```

**Response:**
```json
{
  "intake": { ... },       // Patient details
  "eligibility": { ... },  // Eligibility status
  "routing": null,         // Alternative plans if not eligible
  "availableSlots": [ ... ]
}
```

#### 2. Book & Follow-Up
**Endpoint:** `POST /workflow/book`
**Description:** Books a slot and generates post-visit follow-up tasks.

**Request:**
```json
{
  "appointmentId": 13,
  "patientId": 1,
  "insuranceId": 1
}
```

### 💰 Invoices API
**Base URL:** `/invoices`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Get invoices. Supports query filters: `status`, `claimType`, `search`, `startDate`, `endDate`. |
| `GET` | `/stats` | Get dashboard statistics (total, overdue, paid this month). |
| `GET` | `/:id` | Get single invoice details. |
| `GET` | `/patient/:patientId` | Get invoices for a specific patient. |
| `POST` | `/` | Create a new invoice. |
| `PUT` | `/:id` | Update an invoice. |
| `DELETE` | `/:id` | Delete an invoice. |

---

## 💾 Data Models

The application uses the following data structures, stored in `src/data/`.

### Patient
```json
{
  "id": "number",
  "first_name": "string",
  "last_name": "string",
  "dob": "YYYY-MM-DD",
  "email": "string",
  "phone": "string",
  "gender": "M|F"
}
```

### Insurance
```json
{
  "id": "number",
  "payer": "string (e.g., 'Blue Cross')",
  "plan": "string",
  "eligible": "boolean",
  "coPay": "number | null",
  "reason": "string | null (denial reason)"
}
```

### Appointment
```json
{
  "id": "number",
  "status": "booked | available",
  "start": "ISO String (e.g., '2025-12-10T09:00:00Z')",
  "slot_duration": "number (minutes)",
  "patient_id": "number | null"
}
```

### Invoice
```json
{
  "id": "number",
  "invoiceNumber": "string (generated)",
  "patientId": "number",
  "patientName": "string",
  "amount": "number",
  "status": "paid | pending | denied | partial | submitted | draft",
  "claimType": "medical | dental | vision",
  "payerName": "string",
  "cptCodes": ["string"],
  "icdCodes": ["string"]
}
```

# BeamHealth MVP

A Node.js backend application for healthcare workflow management including patient intake, insurance eligibility verification, patient routing, appointment scheduling, and follow-up management.

## Architecture

This project follows **Clean Architecture** principles with clear separation of concerns:

- **Data Layer**: Entity models and repositories for data access
- **Business Logic Layer**: Services containing core business logic (SOLID principles)
- **API Layer**: Controllers and routes for HTTP endpoints
- **Utilities**: Shared helper functions

### SOLID Principles Applied

- **S** - Single Responsibility: Each entity model has one clear purpose
- **O** - Open/Closed: Services can be extended through composition
- **L** - Liskov Substitution: Repositories follow consistent interfaces
- **I** - Interface Segregation: Controllers are thin and focused
- **D** - Dependency Inversion: Services depend on repository abstractions

## Project Structure

```
beam-mvp/
├── src/
│   ├── server.js              # Server entry point
│   ├── app.js                 # Express app configuration
│   │
│   ├── data/                  # EMR simulation data
│   │   ├── patients.json
│   │   ├── appointments.json
│   │   └── insurances.json
│   │
│   ├── models/                # Entity models
│   │   ├── Patient.js
│   │   ├── Appointment.js
│   │   └── Insurance.js
│   │
│   ├── repositories/          # Data access layer
│   │   ├── patientRepository.js
│   │   ├── appointmentRepository.js
│   │   └── insuranceRepository.js
│   │
│   ├── services/              # Core business logic
│   │   ├── intakeService.js
│   │   ├── eligibilityService.js
│   │   ├── routingService.js
│   │   ├── schedulingService.js
│   │   └── followUpService.js
│   │
│   ├── controllers/           # Route handlers
│   │   ├── workflowController.js
│   │   ├── patientController.js
│   │   └── appointmentController.js
│   │
│   ├── routes/                # Express routes
│   │   ├── workflowRoutes.js
│   │   ├── patientRoutes.js
│   │   └── appointmentRoutes.js
│   │
│   └── utils/                 # Helper utilities
│       ├── fileUtil.js
│       └── formatter.js
│
├── package.json
└── README.md
```

## Installation

```bash
# Install dependencies
npm install
```

## Running the Application

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Patient Endpoints

- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Appointment Endpoints

- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Workflow Endpoints

- `POST /api/workflow/intake` - Complete patient intake process
- `POST /api/workflow/schedule` - Schedule appointment with eligibility check

## Usage Examples

### Create a Patient

```bash
curl -X POST http://localhost:3000/api/patients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "dateOfBirth": "1990-01-01",
    "phone": "555-0123",
    "email": "john.doe@example.com"
  }'
```

### Complete Intake Workflow

```bash
curl -X POST http://localhost:3000/api/workflow/intake \
  -H "Content-Type: application/json" \
  -d '{
    "patientData": {
      "name": "Jane Smith",
      "dateOfBirth": "1985-05-15",
      "phone": "555-0456"
    },
    "insuranceData": {
      "provider": "Blue Cross Blue Shield",
      "policyNumber": "12345"
    }
  }'
```

### Schedule Appointment with Eligibility Check

```bash
curl -X POST http://localhost:3000/api/workflow/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "1",
    "appointmentType": "consultation",
    "preferredDate": "2025-12-15"
  }'
```

## Technologies Used

- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **Nodemon** - Development auto-reload

## License

ISC

# Canvas Backend

A Spring Boot backend for the Canvas application with user authentication and canvas storage.

## Features

- User authentication (signup/login) with JWT tokens
- Canvas storage and retrieval
- PostgreSQL database integration
- RESTful API endpoints

## Setup

### Prerequisites

- Java 17
- Maven
- PostgreSQL

### Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE canvas_db;
```

2. Update `application.properties` with your database credentials if needed.

### Running the Application

1. Navigate to the backend directory:
```bash
cd backend
```

2. Run the application:
```bash
./mvnw spring-boot:run
```

The application will start on `http://localhost:8080`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Canvas Operations
- `POST /api/canvas` - Save canvas
- `GET /api/canvas` - Get user's canvases
- `GET /api/canvas/{id}` - Get specific canvas
- `DELETE /api/canvas/{id}` - Delete canvas

## Database Schema

The application will automatically create the following tables:
- `users` - User accounts
- `canvases` - Canvas data
- `shapes` - Shape data for each canvas 
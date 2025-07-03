# Microservices Task Management Application

A full-stack application built with a microservices architecture for managing user tasks. The application consists of:

1. An authentication microservice for user registration and login
2. A task management microservice for creating, updating, and deleting tasks
3. A React frontend for user interaction

## Technologies Used

- **Backend**: NestJS, MongoDB, JWT Authentication
- **Frontend**: React, TypeScript, Material-UI
- **Database**: MongoDB
- **Containerization**: Docker, Docker Compose

## Project Structure

```
microservices-task-app/
├── auth-service/        # Authentication microservice
├── task-service/        # Task management microservice
├── frontend/            # React frontend
├── docker-compose.yml   # Docker Compose configuration
└── README.md            # Project documentation
```

## Prerequisites

Make sure you have the following installed on your system:

- Docker and Docker Compose
- Node.js (v18+) and npm (for local development)
- MongoDB (for local development without Docker)

## Running the Application

### Using Docker (Recommended)

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd microservices-task-app
   ```

2. Run the setup script (easiest option):
   ```bash
   ./setup.sh
   ```

   Or manually start all services using Docker Compose:
   ```bash
   docker-compose up -d
   ```

3. Access the application in your browser:
   ```
   http://localhost
   ```

4. To stop all services:
   ```bash
   docker-compose down
   ```

### Local Development

#### Auth Service

1. Navigate to the auth-service directory:
   ```bash
   cd auth-service
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following content:
   ```
   MONGODB_URI=mongodb://localhost:27017/auth-service
   JWT_SECRET=your-secret-key
   PORT=3001
   ```

4. Start the service:
   ```bash
   npm run start:dev
   ```

#### Task Service

1. Navigate to the task-service directory:
   ```bash
   cd task-service
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following content:
   ```
   MONGODB_URI=mongodb://localhost:27017/task-service
   JWT_SECRET=your-secret-key  # Must be the same as in auth-service
   PORT=3002
   ```

4. Start the service:
   ```bash
   npm run start:dev
   ```

#### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Access the frontend in your browser:
   ```
   http://localhost:3000
   ```

## API Endpoints

### Auth Service (http://localhost:3001)

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get an access token
- `GET /auth/profile` - Get the current user's profile (requires authentication)

### Task Service (http://localhost:3002)

- `GET /tasks` - Get all tasks for the current user (requires authentication)
- `GET /tasks/:id` - Get a specific task (requires authentication)
- `POST /tasks` - Create a new task (requires authentication)
- `PUT /tasks/:id` - Update a task (requires authentication)
- `DELETE /tasks/:id` - Delete a task (requires authentication)

## Features

- User registration and authentication
- JWT-based authentication between services
- Create, read, update, and delete tasks
- Task status management (Todo, In Progress, Done)
- Responsive UI built with Material-UI
- Docker containerization for easy deployment

## Security Considerations

- JWT tokens for secure authentication
- Password hashing using bcrypt
- Protected routes in frontend and backend
- CORS configuration for API security

## Further Improvements

- Implement refresh tokens
- Add email verification
- Add more comprehensive error handling
- Implement logging and monitoring
- Add unit and integration tests
- Implement CI/CD pipeline

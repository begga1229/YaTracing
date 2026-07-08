# 📋 API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

All requests except `/auth/register` and `/auth/login` require JWT token:

```
Authorization: Bearer <token>
```

## Endpoints

### Auth

#### Register User
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password",
  "firstName": "John",
  "lastName": "Doe"
}

Response: 201 Created
{
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}

Response: 200 OK
{
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}
```

### Projects

#### Get All Projects
```
GET /projects
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": "uuid",
    "name": "Project Name",
    "description": "Description",
    "status": "active",
    "progress": 45,
    "budget": 50000,
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

#### Create Project
```
POST /projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Project",
  "description": "Project description",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "budget": 100000,
  "location": "Istanbul"
}

Response: 201 Created
{
  "id": "uuid",
  "name": "New Project",
  ...
}
```

#### Update Project
```
PUT /projects/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "progress": 50
}

Response: 200 OK
```

#### Delete Project
```
DELETE /projects/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Project deleted successfully"
}
```

### Teams

#### Get All Teams
```
GET /teams
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": "uuid",
    "name": "Team Name",
    "description": "Description",
    "department": "Engineering",
    "memberCount": 5,
    "projectId": "uuid",
    "leadId": "uuid"
  }
]
```

#### Create Team
```
POST /teams
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Team",
  "description": "Team description",
  "projectId": "uuid",
  "leadId": "uuid",
  "department": "Engineering"
}

Response: 201 Created
```

### Materials

#### Get All Materials
```
GET /materials
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": "uuid",
    "name": "Concrete",
    "category": "Building Materials",
    "quantity": 1000,
    "unit": "kg",
    "unitPrice": 50,
    "supplier": "Supplier Name",
    "status": "available",
    "projectId": "uuid"
  }
]
```

#### Create Material
```
POST /materials
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Steel",
  "category": "Metals",
  "quantity": 500,
  "unit": "kg",
  "unitPrice": 100,
  "supplier": "Steel Co.",
  "projectId": "uuid"
}

Response: 201 Created
```

### Equipment

#### Get All Equipment
```
GET /equipment
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": "uuid",
    "name": "Excavator",
    "type": "Heavy Machinery",
    "serialNumber": "EXC-001",
    "status": "operational",
    "location": "Site A",
    "projectId": "uuid",
    "lastMaintenance": "2024-01-01",
    "nextMaintenance": "2024-04-01"
  }
]
```

#### Create Equipment
```
POST /equipment
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Bulldozer",
  "type": "Heavy Machinery",
  "serialNumber": "BUL-001",
  "location": "Site B",
  "projectId": "uuid"
}

Response: 201 Created
```

### Reports

#### Get All Reports
```
GET /reports
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": "uuid",
    "title": "Daily Report",
    "content": "Report content...",
    "type": "daily",
    "status": "published",
    "createdBy": "uuid",
    "projectId": "uuid",
    "attachments": []
  }
]
```

#### Create Report
```
POST /reports
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Weekly Report",
  "content": "Report details...",
  "type": "weekly",
  "projectId": "uuid",
  "createdBy": "uuid"
}

Response: 201 Created
```

## Error Responses

### 400 Bad Request
```json
{
  "message": "Invalid request data"
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid token"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```
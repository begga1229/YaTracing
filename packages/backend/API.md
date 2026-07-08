# YaTracing API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

Tüm protected endpoints JWT token gerektirir:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### Register
- **POST** `/auth/register`
- **Body**: `{ email, password, name }`
- **Response**: `{ token, user }`

#### Login
- **POST** `/auth/login`
- **Body**: `{ email, password }`
- **Response**: `{ token, user }`

### Projects

#### List Projects
- **GET** `/projects`
- **Response**: `{ projects: [] }`

#### Create Project
- **POST** `/projects`
- **Body**: `{ name, description, startDate, endDate, budget }`
- **Response**: `{ project }`

#### Get Project
- **GET** `/projects/:id`
- **Response**: `{ project }`

#### Update Project
- **PUT** `/projects/:id`
- **Body**: `{ name, description, ... }`
- **Response**: `{ project }`

#### Delete Project
- **DELETE** `/projects/:id`
- **Response**: `{ message }`

### Teams

#### List Teams
- **GET** `/teams`
- **Response**: `{ teams: [] }`

#### Create Team
- **POST** `/teams`
- **Body**: `{ name, description, projectId }`
- **Response**: `{ team }`

### Materials

#### List Materials
- **GET** `/materials`
- **Response**: `{ materials: [] }`

#### Create Material
- **POST** `/materials`
- **Body**: `{ name, quantity, unit, projectId }`
- **Response**: `{ material }`

### Equipment

#### List Equipment
- **GET** `/equipment`
- **Response**: `{ equipment: [] }`

#### Create Equipment
- **POST** `/equipment`
- **Body**: `{ name, type, projectId }`
- **Response**: `{ equipment }`

### Reports

#### Generate Report
- **POST** `/reports/generate`
- **Body**: `{ projectId, type, startDate, endDate }`
- **Response**: `{ reportId, downloadUrl }`

## Real-time Events (Socket.io)

### Join Project
```javascript
socket.emit('join-project', projectId);
```

### Project Updated
```javascript
socket.on('project-updated', (project) => {
  // Handle update
})
```
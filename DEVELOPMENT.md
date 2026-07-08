# YaTracing Development Guide

## Project Setup

### Prerequisites
- Node.js 18+
- npm 9+
- PostgreSQL 14+
- Docker (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/begga1229/YaTracing.git
cd YaTracing
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables:
```bash
cp packages/backend/.env.example packages/backend/.env
cp packages/web/.env.example packages/web/.env
```

4. Update database configuration in `packages/backend/.env`

5. Run database migrations:
```bash
cd packages/backend
npm run db:migrate
```

### Running the Application

#### Development Mode (All services)
```bash
npm run dev
```

#### Individual Services

**Backend:**
```bash
cd packages/backend
npm run dev
```

**Web:**
```bash
cd packages/web
npm start
```

**Mobile:**
```bash
cd packages/mobile
npm start
```

### Docker Setup

```bash
docker-compose up -d
```

## Project Structure

```
YaTracing/
├── packages/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   ├── models/
│   │   │   ├── controllers/
│   │   │   ├── middleware/
│   │   │   └── index.js
│   │   ├── package.json
│   │   └── .env.example
│   ├── web/
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── redux/
│   │   │   └── App.js
│   │   └── package.json
│   └── mobile/
│       ├── src/
│       │   ├── screens/
│       │   ├── redux/
│       │   └── App.js
│       └── package.json
├── docker-compose.yml
└── README.md
```

## Next Steps

1. Implement database models using Sequelize
2. Create authentication system with JWT
3. Build API controllers for CRUD operations
4. Develop React components for UI
5. Integrate Socket.io for real-time updates
6. Implement mobile app screens
7. Add testing and CI/CD
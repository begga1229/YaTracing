# 🛠️ Development Guide

## Project Setup

### Prerequisites
- Node.js 16.x or higher
- npm or yarn
- PostgreSQL 13+
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/begga1229/YaTracing.git
cd YaTracing

# Install all dependencies
npm install

# Setup environment files
cp packages/backend/.env.example packages/backend/.env
cp packages/web/.env.example packages/web/.env
cp packages/mobile/.env.example packages/mobile/.env
```

## Running Development Servers

### Terminal 1 - Backend

```bash
cd packages/backend
npm run dev
# Server at http://localhost:5000
```

### Terminal 2 - Web App

```bash
cd packages/web
npm start
# App at http://localhost:3000
```

### Terminal 3 - Mobile App

```bash
cd packages/mobile
npm start
# Expo server running
```

## Code Structure

### Backend (packages/backend/)

```
src/
├── config/
│   └── database.js           # Sequelize configuration
├── models/
│   ├── User.js
│   ├── Project.js
│   ├── Team.js
│   ├── Material.js
│   ├── Equipment.js
│   └── Report.js
├── controllers/
│   ├── authController.js
│   ├── projectController.js
│   ├── teamController.js
│   ├── materialController.js
│   ├── equipmentController.js
│   └── reportController.js
├── routes/
│   ├── index.js
│   ├── auth.js
│   ├── projects.js
│   ├── teams.js
│   ├── materials.js
│   ├── equipment.js
│   └── reports.js
├── middleware/
│   └── auth.js
└── index.js                  # Server entry point
```

### Web App (packages/web/)

```
src/
├── components/
│   ├── Layout.js
│   ├── Sidebar.js
│   └── Header.js
├── pages/
│   ├── Dashboard.js
│   ├── Projects.js
│   ├── Teams.js
│   ├── Materials.js
│   ├── Equipment.js
│   ├── Reports.js
│   └── Login.js
├── redux/
│   ├── store.js
│   └── slices/
│       ├── projectsSlice.js
│       └── teamsSlice.js
├── services/
│   └── api.js                # API client
├── App.js
└── index.js
```

## Adding New Features

### Adding a New API Endpoint

1. **Create Model** (if needed)
   ```javascript
   // src/models/NewModel.js
   const NewModel = db.define('NewModel', { ... });
   export default NewModel;
   ```

2. **Create Controller**
   ```javascript
   // src/controllers/newController.js
   export const getAllNew = async (req, res) => { ... };
   ```

3. **Create Routes**
   ```javascript
   // src/routes/new.js
   router.get('/', getAllNew);
   ```

4. **Register in Main Routes**
   ```javascript
   // src/routes/index.js
   router.use('/new', newRoutes);
   ```

### Adding a New Page

1. **Create Component**
   ```javascript
   // src/pages/NewPage.js
   export default function NewPage() { ... }
   ```

2. **Add Route**
   ```javascript
   // src/App.js
   <Route path="/newpage" element={<NewPage />} />
   ```

3. **Update Navigation**
   ```javascript
   // src/components/Sidebar.js
   <Link to="/newpage">New Page</Link>
   ```

## Testing

### Manual Testing

1. **API Testing with Curl**
   ```bash
   # Login
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"user@example.com","password":"password"}'
   ```

2. **Frontend Testing**
   - Test in different browsers
   - Test responsive design
   - Test form validations

### Automated Testing

```bash
# Backend
cd packages/backend
npm test

# Web
cd packages/web
npm test
```

## Debugging

### Backend Debugging

```bash
# VS Code debug config
cd packages/backend
node --inspect-brk src/index.js
```

### Frontend Debugging

- Use React DevTools extension
- Use Redux DevTools extension
- Browser console for errors

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat: add my feature"

# Push to GitHub
git push origin feature/my-feature

# Create Pull Request
# ... after review and approval
git merge
```

## Coding Standards

- Use ES6+ syntax
- Follow naming conventions
- Write meaningful comments
- Keep functions small and focused
- Use async/await over callbacks

## Common Issues

### Database Connection Error

```bash
# Check PostgreSQL is running
psql postgres

# Create database
creatdb yatracing
```

### Port Already in Use

```bash
# Find process using port
lsof -i :5000

# Kill process
kill -9 <PID>
```

### Node Modules Issue

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```
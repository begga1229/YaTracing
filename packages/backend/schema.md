# Database Schema

## Tables

### Users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  phone VARCHAR,
  role VARCHAR DEFAULT 'user',
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Projects
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  budget DECIMAL,
  status VARCHAR DEFAULT 'active',
  owner_id UUID REFERENCES users(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Teams
```sql
CREATE TABLE teams (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  project_id UUID REFERENCES projects(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Team Members
```sql
CREATE TABLE team_members (
  id UUID PRIMARY KEY,
  team_id UUID REFERENCES teams(id),
  user_id UUID REFERENCES users(id),
  role VARCHAR,
  joined_at TIMESTAMP
);
```

### Materials
```sql
CREATE TABLE materials (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  quantity DECIMAL,
  unit VARCHAR,
  project_id UUID REFERENCES projects(id),
  status VARCHAR DEFAULT 'pending',
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Equipment
```sql
CREATE TABLE equipment (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  type VARCHAR,
  status VARCHAR DEFAULT 'available',
  project_id UUID REFERENCES projects(id),
  location POINT,
  last_updated TIMESTAMP
);
```

### Work Logs
```sql
CREATE TABLE work_logs (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  team_id UUID REFERENCES teams(id),
  description TEXT,
  duration_hours DECIMAL,
  photos TEXT[],
  created_at TIMESTAMP
);
```

### Notifications
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title VARCHAR,
  message TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP
);
```
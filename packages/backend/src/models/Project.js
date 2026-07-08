import db from '../config/database.js';
import { DataTypes } from 'sequelize';

const Project = db.define('Project', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  status: {
    type: DataTypes.ENUM('planning', 'active', 'completed', 'paused'),
    defaultValue: 'planning',
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  budget: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: { min: 0, max: 100 },
  },
  location: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  manager: {
    type: DataTypes.UUID,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: 'projects',
});

export default Project;
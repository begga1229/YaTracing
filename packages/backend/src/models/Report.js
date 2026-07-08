import db from '../config/database.js';
import { DataTypes } from 'sequelize';

const Report = db.define('Report', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'project', 'team'),
    defaultValue: 'daily',
  },
  projectId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    defaultValue: 'draft',
  },
  attachments: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
}, {
  timestamps: true,
  tableName: 'reports',
});

export default Report;
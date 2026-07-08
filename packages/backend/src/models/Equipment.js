import db from '../config/database.js';
import { DataTypes } from 'sequelize';

const Equipment = db.define('Equipment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  serialNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('operational', 'maintenance', 'broken', 'retired'),
    defaultValue: 'operational',
  },
  location: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  projectId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  lastMaintenance: {
    type: DataTypes.DATE,
    defaultValue: null,
  },
  nextMaintenance: {
    type: DataTypes.DATE,
    defaultValue: null,
  },
}, {
  timestamps: true,
  tableName: 'equipment',
});

export default Equipment;
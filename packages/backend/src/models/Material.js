import db from '../config/database.js';
import { DataTypes } from 'sequelize';

const Material = db.define('Material', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  unit: {
    type: DataTypes.STRING,
    defaultValue: 'piece',
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  supplier: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  projectId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('available', 'in_use', 'damaged', 'archived'),
    defaultValue: 'available',
  },
}, {
  timestamps: true,
  tableName: 'materials',
});

export default Material;
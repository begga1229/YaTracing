import db from '../config/database.js';
import { DataTypes } from 'sequelize';

const Team = db.define('Team', {
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
  projectId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  leadId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  memberCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  department: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
}, {
  timestamps: true,
  tableName: 'teams',
});

export default Team;
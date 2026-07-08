import db from '../config/database.js';
import { DataTypes } from 'sequelize';

/**
 * Takeoff = bir insaat ciziminden cikarilan metraj (quantity takeoff).
 * `items` alani, cizimden hesaplanan/okunan her metraj kalemini tutar:
 *   { name, category, layer, quantity, unit, unitPrice }
 * `summary` alani ise kaynak ve toplamlar hakkinda ozet bilgidir.
 */
const Takeoff = db.define('Takeoff', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  projectId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  // Cizim kaynagi: 'dxf' (geometriden kesin hesap) veya 'vision' (Claude AI)
  source: {
    type: DataTypes.ENUM('dxf', 'vision'),
    allowNull: false,
  },
  fileName: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  // Cizim olcegi / birim bilgisi ( or. "1:100", "mm", "AI-tahmini")
  scale: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  // Metraj kalemleri (JSON dizisi)
  items: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  // Ozet: toplam uzunluk/alan/adet, uyarilar, AI notlari
  summary: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
  status: {
    type: DataTypes.ENUM('processing', 'completed', 'failed'),
    defaultValue: 'completed',
  },
}, {
  timestamps: true,
  tableName: 'takeoffs',
});

export default Takeoff;

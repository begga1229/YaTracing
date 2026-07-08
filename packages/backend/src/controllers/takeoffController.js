import Takeoff from '../models/Takeoff.js';
import { parseDxfMetraj } from '../services/dxfMetraj.js';
import { analyzeVisionMetraj } from '../services/visionMetraj.js';
import { buildMetrajExcel } from '../services/excelExport.js';

const isDxf = (file) => {
  const name = (file.originalname || '').toLowerCase();
  return name.endsWith('.dxf') || (file.mimetype || '').includes('dxf');
};

/**
 * POST /api/takeoffs/analyze  (multipart/form-data)
 * Alanlar: file (zorunlu), name, projectId, instructions
 *
 * Hibrit motor:
 *  - DXF  -> geometriden kesin metraj (parseDxfMetraj)
 *  - PDF/goruntu -> Claude Vision ile AI metraj (analyzeVisionMetraj)
 */
export const analyzeTakeoff = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Cizim dosyasi (file) gerekli.' });
    }

    const { name, projectId, instructions } = req.body;
    const file = req.file;

    let result;
    let source;

    if (isDxf(file)) {
      source = 'dxf';
      result = parseDxfMetraj(file.buffer.toString('utf8'), file.originalname);
    } else {
      source = 'vision';
      result = await analyzeVisionMetraj(
        file.buffer,
        file.mimetype,
        file.originalname,
        instructions || ''
      );
    }

    const takeoff = await Takeoff.create({
      name: name || file.originalname || 'Metraj',
      projectId: projectId || null,
      source,
      fileName: file.originalname || '',
      scale: result.scale || '',
      items: result.items || [],
      summary: result.summary || {},
      status: 'completed',
    });

    return res.status(201).json(takeoff);
  } catch (error) {
    console.error('Metraj analizi hatasi:', error);
    return res.status(error.status || 500).json({ message: error.message });
  }
};

export const getAllTakeoffs = async (req, res) => {
  try {
    const where = {};
    if (req.query.projectId) where.projectId = req.query.projectId;
    const takeoffs = await Takeoff.findAll({ where, order: [['createdAt', 'DESC']] });
    res.json(takeoffs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTakeoffById = async (req, res) => {
  try {
    const takeoff = await Takeoff.findByPk(req.params.id);
    if (!takeoff) return res.status(404).json({ message: 'Metraj bulunamadi' });
    res.json(takeoff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * PUT /api/takeoffs/:id
 * Metraj kalemlerini (or. birim fiyat) veya adini guncelle.
 */
export const updateTakeoff = async (req, res) => {
  try {
    const takeoff = await Takeoff.findByPk(req.params.id);
    if (!takeoff) return res.status(404).json({ message: 'Metraj bulunamadi' });
    const { name, items } = req.body;
    await takeoff.update({
      ...(name !== undefined ? { name } : {}),
      ...(items !== undefined ? { items } : {}),
    });
    res.json(takeoff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTakeoff = async (req, res) => {
  try {
    const takeoff = await Takeoff.findByPk(req.params.id);
    if (!takeoff) return res.status(404).json({ message: 'Metraj bulunamadi' });
    await takeoff.destroy();
    res.json({ message: 'Metraj silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/takeoffs/:id/excel
 * Metraji Excel (.xlsx) olarak indir.
 */
export const exportTakeoffExcel = async (req, res) => {
  try {
    const takeoff = await Takeoff.findByPk(req.params.id);
    if (!takeoff) return res.status(404).json({ message: 'Metraj bulunamadi' });

    const buffer = await buildMetrajExcel(takeoff.toJSON());
    const safeName = (takeoff.name || 'metraj').replace(/[^a-z0-9_\-]+/gi, '_');

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', `attachment; filename="${safeName}.xlsx"`);
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error('Excel export hatasi:', error);
    res.status(500).json({ message: error.message });
  }
};

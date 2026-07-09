import { parseDxfMetraj } from '../services/dxfMetraj.js';
import { analyzeVisionMetraj } from '../services/visionMetraj.js';
import { buildConcreteExcel } from '../services/concreteExcel.js';

/**
 * Durumsuz (stateless) metraj ucu: veritabani ve kimlik dogrulama GEREKTIRMEZ.
 * Sunucu tarafindan sunulan metraj arayuzu (public/index.html) bu ucu cagirir.
 *
 * - DXF  -> geometriden kesin metraj (genelde istemci tarafinda yapilir ama burada da desteklenir)
 * - PDF/goruntu -> Claude Vision ile AI metraj (ANTHROPIC_API_KEY gerekir)
 */
export const analyzePublic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Cizim dosyasi (file) gerekli.' });
    }
    const f = req.file;
    const name = (f.originalname || '').toLowerCase();
    const isDxf = name.endsWith('.dxf') || (f.mimetype || '').includes('dxf');

    let result;
    if (isDxf) {
      result = parseDxfMetraj(f.buffer.toString('utf8'), f.originalname);
    } else {
      result = await analyzeVisionMetraj(f.buffer, f.mimetype, f.originalname, req.body.instructions || '');
    }

    return res.json({ source: isDxf ? 'dxf' : 'vision', fileName: f.originalname || '', ...result });
  } catch (error) {
    console.error('Public metraj analizi hatasi:', error);
    return res.status(error.status || 500).json({ message: error.message });
  }
};

/**
 * POST /api/metraj/concrete-excel
 * Body (JSON): { project, rows:[{name,cls,formula,volume}], notes? }
 * Yalnizca beton kalemlerinden profesyonel "Beton Cetveli" (.xlsx) uretir.
 */
export const concreteExcel = async (req, res) => {
  try {
    const { project, rows, notes } = req.body || {};
    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ message: 'En az bir beton kalemi (rows) gerekli.' });
    }
    const buffer = await buildConcreteExcel({ project, rows, notes });
    const safe = (project || 'beton-cetveli').replace(/[^a-z0-9_\-]+/gi, '_').slice(0, 60);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${safe}.xlsx"`);
    return res.send(Buffer.from(buffer));
  } catch (error) {
    console.error('Beton cetveli hatasi:', error);
    return res.status(500).json({ message: error.message });
  }
};

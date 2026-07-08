import DxfParser from 'dxf-parser';

/**
 * DXF (AutoCAD) cizimlerinden GEOMETRIK metraj hesabi.
 *
 * Gercek koordinatlar kullanildigi icin uzunluk / alan / adet degerleri
 * matematiksel olarak kesindir (AI tahmini degil). Sonuclar cizimin
 * katmanlarina (layer) gore gruplanir.
 */

// AutoCAD $INSUNITS kodu -> metre'ye cevirme carpani
const UNIT_TO_METERS = {
  0: 1,        // birimsiz -> oldugu gibi birak (metre varsay)
  1: 0.0254,   // inch
  2: 0.3048,   // feet
  3: 1609.344, // mile
  4: 0.001,    // mm
  5: 0.01,     // cm
  6: 1,        // m
  7: 1000,     // km
  8: 0.0000000254, // microinch
  9: 0.0000254,    // mil
  10: 0.9144,      // yard
  14: 0.1,         // dm
};

const UNIT_NAMES = {
  0: 'birimsiz', 1: 'inch', 2: 'ft', 3: 'mil', 4: 'mm',
  5: 'cm', 6: 'm', 7: 'km', 10: 'yard', 14: 'dm',
};

const dist = (a, b) => {
  const dx = (b.x || 0) - (a.x || 0);
  const dy = (b.y || 0) - (a.y || 0);
  return Math.sqrt(dx * dx + dy * dy);
};

const polylineLength = (vertices = [], closed = false) => {
  let len = 0;
  for (let i = 1; i < vertices.length; i += 1) {
    len += dist(vertices[i - 1], vertices[i]);
  }
  if (closed && vertices.length > 2) {
    len += dist(vertices[vertices.length - 1], vertices[0]);
  }
  return len;
};

// Kapali poligon alani (shoelace formulu)
const polygonArea = (vertices = []) => {
  let area = 0;
  const n = vertices.length;
  for (let i = 0; i < n; i += 1) {
    const a = vertices[i];
    const b = vertices[(i + 1) % n];
    area += (a.x || 0) * (b.y || 0) - (b.x || 0) * (a.y || 0);
  }
  return Math.abs(area) / 2;
};

const arcLength = (radius, startAngle, endAngle) => {
  // dxf-parser aci degerlerini radyan olarak verir
  let sweep = (endAngle ?? 0) - (startAngle ?? 0);
  if (sweep < 0) sweep += 2 * Math.PI;
  return radius * sweep;
};

/**
 * @param {string} dxfText - DXF dosyasinin metin icerigi
 * @param {string} fileName
 * @returns {{ items: Array, summary: Object, scale: string }}
 */
export const parseDxfMetraj = (dxfText, fileName = '') => {
  const parser = new DxfParser();
  const dxf = parser.parseSync(dxfText);

  if (!dxf || !Array.isArray(dxf.entities)) {
    throw new Error('DXF dosyasi cozumlenemedi veya cizim varliklari bos.');
  }

  const insUnits = dxf.header?.$INSUNITS ?? 0;
  const factor = UNIT_TO_METERS[insUnits] ?? 1;
  const unitName = UNIT_NAMES[insUnits] ?? 'birimsiz';

  // Katman + ture gore biriktirme
  // key: `${layer}||${metric}` -> { layer, metric, value, count }
  const buckets = new Map();
  const blockCounts = new Map(); // INSERT (blok) adetleri

  const addLength = (layer, meters) => {
    const key = `${layer}||length`;
    const b = buckets.get(key) || { layer, metric: 'length', value: 0, count: 0 };
    b.value += meters;
    b.count += 1;
    buckets.set(key, b);
  };
  const addArea = (layer, sqMeters) => {
    const key = `${layer}||area`;
    const b = buckets.get(key) || { layer, metric: 'area', value: 0, count: 0 };
    b.value += sqMeters;
    b.count += 1;
    buckets.set(key, b);
  };
  const addVolume = (layer, cubicMeters) => {
    const key = `${layer}||volume`;
    const b = buckets.get(key) || { layer, metric: 'volume', value: 0, count: 0 };
    b.value += cubicMeters;
    b.count += 1;
    buckets.set(key, b);
  };

  for (const e of dxf.entities) {
    const layer = e.layer || '0';
    switch (e.type) {
      case 'LINE': {
        if (e.vertices?.length >= 2) {
          addLength(layer, dist(e.vertices[0], e.vertices[1]) * factor);
        } else if (e.start && e.end) {
          addLength(layer, dist(e.start, e.end) * factor);
        }
        break;
      }
      case 'LWPOLYLINE':
      case 'POLYLINE': {
        const verts = e.vertices || [];
        const closed = Boolean(e.shape || e.closed);
        addLength(layer, polylineLength(verts, closed) * factor);
        if (closed && verts.length >= 3) {
          const area = polygonArea(verts) * factor * factor;
          addArea(layer, area);
          // Ekstruzyon (thickness/kalinlik) varsa kapali poligon -> hacim (or. beton doseme/perde).
          // dxf-parser LWPOLYLINE'da kod 39'u `depth` alanina koyar.
          const th = Math.abs(e.thickness ?? e.depth ?? 0) * factor;
          if (th > 0) addVolume(layer, area * th);
        }
        break;
      }
      case 'CIRCLE': {
        const r = (e.radius || 0);
        const area = Math.PI * r * r * factor * factor;
        addLength(layer, 2 * Math.PI * r * factor); // cevre
        addArea(layer, area);
        const th = Math.abs(e.thickness || 0) * factor;
        if (th > 0) addVolume(layer, area * th); // or. daire kesitli kolon
        break;
      }
      case '3DFACE': {
        // Uc/dort noktali yuzey -> alan (statik pafta, temel yuzeyleri)
        const vs = e.vertices || [];
        if (vs.length >= 3) {
          addArea(layer, polygonArea(vs) * factor * factor);
        }
        break;
      }
      case 'ARC': {
        addLength(layer, arcLength(e.radius || 0, e.startAngle, e.endAngle) * factor);
        break;
      }
      case 'INSERT': {
        const name = e.name || 'blok';
        blockCounts.set(name, (blockCounts.get(name) || 0) + 1);
        break;
      }
      default:
        break;
    }
  }

  const round = (n) => Math.round(n * 1000) / 1000;
  const items = [];

  for (const b of buckets.values()) {
    if (b.metric === 'length') {
      items.push({
        name: `${b.layer} - Uzunluk`,
        category: 'Uzunluk',
        layer: b.layer,
        quantity: round(b.value),
        unit: 'm',
        unitPrice: 0,
        entities: b.count,
      });
    } else if (b.metric === 'volume') {
      items.push({
        name: `${b.layer} - Hacim (Beton)`,
        category: 'Hacim',
        layer: b.layer,
        quantity: round(b.value),
        unit: 'm3',
        unitPrice: 0,
        entities: b.count,
      });
    } else {
      items.push({
        name: `${b.layer} - Alan`,
        category: 'Alan',
        layer: b.layer,
        quantity: round(b.value),
        unit: 'm2',
        unitPrice: 0,
        entities: b.count,
      });
    }
  }

  for (const [name, count] of blockCounts.entries()) {
    items.push({
      name,
      category: 'Adet',
      layer: name,
      quantity: count,
      unit: 'adet',
      unitPrice: 0,
      entities: count,
    });
  }

  items.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));

  const totalLength = items
    .filter((i) => i.unit === 'm')
    .reduce((s, i) => s + i.quantity, 0);
  const totalArea = items
    .filter((i) => i.unit === 'm2')
    .reduce((s, i) => s + i.quantity, 0);
  const totalVolume = items
    .filter((i) => i.unit === 'm3')
    .reduce((s, i) => s + i.quantity, 0);
  const totalCount = items
    .filter((i) => i.unit === 'adet')
    .reduce((s, i) => s + i.quantity, 0);

  const warnings = [];
  if (insUnits === 0) {
    warnings.push(
      'Cizimde birim ($INSUNITS) tanimli degil; degerler cizim biriminde birebir alindi (metre varsayildi). Sonuclari olcege gore kontrol edin.'
    );
  }
  if (items.length === 0) {
    warnings.push('Cizimde metraj cikarilacak geometri (cizgi/poligon/blok) bulunamadi.');
  }

  return {
    scale: `Birim: ${unitName}`,
    items,
    summary: {
      engine: 'dxf-geometri',
      entityCount: dxf.entities.length,
      unit: unitName,
      totals: {
        length_m: round(totalLength),
        area_m2: round(totalArea),
        volume_m3: round(totalVolume),
        count: totalCount,
      },
      warnings,
    },
  };
};

export default parseDxfMetraj;

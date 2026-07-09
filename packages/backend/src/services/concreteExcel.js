import ExcelJS from 'exceljs';

/**
 * "Beton Cetveli" - profesyonel beton hacim cetveli (ВЕДОМОСТЬ ОБЪЁМОВ БЕТОННЫХ РАБОТ).
 * Yalnizca BETON kalemlerini, formul ve beton sinifiyla birlikte, sinif ozeti ve
 * toplamla profesyonel bir Excel olarak uretir.
 *
 * @param {Object} data
 * @param {string} data.project    - proje basligi (or. "SKL-15x9 depo")
 * @param {Array}  data.rows       - [{ name, cls, formula, volume }]  (volume: m3 tabaninda)
 * @param {string} [data.unit]     - cikti birimi: 'CY' (yd3, varsayilan) veya 'm3'
 * @param {string[]} [data.notes]  - dipnotlar
 * @returns {Promise<Buffer>}
 */
export const buildConcreteExcel = async (data) => {
  // Cikti birimi (etiket) ve giris biriminden tek noktada donusum (cift donusum yok).
  const unit = (data.unit || 'CY').toUpperCase() === 'M3' ? 'm3' : 'CY';
  const inputUnit = (data.inputUnit || 'm3').toUpperCase() === 'CY' ? 'CY' : 'm3';
  const K = 1.307950619;                             // 1 m3 = 1.307950619 CY
  const toM3 = (v) => (inputUnit === 'CY' ? v / K : v);
  const toOut = (m3) => (unit === 'CY' ? m3 * K : m3);
  const conv = (v) => toOut(toM3(Number(v) || 0));
  const uLabel = unit === 'CY' ? 'CY (yd³)' : 'м³';
  const rows = (data.rows || []).map((r) => ({
    name: r.name || '',
    cls: r.cls || '',
    formula: r.formula || '',
    volume: conv(r.volume),
  }));

  const wb = new ExcelJS.Workbook();
  wb.creator = 'YaTracing';
  wb.created = new Date();
  const ws = wb.addWorksheet('Бетон', { views: [{ state: 'frozen', ySplit: 6 }] });

  ws.columns = [
    { width: 6 }, { width: 48 }, { width: 12 }, { width: 40 }, { width: 12 },
  ];

  const thin = { style: 'thin', color: { argb: 'FFB0B8C0' } };
  const border = { top: thin, left: thin, bottom: thin, right: thin };

  // Baslik
  ws.mergeCells('A1:E1');
  ws.getCell('A1').value = data.project || 'Бетон — ведомость объёмов';
  ws.getCell('A1').font = { size: 14, bold: true };
  ws.getCell('A1').alignment = { horizontal: 'center' };

  ws.mergeCells('A2:E2');
  ws.getCell('A2').value = 'ВЕДОМОСТЬ ОБЪЁМОВ БЕТОННЫХ РАБОТ  (раздел КЖ)';
  ws.getCell('A2').font = { size: 12, bold: true };
  ws.getCell('A2').alignment = { horizontal: 'center' };

  ws.mergeCells('A3:E3');
  ws.getCell('A3').value = 'Пров.: YaTracing (Claude)   •   Стадия: Р   •   Объём бетона «в деле» (чистый геометрический)';
  ws.getCell('A3').font = { size: 9, italic: true, color: { argb: 'FF666666' } };
  ws.getCell('A3').alignment = { horizontal: 'center' };

  // Tablo basligi (satir 5)
  const head = ['№', 'Наименование работ', 'Класс бетона', 'Формула подсчёта', `Объём, ${uLabel}`];
  const hr = ws.getRow(5);
  head.forEach((h, i) => {
    const c = hr.getCell(i + 1);
    c.value = h;
    c.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2C3E50' } };
    c.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    c.border = border;
  });
  hr.height = 28;

  // Satirlar
  let r = 6;
  let total = 0;
  rows.forEach((row, i) => {
    total += row.volume;
    const rr = ws.getRow(r);
    rr.getCell(1).value = i + 1;
    rr.getCell(2).value = row.name;
    rr.getCell(3).value = row.cls;
    rr.getCell(4).value = row.formula;
    rr.getCell(5).value = Math.round(row.volume * 100000) / 100000;
    rr.getCell(5).numFmt = '#,##0.000';
    rr.getCell(1).alignment = { horizontal: 'center' };
    rr.getCell(3).alignment = { horizontal: 'center' };
    rr.getCell(5).alignment = { horizontal: 'right' };
    for (let c = 1; c <= 5; c += 1) rr.getCell(c).border = border;
    r += 1;
  });

  // ИТОГО
  const tr = ws.getRow(r);
  ws.mergeCells(`A${r}:D${r}`);
  tr.getCell(1).value = 'ИТОГО бетон (все классы)';
  tr.getCell(1).font = { bold: true };
  tr.getCell(1).alignment = { horizontal: 'right' };
  tr.getCell(5).value = Math.round(total * 100000) / 100000;
  tr.getCell(5).numFmt = '#,##0.000';
  tr.getCell(5).font = { bold: true };
  for (let c = 1; c <= 5; c += 1) tr.getCell(c).border = border;
  r += 2;

  // Sinif ozeti
  const byClass = new Map();
  rows.forEach((row) => {
    const k = row.cls || '(sınıfsız)';
    byClass.set(k, (byClass.get(k) || 0) + row.volume);
  });
  if (byClass.size) {
    ws.mergeCells(`A${r}:E${r}`);
    ws.getCell(`A${r}`).value = 'СВОДКА ПО КЛАССАМ БЕТОНА';
    ws.getCell(`A${r}`).font = { bold: true };
    ws.getCell(`A${r}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFECEFF3' } };
    r += 1;
    const shr = ws.getRow(r);
    ['Класс', `Объём, ${uLabel}`].forEach((h, i) => {
      const cell = shr.getCell(i === 0 ? 1 : 5);
      cell.value = h; cell.font = { bold: true }; cell.border = border;
    });
    ws.mergeCells(`A${r}:D${r}`);
    r += 1;
    for (const [cls, vol] of [...byClass.entries()].sort()) {
      const cr = ws.getRow(r);
      ws.mergeCells(`A${r}:D${r}`);
      cr.getCell(1).value = cls;
      cr.getCell(5).value = Math.round(vol * 100000) / 100000;
      cr.getCell(5).numFmt = '#,##0.000';
      cr.getCell(5).alignment = { horizontal: 'right' };
      for (let c = 1; c <= 5; c += 1) cr.getCell(c).border = border;
      r += 1;
    }
    const itr = ws.getRow(r);
    ws.mergeCells(`A${r}:D${r}`);
    itr.getCell(1).value = 'ИТОГО';
    itr.getCell(1).font = { bold: true };
    itr.getCell(1).alignment = { horizontal: 'right' };
    itr.getCell(5).value = Math.round(total * 100000) / 100000;
    itr.getCell(5).numFmt = '#,##0.000';
    itr.getCell(5).font = { bold: true };
    for (let c = 1; c <= 5; c += 1) itr.getCell(c).border = border;
    r += 2;
  }

  // Notlar
  const notes = data.notes && data.notes.length ? data.notes : [
    'Объёмы даны как «бетон в деле» (чистый геометрический объём), без коэффициентов на потери/добор.',
    'Значения рассчитаны по размерам, снятым с чертежа; проверьте размеры перед применением.',
    ...(unit === 'CY' ? ['Объёмы в CY (куб. ярд): 1 CY = 27 ft³ = 0.7646 м³.'] : []),
  ];
  ws.mergeCells(`A${r}:E${r}`);
  ws.getCell(`A${r}`).value = 'ПРИМЕЧАНИЯ И ДОПУЩЕНИЯ';
  ws.getCell(`A${r}`).font = { bold: true };
  r += 1;
  notes.forEach((n, i) => {
    ws.mergeCells(`A${r}:E${r}`);
    ws.getCell(`A${r}`).value = `${i + 1}. ${n}`;
    ws.getCell(`A${r}`).alignment = { wrapText: true };
    ws.getCell(`A${r}`).font = { size: 9, color: { argb: 'FF555555' } };
    r += 1;
  });

  return wb.xlsx.writeBuffer();
};

export default buildConcreteExcel;

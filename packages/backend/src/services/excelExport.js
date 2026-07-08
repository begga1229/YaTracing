import ExcelJS from 'exceljs';

/**
 * Metraj sonucunu Excel (.xlsx) tablosuna cevirir ve buffer olarak dondurur.
 */
export const buildMetrajExcel = async (takeoff) => {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'YaTracing';
  wb.created = new Date();

  const ws = wb.addWorksheet('Metraj', {
    views: [{ state: 'frozen', ySplit: 5 }],
  });

  // Baslik bloku
  ws.mergeCells('A1:H1');
  ws.getCell('A1').value = 'METRAJ CETVELI (Quantity Takeoff)';
  ws.getCell('A1').font = { size: 16, bold: true };
  ws.getCell('A1').alignment = { horizontal: 'center' };

  ws.getCell('A2').value = 'Metraj Adi:';
  ws.getCell('A2').font = { bold: true };
  ws.getCell('B2').value = takeoff.name || '';

  ws.getCell('A3').value = 'Kaynak / Motor:';
  ws.getCell('A3').font = { bold: true };
  ws.getCell('B3').value = `${takeoff.source || ''} - ${takeoff.summary?.engine || ''}`;
  ws.getCell('E3').value = 'Dosya:';
  ws.getCell('E3').font = { bold: true };
  ws.getCell('F3').value = takeoff.fileName || '';

  ws.getCell('A4').value = 'Olcek:';
  ws.getCell('A4').font = { bold: true };
  ws.getCell('B4').value = takeoff.scale || '';
  ws.getCell('E4').value = 'Tarih:';
  ws.getCell('E4').font = { bold: true };
  ws.getCell('F4').value = new Date().toLocaleString('tr-TR');

  // Toplam beton (m3) - ozet bilgisi (varsa summary.totals'dan, yoksa kalemlerden)
  const volFromItems = (takeoff.items || [])
    .filter((it) => /m3|m³/i.test(it.unit || ''))
    .reduce((s, it) => s + (Number(it.quantity) || 0), 0);
  const totalBeton = takeoff.summary?.totals?.volume_m3 ?? volFromItems;
  ws.getCell('C4').value = 'Toplam Beton (m3):';
  ws.getCell('C4').font = { bold: true, color: { argb: 'FF1E7E34' } };
  ws.getCell('D4').value = Math.round(totalBeton * 1000) / 1000;
  ws.getCell('D4').numFmt = '#,##0.000';
  ws.getCell('D4').font = { bold: true, color: { argb: 'FF1E7E34' } };

  // Tablo basligi (5. satir)
  const headerRow = ws.getRow(5);
  const headers = ['No', 'Poz / Eleman', 'Kategori', 'Katman / Not', 'Miktar', 'Birim', 'Birim Fiyat', 'Tutar'];
  headers.forEach((h, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = h;
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2C3E50' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = { bottom: { style: 'thin' } };
  });

  const items = takeoff.items || [];
  let rowIdx = 6;
  let grandTotal = 0;

  items.forEach((it, i) => {
    const qty = Number(it.quantity) || 0;
    const price = Number(it.unitPrice) || 0;
    const amount = qty * price;
    grandTotal += amount;

    const row = ws.getRow(rowIdx);
    row.getCell(1).value = i + 1;
    row.getCell(2).value = it.name || '';
    row.getCell(3).value = it.category || '';
    row.getCell(4).value = it.layer || '';
    row.getCell(5).value = qty;
    row.getCell(5).numFmt = '#,##0.000';
    row.getCell(6).value = it.unit || '';
    row.getCell(7).value = price;
    row.getCell(7).numFmt = '#,##0.00';
    row.getCell(8).value = { formula: `E${rowIdx}*G${rowIdx}` };
    row.getCell(8).numFmt = '#,##0.00';
    rowIdx += 1;
  });

  // Toplam satiri
  const totalRow = ws.getRow(rowIdx + 1);
  totalRow.getCell(7).value = 'TOPLAM:';
  totalRow.getCell(7).font = { bold: true };
  // Canli formul: kullanici Excel'de birim fiyati degistirince tutar ve toplam
  // otomatik guncellenir (statik deger yerine SUM kullaniyoruz).
  totalRow.getCell(8).value = items.length
    ? { formula: `SUM(H6:H${rowIdx - 1})`, result: grandTotal }
    : grandTotal;
  totalRow.getCell(8).numFmt = '#,##0.00';
  totalRow.getCell(8).font = { bold: true };

  // Sutun genislikleri
  ws.columns = [
    { width: 6 }, { width: 32 }, { width: 14 }, { width: 24 },
    { width: 14 }, { width: 8 }, { width: 14 }, { width: 16 },
  ];

  // Uyarilar sayfasi
  const warnings = takeoff.summary?.warnings || [];
  const notes = takeoff.summary?.notes;
  if (warnings.length || notes) {
    const nws = wb.addWorksheet('Notlar & Uyarilar');
    nws.getCell('A1').value = 'Notlar & Uyarilar';
    nws.getCell('A1').font = { size: 14, bold: true };
    let r = 3;
    if (notes) {
      nws.getCell(`A${r}`).value = `Not: ${notes}`;
      r += 2;
    }
    warnings.forEach((w) => {
      nws.getCell(`A${r}`).value = `• ${w}`;
      r += 1;
    });
    nws.getColumn(1).width = 100;
  }

  return wb.xlsx.writeBuffer();
};

export default buildMetrajExcel;

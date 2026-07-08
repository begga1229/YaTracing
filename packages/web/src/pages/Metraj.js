import React, { useEffect, useState } from 'react';
import { takeoffAPI } from '../services/api';
import './Metraj.css';

const Metraj = () => {
  const [takeoffs, setTakeoffs] = useState([]);
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);

  const loadTakeoffs = async () => {
    try {
      const { data } = await takeoffAPI.getAll();
      setTakeoffs(data);
    } catch (e) {
      // sessizce gec - liste bos kalir
    }
  };

  useEffect(() => {
    loadTakeoffs();
  }, []);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setError('');
    if (!file) {
      setError('Lutfen bir cizim dosyasi secin (DXF, PDF, PNG, JPG).');
      return;
    }
    setLoading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('name', name || file.name);
      if (instructions) form.append('instructions', instructions);

      const { data } = await takeoffAPI.analyze(form);
      setSelected(data);
      setName('');
      setInstructions('');
      setFile(null);
      await loadTakeoffs();
    } catch (e2) {
      setError(e2.response?.data?.message || 'Analiz sirasinda hata olustu.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id, tName) => {
    setError('');
    try {
      const res = await takeoffAPI.downloadExcel(id);
      const blob = new Blob([res.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(tName || 'metraj').replace(/[^a-z0-9_\-]+/gi, '_')}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      // responseType 'blob' oldugundan hata govdesi de Blob gelir; JSON mesajini coz
      let msg = 'Excel indirilemedi.';
      try {
        const data = e.response?.data;
        if (data instanceof Blob) {
          const text = await data.text();
          msg = JSON.parse(text).message || msg;
        } else if (data?.message) {
          msg = data.message;
        }
      } catch (_) {
        /* mesaj cozulemedi, genel mesaji goster */
      }
      setError(`Excel indirilemedi: ${msg}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu metraj silinsin mi?')) return;
    try {
      await takeoffAPI.delete(id);
      if (selected?.id === id) setSelected(null);
      await loadTakeoffs();
    } catch (e) {
      setError('Silme islemi basarisiz (giris gerekli olabilir).');
    }
  };

  const items = selected?.items || [];
  const warnings = selected?.summary?.warnings || [];

  return (
    <div className="metraj">
      <h1>📐 Metraj (Yapay Zeka Metraj Hesabi)</h1>
      <p className="metraj-sub">
        Insaat cizimini yukleyin; AI okuyarak metraj cikarsin ve Excel olarak indirin.
        <br />
        <strong>DXF</strong> dosyalari geometriden <em>kesin</em> hesaplanir;{' '}
        <strong>PDF / goruntu</strong> dosyalari Claude Vision ile analiz edilir (tahmini).
      </p>

      <form className="metraj-form" onSubmit={handleAnalyze}>
        <div className="field">
          <label>Cizim dosyasi (.dxf, .pdf, .png, .jpg)</label>
          <input
            type="file"
            accept=".dxf,.pdf,.png,.jpg,.jpeg,.webp,application/pdf,image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <div className="field">
          <label>Metraj adi (opsiyonel)</label>
          <input
            type="text"
            value={name}
            placeholder="or. Zemin Kat Duvar Metraji"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="field">
          <label>AI icin ek talimat (yalnizca PDF/goruntu icin, opsiyonel)</label>
          <input
            type="text"
            value={instructions}
            placeholder="or. Sadece dis duvarlari hesapla"
            onChange={(e) => setInstructions(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Analiz ediliyor...' : 'Metraj Cikar'}
        </button>
      </form>

      {error && <div className="metraj-error">{error}</div>}

      {selected && (
        <div className="metraj-result">
          <div className="result-head">
            <div>
              <h2>{selected.name}</h2>
              <span className="badge">{selected.source === 'dxf' ? 'DXF (kesin)' : 'AI Vision (tahmini)'}</span>
              <span className="scale">{selected.scale}</span>
            </div>
            <button className="excel-btn" onClick={() => handleDownload(selected.id, selected.name)}>
              ⬇️ Excel indir
            </button>
          </div>

          {warnings.length > 0 && (
            <ul className="warnings">
              {warnings.map((w, i) => (
                <li key={i}>⚠️ {w}</li>
              ))}
            </ul>
          )}

          <table className="metraj-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Poz / Eleman</th>
                <th>Kategori</th>
                <th>Katman / Not</th>
                <th>Miktar</th>
                <th>Birim</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{it.name}</td>
                  <td>{it.category}</td>
                  <td>{it.layer}</td>
                  <td className="num">{it.quantity}</td>
                  <td>{it.unit}</td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty">Metraj kalemi bulunamadi.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="list-title">Kaydedilen Metrajlar</h2>
      <table className="metraj-table">
        <thead>
          <tr>
            <th>Ad</th>
            <th>Kaynak</th>
            <th>Dosya</th>
            <th>Kalem</th>
            <th>Islem</th>
          </tr>
        </thead>
        <tbody>
          {takeoffs.map((t) => (
            <tr key={t.id}>
              <td>{t.name}</td>
              <td>{t.source === 'dxf' ? 'DXF' : 'AI Vision'}</td>
              <td>{t.fileName}</td>
              <td>{(t.items || []).length}</td>
              <td className="actions">
                <button onClick={() => setSelected(t)}>Goster</button>
                <button onClick={() => handleDownload(t.id, t.name)}>Excel</button>
                <button className="danger" onClick={() => handleDelete(t.id)}>Sil</button>
              </td>
            </tr>
          ))}
          {takeoffs.length === 0 && (
            <tr>
              <td colSpan="5" className="empty">Henuz metraj yok.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Metraj;

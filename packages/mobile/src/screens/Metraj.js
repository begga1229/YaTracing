import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Linking,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { takeoffAPI } from '../services/api';

const Metraj = () => {
  const [picked, setPicked] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const pickFile = async () => {
    setError('');
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'image/*',
          'application/dxf',
          'application/octet-stream',
          '*/*',
        ],
        copyToCacheDirectory: true,
      });
      // Expo SDK 49: res.assets[0]; eski surumler: res
      const asset = res?.assets ? res.assets[0] : res;
      if (asset && (asset.uri || asset.type !== 'cancel')) {
        setPicked(asset);
      }
    } catch (e) {
      setError('Dosya secilemedi.');
    }
  };

  const analyze = async () => {
    if (!picked) {
      setError('Once bir cizim dosyasi secin.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const form = new FormData();
      form.append('file', {
        uri: picked.uri,
        name: picked.name || 'cizim',
        type: picked.mimeType || 'application/octet-stream',
      });
      form.append('name', picked.name || 'Metraj');

      const { data } = await takeoffAPI.analyze(form);
      setResult(data);
    } catch (e) {
      setError(e.response?.data?.message || 'Analiz sirasinda hata olustu.');
    } finally {
      setLoading(false);
    }
  };

  const items = result?.items || [];
  const warnings = result?.summary?.warnings || [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>📐 Metraj</Text>
      <Text style={styles.sub}>
        Insaat cizimini (DXF, PDF, JPG, PNG) yukleyin; yapay zeka metraj cikarsin.
      </Text>

      <TouchableOpacity style={styles.pickBtn} onPress={pickFile}>
        <Text style={styles.pickBtnText}>
          {picked ? `📎 ${picked.name}` : 'Cizim dosyasi sec'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.analyzeBtn, loading && styles.disabled]}
        onPress={analyze}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.analyzeBtnText}>Metraj Cikar</Text>
        )}
      </TouchableOpacity>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {result && (
        <View style={styles.result}>
          <Text style={styles.resultTitle}>{result.name}</Text>
          <Text style={styles.badge}>
            {result.source === 'dxf' ? 'DXF (kesin)' : 'AI Vision (tahmini)'} · {result.scale}
          </Text>

          {warnings.map((w, i) => (
            <Text key={i} style={styles.warning}>⚠️ {w}</Text>
          ))}

          <View style={styles.tableHead}>
            <Text style={[styles.cell, styles.flex2, styles.headText]}>Eleman</Text>
            <Text style={[styles.cell, styles.headText]}>Miktar</Text>
            <Text style={[styles.cell, styles.headText]}>Birim</Text>
          </View>
          {items.map((it, i) => (
            <View key={i} style={styles.row}>
              <Text style={[styles.cell, styles.flex2]}>{it.name}</Text>
              <Text style={styles.cell}>{it.quantity}</Text>
              <Text style={styles.cell}>{it.unit}</Text>
            </View>
          ))}
          {items.length === 0 && <Text style={styles.empty}>Metraj kalemi bulunamadi.</Text>}

          <TouchableOpacity
            style={styles.excelBtn}
            onPress={() => Linking.openURL(takeoffAPI.excelUrl(result.id))}
          >
            <Text style={styles.excelBtnText}>⬇️ Excel indir</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 6 },
  sub: { color: '#555', marginBottom: 16, lineHeight: 20 },
  pickBtn: {
    borderWidth: 1,
    borderColor: '#cbd5e0',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  pickBtnText: { color: '#2c3e50', fontWeight: '600' },
  analyzeBtn: {
    backgroundColor: '#2c3e50',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  analyzeBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  disabled: { opacity: 0.6 },
  error: { color: '#b71c1c', marginBottom: 12 },
  result: { marginTop: 8 },
  resultTitle: { fontSize: 18, fontWeight: 'bold' },
  badge: { color: '#1a56db', marginBottom: 10, marginTop: 2 },
  warning: { color: '#7a5c00', marginBottom: 4 },
  tableHead: {
    flexDirection: 'row',
    backgroundColor: '#2c3e50',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  headText: { color: '#fff', fontWeight: '700' },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#eee' },
  cell: { flex: 1, padding: 8, fontSize: 13 },
  flex2: { flex: 2 },
  empty: { textAlign: 'center', color: '#888', padding: 16 },
  excelBtn: {
    backgroundColor: '#1e7e34',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  excelBtnText: { color: '#fff', fontWeight: '700' },
});

export default Metraj;

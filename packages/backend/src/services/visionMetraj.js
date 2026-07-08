import Anthropic from '@anthropic-ai/sdk';

/**
 * Claude Vision ile PDF / goruntu insaat cizimlerinden metraj cikarimi.
 *
 * DXF gibi gercek koordinat tasimayan cizimlerde AI, elemanlari ve olcek
 * etiketlerini okuyarak yaklasik metraj uretir. Sonuclar tahminidir;
 * kesin sonuc icin DXF motoru kullanilmalidir.
 */

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-opus-4-8';

// Structured output semasi -> AI her zaman bu formatta JSON dondurur
const METRAJ_SCHEMA = {
  type: 'object',
  properties: {
    scale: {
      type: 'string',
      description: 'Cizimde okunan olcek (or. "1:100") veya "belirsiz"',
    },
    items: {
      type: 'array',
      description: 'Cizimden cikarilan metraj kalemleri',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Eleman/poz adi (or. "Dis duvar", "Kapi K1")' },
          category: {
            type: 'string',
            description: 'Kategori: Uzunluk, Alan, Adet, Hacim vb.',
          },
          quantity: { type: 'number', description: 'Hesaplanan miktar' },
          unit: { type: 'string', description: 'Birim: m, m2, m3, adet' },
          note: { type: 'string', description: 'Varsayim veya aciklama (opsiyonel)' },
        },
        required: ['name', 'category', 'quantity', 'unit', 'note'],
        additionalProperties: false,
      },
    },
    warnings: {
      type: 'array',
      description: 'Guvenilirlik / okunabilirlik uyarilari',
      items: { type: 'string' },
    },
    notes: { type: 'string', description: 'Genel yontem/varsayim notlari' },
  },
  required: ['scale', 'items', 'warnings', 'notes'],
  additionalProperties: false,
};

const SYSTEM_PROMPT = `Sen deneyimli bir insaat metraj (quantity takeoff) uzmanisin.
Sana verilen insaat cizimini (mimari/statik pafta) dikkatle incele ve metraj cikar.

Kurallar:
- Once cizimdeki olcek etiketini (or. 1:50, 1:100) ve olcu cizgilerini/kotalarini bul.
- Duvar/eksen uzunluklarini "m", doseme/alan bilgilerini "m2", kolon/kiris/donati hacmini "m3", kapi/pencere/kolon gibi elemanlari "adet" olarak hesapla.
- Her kalem icin makul bir varsayim yaptiysan "note" alanina yaz.
- Okunamayan veya belirsiz olan seyleri "warnings" listesine ekle; uydurma deger URETME.
- Cizimde olcek yoksa bunu acikca uyari olarak belirt ve miktarlari orantisal/tahmini oldugu notuyla ver.
- Tum metin ciktilarini Turkce yaz.`;

const mediaTypeFor = (mimetype = '', fileName = '') => {
  const lower = (mimetype || '').toLowerCase();
  if (lower.includes('pdf')) return { kind: 'pdf', media: 'application/pdf' };
  if (lower.includes('png')) return { kind: 'image', media: 'image/png' };
  if (lower.includes('jpeg') || lower.includes('jpg')) return { kind: 'image', media: 'image/jpeg' };
  if (lower.includes('webp')) return { kind: 'image', media: 'image/webp' };
  if (lower.includes('gif')) return { kind: 'image', media: 'image/gif' };

  const ext = fileName.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return { kind: 'pdf', media: 'application/pdf' };
  if (ext === 'png') return { kind: 'image', media: 'image/png' };
  if (ext === 'jpg' || ext === 'jpeg') return { kind: 'image', media: 'image/jpeg' };
  if (ext === 'webp') return { kind: 'image', media: 'image/webp' };
  if (ext === 'gif') return { kind: 'image', media: 'image/gif' };
  return null;
};

/**
 * @param {Buffer} buffer - dosya icerigi
 * @param {string} mimetype
 * @param {string} fileName
 * @param {string} [instructions] - kullanicidan ek talimat
 * @returns {{ items: Array, summary: Object, scale: string }}
 */
export const analyzeVisionMetraj = async (buffer, mimetype, fileName = '', instructions = '') => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    const err = new Error(
      'ANTHROPIC_API_KEY tanimli degil. PDF/goruntu cizim analizi icin backend .env dosyasina API anahtari ekleyin.'
    );
    err.status = 400;
    throw err;
  }

  const target = mediaTypeFor(mimetype, fileName);
  if (!target) {
    const err = new Error('Desteklenmeyen dosya turu. PDF, PNG, JPG veya WEBP yukleyin.');
    err.status = 400;
    throw err;
  }

  const client = new Anthropic({ apiKey });
  const base64 = buffer.toString('base64');

  const docBlock = target.kind === 'pdf'
    ? { type: 'document', source: { type: 'base64', media_type: target.media, data: base64 } }
    : { type: 'image', source: { type: 'base64', media_type: target.media, data: base64 } };

  const userText = instructions
    ? `Bu insaat cizimini metraj cikaracak sekilde analiz et. Ek talimat: ${instructions}`
    : 'Bu insaat cizimini metraj cikaracak sekilde analiz et.';

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 16000,
    system: SYSTEM_PROMPT,
    thinking: { type: 'adaptive' },
    output_config: {
      effort: 'high',
      format: { type: 'json_schema', schema: METRAJ_SCHEMA },
    },
    messages: [
      {
        role: 'user',
        content: [docBlock, { type: 'text', text: userText }],
      },
    ],
  });

  const textBlock = response.content.find((b) => b.type === 'text');
  if (!textBlock) {
    throw new Error('Model metraj sonucu dondurmedi.');
  }

  let parsed;
  try {
    parsed = JSON.parse(textBlock.text);
  } catch (e) {
    throw new Error('Model ciktisi cozumlenemedi (gecersiz JSON).');
  }

  const items = (parsed.items || []).map((it) => ({
    name: it.name || 'Eleman',
    category: it.category || 'Diger',
    layer: it.note || '',
    quantity: Number(it.quantity) || 0,
    unit: it.unit || 'adet',
    unitPrice: 0,
  }));

  return {
    scale: parsed.scale ? `Olcek: ${parsed.scale}` : 'Olcek: belirsiz (AI-tahmini)',
    items,
    summary: {
      engine: `claude-vision (${MODEL})`,
      scaleRead: parsed.scale || 'belirsiz',
      notes: parsed.notes || '',
      warnings: parsed.warnings || [],
      usage: response.usage,
    },
  };
};

export default analyzeVisionMetraj;

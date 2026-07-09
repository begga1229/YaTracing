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
          unit: { type: 'string', description: 'Birim: m, m2, m3, adet, ton' },
          note: { type: 'string', description: 'HESAP FORMULU (or. "1.8·1.8·0.4·12") ve varsayimlar' },
          concrete_class: { type: 'string', description: 'Beton sinifi (or. B20, B25, C20/25). Beton degilse bos birak.' },
        },
        required: ['name', 'category', 'quantity', 'unit', 'note', 'concrete_class'],
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

const SYSTEM_PROMPT = `Sen deneyimli bir insaat metraj (quantity takeoff) ve beton hesabi uzmanisin.
Sana verilen insaat cizimini (mimari/statik pafta) dikkatle incele ve ELEMAN-ELEMAN metraj cikar.

## Yontem (cok onemli - bu adimlari sirayla uygula)
1. Once OLCEGI bul (or. 1:50, 1:100) ve olcu cizgilerini/kotalarini oku. Olcek yoksa acikca belirt.
2. Betonu tek bir toplam olarak DEGIL, her yapisal eleman icin AYRI hesapla:
   - Grobeton / hazirlik betonu (podkladka)
   - Temel (taban + soket / podosva + podkolonnik)
   - Kolonlar
   - Kirisler
   - Doseme / plak
   - Perde / duvar betonu
   - Zemin betonu / saplama
3. Her eleman icin: BOYUTLARI cizimden oku, ADEDI cizimden say, ve hacmi ac acik formulle hesapla:
   hacim = en x boy x yukseklik x adet.
   Bu formulu MUTLAKA "note" alanina yaz (or. "0.4 x 0.4 x 4.2 x 12 kolon").
4. Birimler ve kategoriler (KARISTIRMA - toplamlar buna gore ayrilir):
   - Yapisal BETON elemanlari (grobeton, temel, kolon, kiris, doseme, perde): category = "Beton", unit = "m3".
   - KAZI / hafriyat: category = "Kazi", unit = "m3" (bu TOPRAK, beton DEGIL - beton toplamina katma).
   - DONATI / demir: category = "Donati", unit = "ton" (kg ise 1000'e bol; ASLA m3 yazma).
   - GAZBETON / tugla / duvar orgusu: category = "Duvar", unit = "m3" veya "m2" (bu beton DEGIL, ayri malzeme).
   - Kalip: category = "Kalip", unit = "m2". Siva/boya: category = "Siva", unit = "m2".
   - Uzunluk "m", kapi/pencere gibi sayilabilir seyler "adet".

## Mantik kontrolu (halusinasyonu onlemek icin)
- Toplam beton, yapinin doseme alanina gore MAKUL olmali: tipik olarak kat alaninin
  metrekaresi basina ~0.3-0.9 m3 arasidir. Sonucun bu araligin cok disindaysa (or. 2 m3/m2)
  bir hata yapmissindir; boyutlari ve adetleri yeniden kontrol et.
- Ayni betonu iki kez sayma (or. kolonu hem kolon hem doseme icinde sayma).
- Emin olamadigin olcu/adet icin makul bir varsayim yap ve bunu "note" ve "warnings"a yaz.
  ASLA rastgele buyuk sayi uretme; emin degilsen dusuk/temkinli tahmin ver.

## Cikti
- Her elemani ayri "items" kalemi olarak ver. HESAP FORMULUNU "note" alanina yaz (or. "1.8·1.8·0.4·12").
- Her BETON elemani icin "concrete_class" alanina beton sinifini yaz (or. B20, B25, C20/25); pafta belirtmiyorsa makul bir varsayim yap ve warnings'e ekle.
- "notes" alanina: kullandigin olcek, kat alani ve toplam beton / kat alani oranini yaz.
- Tum metin ciktilarini Turkce yaz.`;

// ABD (imperial) cizimler icin US-native metraj: feet formulleri, hacim CY (=ft3/27)
const SYSTEM_PROMPT_US = `You are an experienced US construction quantity-takeoff and concrete estimator.
Carefully read the drawing and produce an ELEMENT-BY-ELEMENT concrete takeoff using US customary units.

## Method (follow in order)
1. Find the SCALE (e.g. 1/4"=1'-0", 1/8"=1'-0") and read dimension strings (feet-inches, e.g. 12'-6").
   Convert every dimension to DECIMAL FEET (12'-6" = 12.5 ft). If no scale, say so clearly.
2. Compute concrete for EACH structural element separately, NOT one lump sum:
   - Mud slab / lean concrete
   - Footings (spread footing + pier/pedestal)
   - Columns
   - Beams / grade beams
   - Slab / deck
   - Walls / shear walls
   - Slab-on-grade
3. For each element: read DIMENSIONS in feet, COUNT the quantity, and give an explicit formula.
   Concrete VOLUME must be in CUBIC YARDS (CY): volume_CY = (length_ft x width_ft x height_ft x count) / 27.
   Put the FULL formula in decimal FEET with the /27 in "note" (e.g. "5.9 x 5.9 x 1.3 x 12 / 27").
4. Units and categories (do NOT mix - totals are split by these):
   - Structural CONCRETE (mud slab, footings, columns, beams, slab, walls): category = "Concrete", unit = "CY".
   - EXCAVATION: category = "Excavation", unit = "CY" (this is soil, NOT concrete).
   - REBAR / steel: category = "Rebar", unit = "ton" (never CY).
   - CMU / masonry / stud wall: category = "Wall", unit = "SF" or "CY" (not structural concrete).
   - Formwork: category = "Formwork", unit = "SF". Lengths: unit = "LF". Counts: unit = "EA".

## Sanity check (prevent hallucination)
- Total concrete vs building floor area should be reasonable: typically ~0.008-0.025 CY per SF of floor.
  If far outside (e.g. 0.06 CY/SF), you made an error - recheck dimensions and counts.
- Do not double-count (e.g. column inside slab).
- For unclear dimensions make a reasonable assumption; note it in "note" and "warnings". Never invent large numbers.

## Output
- One "items" entry per element. Put the FEET formula (with /27) in "note".
- For each concrete item set "concrete_class" to the US class if shown (e.g. "3000 psi", "4000 psi"); otherwise assume and add to warnings.
- In "notes": scale used, floor area (SF), and total concrete / floor area ratio (CY/SF).
- Write all text output in English (US construction terms).`;

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
export const analyzeVisionMetraj = async (buffer, mimetype, fileName = '', instructions = '', unitSystem = 'metric') => {
  const isUS = String(unitSystem).toUpperCase() === 'US';
  const systemPrompt = isUS ? SYSTEM_PROMPT_US : SYSTEM_PROMPT;
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

  const baseText = isUS
    ? 'Analyze this construction drawing and produce a concrete takeoff in US units (feet formulas, volume in CY).'
    : 'Bu insaat cizimini metraj cikaracak sekilde analiz et.';
  const userText = instructions ? `${baseText} ${isUS ? 'Note' : 'Ek talimat'}: ${instructions}` : baseText;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 16000,
    system: systemPrompt,
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
    formula: it.note || '',
    concreteClass: it.concrete_class || '',
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

# 🚀 Metraj Servisini Yayına Alma (PDF + AI, iPad'den kullanım)

Bu kılavuz, metraj aracını **ücretsiz bir buluta** kurup iPad/PC'den tek adresle
kullanman içindir. Kurulunca: **DXF** cihazında, **PDF/fotoğraf** ise yapay zeka
(Claude Vision) ile okunur ve Excel indirilir.

> Not: Bu adımları senin adına yapamam çünkü kendi hesaplarını (Anthropic + Render)
> ve ödeme bilgini gerektiriyor. Kodun tamamı ve ayarlar hazır; aşağıyı takip et.

---

## 1) Anthropic API anahtarı al (PDF/fotoğraf için şart)
1. https://console.anthropic.com/ adresine gir, hesap aç.
2. **Billing**'den küçük bir bakiye ekle (kullandıkça öder; birkaç dolar test için yeter).
3. **API Keys → Create Key** → anahtarı kopyala (`sk-ant-...`). Bir yere kaydet.

## 2) Render.com'a ücretsiz kur (tek adım)
1. https://render.com adresine GitHub ile giriş yap.
2. **New → Blueprint** de ve `begga1229/YaTracing` reposunu seç.
   (Repoda hazır `render.yaml` var; Render gerekli ayarları otomatik okur.)
3. Sorulunca **ANTHROPIC_API_KEY** alanına 1. adımdaki anahtarı yapıştır.
4. **Apply / Deploy**'a bas. Birkaç dakikada yayına alınır.
5. Sana `https://yatracing-metraj.onrender.com` gibi bir **adres** verir.

## 3) iPad / PC'de kullan
1. O adresi iPad Safari veya PC tarayıcısında aç.
2. **Dosya Seç**:
   - **DXF** → anında, cihazında, kesin hesap.
   - **PDF / JPG / PNG** → sunucuya gider, yapay zeka okur (birkaç saniye).
3. Beton kalınlığını (cm) gir → **m³** hesaplanır.
4. **Excel indir** → sorunsuz iner (aynı origin, iframe yok).

---

## Notlar
- **Ücretsiz Render planı** bir süre kullanılmayınca "uyur"; ilk açılışta 30-60 sn
  gecikme olabilir, sonra hızlanır.
- PDF/fotoğraf sonuçları **tahminidir**; kesinlik için DXF kullan ve değerleri kontrol et.
- API kullanımı Anthropic tarafında (küçük) ücretlendirilir; sadece PDF/fotoğraf
  analizinde kullanılır, DXF ücretsizdir.
- Alternatif bulutlar (Railway, Fly.io) da çalışır; backend standart bir Node/Express
  uygulamasıdır (`packages/backend`, `npm start`).

## Yerelde denemek (isteğe bağlı, PC'de)
```bash
cd packages/backend
npm install
# .env içine ANTHROPIC_API_KEY=... ekle
npm start
# tarayıcıda: http://localhost:5000
```

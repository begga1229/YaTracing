# 📱 iPad'de Çalıştırma Kılavuzu (Expo Go)

Bu kılavuz, YaTracing mobil uygulamasını **kendi Windows/Linux bilgisayarında** çalıştırıp
**iPad'de Expo Go** ile açman için hazırlandı.

## Gereksinimler
- Bilgisayarında **Node.js LTS** (v18 veya v20 önerilir) — https://nodejs.org
- iPad'de App Store'dan **Expo Go** uygulaması
- Bilgisayar ile iPad **aynı WiFi ağında** olmalı

---

## 1) Bilgisayarının yerel IP adresini öğren
Uygulama, backend'e bu IP üzerinden bağlanacak (`localhost` iPad'de çalışmaz).

- **Windows:** `cmd` aç → `ipconfig` → "IPv4 Address" satırındaki değer (ör. `192.168.1.100`)
- **Linux/macOS:** `ip addr` veya `ifconfig` → `192.168.x.x` ile başlayan adres

## 2) API adresini ayarla
`packages/mobile/app.json` dosyasını aç, `extra.apiUrl` değerini kendi IP'nle değiştir:

```json
"extra": {
  "apiUrl": "http://192.168.1.100:5000/api"
}
```
> `192.168.1.100` yerine 1. adımda bulduğun IP'yi yaz. Sonundaki `/api` kalsın.

## 3) Backend'i başlat
Mobil uygulamanın veri çekebilmesi için backend çalışıyor olmalı.

**Kolay yol (Docker varsa):** proje kökünde
```bash
docker-compose up -d
```

**Docker yoksa (Node + PostgreSQL):**
```bash
cd packages/backend
npm install
cp .env.example .env   # Windows: copy .env.example .env
npm run dev
```
(PostgreSQL kurulu ve `.env` içindeki bilgilerle çalışıyor olmalı.)

> DXF metrajı için AI anahtarı gerekmez. PDF/görüntü analizi istiyorsan `.env` içine `ANTHROPIC_API_KEY` ekle.

## 4) Mobil uygulamayı başlat
Yeni bir terminal:
```bash
cd packages/mobile
npm install
npx expo install --fix   # paket sürümlerini yüklü Expo SDK'sına hizalar
npx expo start
```

Terminalde bir **QR kod** çıkacak.

## 5) iPad'de aç
1. iPad'de **Kamera** uygulamasını aç, QR kodu tara → çıkan bildirime dokun (Expo Go açılır).
   (Alternatif: Expo Go içindeki "Scan QR code" ile de tarayabilirsin.)
2. Uygulama yüklenir; alttaki sekmelerden **Metraj**'a git.

---

## Sık karşılaşılan sorunlar
- **Bağlanamıyor / sonsuz yükleniyor:** Bilgisayar ile iPad aynı WiFi'de mi? Bilgisayarın
  güvenlik duvarı 5000 ve 8081 portlarını engelliyor olabilir; Node/Expo'ya izin ver.
- **Expo Go "uyumsuz sürüm" diyorsa:** `npx expo install expo@latest && npx expo install --fix`
  komutlarını çalıştır, sonra tekrar `npx expo start`.
- **QR aynı ağda olmasına rağmen açılmıyorsa:** `npx expo start --tunnel` dene (biraz yavaştır
  ama farklı ağlarda da çalışır).

## Not: "Metraj Çıkar" butonunun tam çalışması
`/analyze` uç noktası kimlik doğrulama (giriş) ister. Mobil uygulamaya henüz giriş ekranı
bağlanmadı. Uygulamayı iPad'de görüp gezebilirsin; metraj çıkarımını uçtan uca test etmek
için mobil giriş akışını da bağlamamı istersen söylemen yeterli.

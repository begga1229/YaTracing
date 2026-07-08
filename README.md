# YaTracing - İnşaat Takip Uygulaması

🏗️ Profesyonel inşaat firmalarına yönelik kapsamlı takip ve yönetim uygulaması.

## Özellikler

- ✅ **Proje Yönetimi**: İnşaat projelerini takip et, vadeler ve bütçe yönet
- ✅ **Ekip Yönetimi**: İşçileri ve ekipleri organize et
- ✅ **Malzeme Takibi**: Tedarik zincirini yönet
- ✅ **İş Makineleri**: Ekipman takibi
- ✅ **Fotoğraf/Belge**: Proje belgelerini depolama
- ✅ **Gerçek Zamanlı**: Socket.io ile live updates
- ✅ **Harita Entegrasyonu**: GPS tabanlı konum takibi
- ✅ **Raporlama**: Kapsamlı analitikler ve raporlar
- ✅ **Bildirim**: Anlık bildirimler
- ✅ **Web & Mobil**: React web app + React Native mobil app

## Proje Yapısı (Monorepo)

```
YaTracing/
├── packages/
│   ├── backend/          # Node.js + Express API
│   ├── web/              # React Web Application
│   └── mobile/           # React Native Mobile App
├── docker-compose.yml    # Docker services
├── package.json          # Monorepo root
└── README.md
```

## Teknoloji Stack

### Backend
- **Node.js** + **Express.js**
- **PostgreSQL** (Database)
- **Socket.io** (Real-time updates)
- **JWT** (Authentication)
- **Multer** (File uploads)
- **Sequelize** (ORM)

### Frontend (Web)
- **React** 18+
- **TypeScript**
- **Redux** (State Management)
- **Leaflet** (Maps)
- **Axios** (HTTP Client)
- **Tailwind CSS** (Styling)

### Mobile
- **React Native**
- **TypeScript**
- **Redux**
- **React Navigation**
- **React Native Maps**

## Başlangıç

### Gereklilikler
- Node.js 18+
- npm 9+
- PostgreSQL 14+
- Docker & Docker Compose (opsiyonel)

### Kurulum

```bash
# Repository klonla
git clone https://github.com/begga1229/YaTracing.git
cd YaTracing

# Dependencies yükle
npm install

# Environment variables ayarla
cp packages/backend/.env.example packages/backend/.env
cp packages/web/.env.example packages/web/.env

# Veritabanı migration'larını çalıştır
cd packages/backend
npm run db:migrate

# Tüm uygulamaları başlat
cd ../..
npm run dev
```

### Docker ile Başlat

```bash
docker-compose up -d
```

## Komutlar

```bash
# Tümünü develop modda çalıştır
npm run dev

# Backend
cd packages/backend && npm run dev

# Web
cd packages/web && npm start

# Mobile
cd packages/mobile && npm start

# Tüm testleri çalıştır
npm run test

# Build
npm run build
```

## API Dokumentasyonu

Detaylı API dokumentasyonu için `/packages/backend/API.md` dosyasını kontrol edin.

## Database Schema

Detaylı schema tasarımı için `/packages/backend/schema.md` dosyasını kontrol edin.

## Katkıda Bulunma

1. Feature branch oluştur (`git checkout -b feature/AmazingFeature`)
2. Değişiklikleri commit et (`git commit -m 'Add AmazingFeature'`)
3. Branch'i push et (`git push origin feature/AmazingFeature`)
4. Pull Request aç

## Lisans

MIT License - Detaylar için LICENSE dosyasını kontrol edin.

## İletişim

📧 Email: info@yatracing.com
🌐 Website: https://yatracing.com
# 🏗️ YaTracing - Construction Management Platform

**YaTracing**, inşaat projelerini, ekipleri, malzemeleri ve ekipmanları yönetmek için modern, tam yığın bir platform.

## 🌟 Özellikler

- ✅ **Proje Yönetimi**: Projeler oluştur, izle ve yönet
- ✅ **Ekip Yönetimi**: Ekipler ve üyeler ekle
- ✅ **Malzeme Takibi**: Envanteri yönet
- ✅ **Ekipman Yönetimi**: Bakım ve durum takibi
- ✅ **Raporlar**: Özel raporlar oluştur
- ✅ **Gerçek Zamanlı Updates**: Socket.io ile canlı güncellemeler
- ✅ **Responsive Tasarım**: Web ve Mobile desteği
- ✅ **JWT Authentication**: Güvenli oturum yönetimi

## 🏗️ Mimari

```
YaTracing/
├── packages/
│   ├── backend/          # Node.js + Express API
│   ├── web/              # React Web App
│   ├── mobile/           # React Native Mobile App
│   └── todo-app/         # (Gelecek)
├── docker-compose.yml    # Docker setup
└── README.md
```

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js 16+
- PostgreSQL 13+
- Redis (opsiyonel)
- Docker & Docker Compose

### Docker ile Başlat (En Kolay)

```bash
git clone https://github.com/begga1229/YaTracing.git
cd YaTracing

# Tüm servisleri başlat
docker-compose up -d

# Database migration
docker-compose exec backend npm run migrate
```

**Erişim:**
- Web App: http://localhost:3000
- Backend API: http://localhost:5000
- PostgreSQL: localhost:5432
- Redis: localhost:6379

### Manuel Kurulum

#### 1️⃣ Backend Başlat

```bash
cd packages/backend
npm install
cp .env.example .env
npm run dev
```

Server şu adresinde: `http://localhost:5000`

#### 2️⃣ Web App Başlat

```bash
cd packages/web
npm install
npm start
```

Browser: `http://localhost:3000`

#### 3️⃣ Mobile App Başlat

```bash
cd packages/mobile
npm install
npm start
# iOS: `i` | Android: `a`
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Kayıt ol
- `POST /api/auth/login` - Giriş yap
- `GET /api/auth/verify` - Token doğrula

### Projects
- `GET /api/projects` - Tüm projeleri listele
- `GET /api/projects/:id` - Proje detayı
- `POST /api/projects` - Yeni proje oluştur
- `PUT /api/projects/:id` - Projeyi güncelle
- `DELETE /api/projects/:id` - Projeyi sil

### Teams
- `GET /api/teams` - Tüm ekipleri listele
- `POST /api/teams` - Yeni ekip oluştur
- `PUT /api/teams/:id` - Ekibi güncelle
- `DELETE /api/teams/:id` - Ekibi sil

### Materials
- `GET /api/materials` - Malzemeleri listele
- `POST /api/materials` - Malzeme ekle
- `PUT /api/materials/:id` - Malzemeyi güncelle
- `DELETE /api/materials/:id` - Malzemeyi sil

### Equipment
- `GET /api/equipment` - Ekipmanları listele
- `POST /api/equipment` - Ekipman ekle
- `PUT /api/equipment/:id` - Ekipmanı güncelle
- `DELETE /api/equipment/:id` - Ekipmanı sil

### Reports
- `GET /api/reports` - Raporları listele
- `POST /api/reports` - Rapor oluştur
- `PUT /api/reports/:id` - Raporu güncelle
- `DELETE /api/reports/:id` - Raporu sil

## 🧪 Testing

### Backend Tests

```bash
cd packages/backend
npm test
```

### Postman Collection

Postman'da yapılacaklar: https://www.postman.com/yatracing

## 🔧 Ortam Değişkenleri

### Backend (.env)

```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=yatracing
DB_USER=postgres
DB_PASSWORD=password
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:3000
REDIS_URL=redis://localhost:6379
```

### Web App (.env)

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### Mobile App (.env)

```env
REACT_APP_API_URL=http://your-api-url:5000/api
REACT_APP_SOCKET_URL=http://your-api-url:5000
```

## 📦 Teknoloji Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Cache**: Redis
- **Real-time**: Socket.io
- **Auth**: JWT, bcryptjs

### Web
- **Framework**: React 18
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Styling**: CSS3

### Mobile
- **Framework**: React Native
- **Expo**: Mobile SDK
- **Navigation**: React Navigation
- **State**: Redux

## 🐳 Docker

### Kurulum

```bash
# Build
docker-compose build

# Çalıştır
docker-compose up -d

# Loglar
docker-compose logs -f backend

# Durdur
docker-compose down
```

## 📖 Geliştirme

### Proje Yapısı

```
packages/backend/
├── src/
│   ├── config/        # Veritabanı konfigürasyonu
│   ├── models/        # Sequelize modelleri
│   ├── controllers/    # İş mantığı
│   ├── routes/        # API routes
│   ├── middleware/     # Custom middleware
│   └── index.js       # Server giriş noktası
���── .env.example
└── package.json

packages/web/
├── src/
│   ├── components/    # React bileşenleri
│   ├── pages/         # Sayfa bileşenleri
│   ├── redux/         # State management
│   ├── services/      # API servisleri
│   ├── App.js
│   └── index.js
└── package.json
```

## 🤝 Katkı

1. Fork et
2. Branch oluştur (`git checkout -b feature/amazing-feature`)
3. Commit et (`git commit -m 'Add amazing feature'`)
4. Push et (`git push origin feature/amazing-feature`)
5. Pull Request aç

## 📄 Lisans

Bu proje MIT Lisansı altında lisanslanmıştır.

## 📞 İletişim

- **GitHub**: [@begga1229](https://github.com/begga1229)
- **Email**: begga1229@icloud.com

## 🎯 Gelecek Özellikler

- [ ] Weather Dashboard entegrasyonu
- [ ] To-Do List modulü
- [ ] Advanced Analytics
- [ ] Budget Forecasting
- [ ] Mobile App iyileştirmeleri
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Offline support

---

**Made with ❤️ by [@begga1229](https://github.com/begga1229)**
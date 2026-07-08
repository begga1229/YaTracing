# 🚀 Deployment Guide

## Production Checklist

- [ ] Environment variables configured
- [ ] Database backed up
- [ ] SSL certificate installed
- [ ] CORS settings updated
- [ ] JWT secret changed
- [ ] Database credentials changed
- [ ] Error logging configured
- [ ] Monitoring enabled

## Deployment Platforms

### Heroku

```bash
heroku login
heroku create yatracing
git push heroku main
heroku config:set JWT_SECRET=your-secret
heroku pg:push yatracing DATABASE_URL
```

### AWS

```bash
# RDS Database
# EC2 Instance
# S3 for assets
# CloudFront for CDN
```

### Digital Ocean

```bash
doctl auth init
doctl apps create
# Configure app.yaml
doctl apps update <app-id> --spec app.yaml
```

### Docker Hub

```bash
docker build -t begga1229/yatracing-backend .
docker push begga1229/yatracing-backend
```

## Environment Setup

### Production Variables

```env
NODE_ENV=production
PORT=5000
DB_HOST=prod-db.example.com
DB_NAME=yatracing_prod
DB_USER=prod_user
DB_PASSWORD=secure_password
JWT_SECRET=very_secure_secret_key
CORS_ORIGIN=https://yatracing.com
REDIS_URL=redis://prod-redis:6379
```

## SSL/TLS Setup

```bash
# Let's Encrypt
sudo certbot certonly --standalone -d yatracing.com

# Nginx config
server {
    listen 443 ssl;
    server_name yatracing.com;
    
    ssl_certificate /etc/letsencrypt/live/yatracing.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yatracing.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:5000;
    }
}
```

## Database Migration

```bash
# Create backup
pg_dump yatracing > backup.sql

# Run migrations
npm run migrate

# Verify
psql yatracing -c "\dt"
```

## Monitoring

- **PM2**: Process management
- **New Relic**: Performance monitoring
- **Sentry**: Error tracking
- **DataDog**: Infrastructure monitoring

## Backup Strategy

- Daily database backups
- Weekly full backups
- Monthly archive backups
- Test restore procedures monthly
# 🚨 Troubleshooting

## Backend Issues

### Database Connection Failed

**Error**: `connect ECONNREFUSED 127.0.0.1:5432`

**Solution**:
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql

# Or with Homebrew (Mac)
brew services start postgresql
```

### Port 5000 Already in Use

**Error**: `EADDRINUSE :::5000`

**Solution**:
```bash
# Find and kill process
lsof -i :5000
kill -9 <PID>

# Or use different port
PORT=5001 npm run dev
```

### JWT Token Invalid

**Error**: `Invalid token`

**Solution**:
- Check JWT_SECRET matches
- Ensure token is in Authorization header
- Check token hasn't expired

## Frontend Issues

### React App Won't Start

**Error**: `Port 3000 is already in use`

**Solution**:
```bash
# Kill process on port 3000
lsof -i :3000
kill -9 <PID>

# Or use different port
PORT=3001 npm start
```

### API Calls Failing

**Error**: `CORS error` or `404 Not Found`

**Solution**:
- Check REACT_APP_API_URL is correct
- Ensure backend is running
- Check network tab in DevTools

### Redux State Not Updating

**Error**: Data not showing in component

**Solution**:
- Check Redux DevTools
- Verify reducer logic
- Check dispatch is called
- Clear browser cache

## Mobile App Issues

### Expo Won't Connect

**Error**: `Cannot find module`

**Solution**:
```bash
cd packages/mobile
rm -rf node_modules
npm install
npm start
```

### QR Code Scan Failed

**Error**: `Invalid URL`

**Solution**:
- Ensure iPad and computer on same network
- Check firewall settings
- Try manual URL entry
- Restart Expo

## Docker Issues

### Container Won't Start

**Error**: `docker-compose up failed`

**Solution**:
```bash
# Check logs
docker-compose logs

# Rebuild images
docker-compose build --no-cache

# Clean up
docker system prune -a
```

### Database Container Issues

**Error**: `PostgreSQL connection refused`

**Solution**:
```bash
# Restart database
docker-compose restart postgres

# Recreate volume
docker volume rm yatracing_db_data
docker-compose up -d
```

## Performance Issues

### Slow API Response

**Solution**:
- Check database indexes
- Enable caching (Redis)
- Add pagination to large queries
- Monitor with New Relic

### High Memory Usage

**Solution**:
- Check for memory leaks
- Profile with Chrome DevTools
- Use production builds
- Enable gzip compression

## General Tips

1. **Check Logs**: Always check console/terminal logs first
2. **Environment Variables**: Verify all .env files are correct
3. **Clear Cache**: Delete node_modules and reinstall if stuck
4. **Network**: Verify API endpoint and WiFi connection
5. **Browser Cache**: Clear browser cache in DevTools
6. **Restart Services**: Sometimes just restart everything

## Getting Help

- Check GitHub Issues
- Review Error Logs
- Check API Response in Network Tab
- Ask on Stack Overflow
- Open GitHub Issue with reproduction steps
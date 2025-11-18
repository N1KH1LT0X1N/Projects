# Deployment Guide

Complete guide for deploying the CS50 AI Portfolio web application to production.

## 🚀 Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend)

**Best for**: Quick deployment, automatic HTTPS, minimal configuration

#### Frontend (Vercel)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select the `web/frontend` directory as root
   - Configure build settings:
     - Build Command: `npm run build`
     - Output Directory: `.next`
     - Install Command: `npm install`

3. **Set Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
   ```

4. **Deploy**
   - Vercel automatically deploys on push to main branch

#### Backend (Railway)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)

2. **New Project from GitHub**
   - Select your repository
   - Railway detects Python and uses Dockerfile

3. **Configure**
   - Set root directory to `web/backend`
   - Add environment variables if needed

4. **Deploy**
   - Railway provides a URL like `https://your-app.railway.app`

### Option 2: Docker on VPS

**Best for**: Full control, cost optimization

#### Prerequisites
- Ubuntu 20.04+ server
- Docker and Docker Compose installed
- Domain name (optional)

#### Steps

1. **SSH into server**
   ```bash
   ssh user@your-server-ip
   ```

2. **Clone repository**
   ```bash
   git clone https://github.com/N1KH1LT0X1N/Projects.git
   cd Projects/web
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   nano .env  # Edit as needed
   ```

4. **Build and start**
   ```bash
   docker-compose up -d --build
   ```

5. **Set up Nginx reverse proxy**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }

       location /api {
           proxy_pass http://localhost:8000;
           proxy_http_version 1.1;
           proxy_set_header Host $host;
       }
   }
   ```

6. **Enable HTTPS with Certbot**
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

### Option 3: AWS (Comprehensive)

**Best for**: Scalability, enterprise needs

#### Architecture
- **Frontend**: AWS Amplify or S3 + CloudFront
- **Backend**: ECS Fargate or EC2
- **Database**: RDS PostgreSQL (if needed)
- **Storage**: S3 for models and static files

#### Deployment Steps

1. **Frontend to Amplify**
   ```bash
   npm install -g @aws-amplify/cli
   amplify init
   amplify add hosting
   amplify publish
   ```

2. **Backend to ECS**
   - Create ECR repository
   - Push Docker image
   - Create ECS task definition
   - Deploy to Fargate

3. **Configure CloudFront**
   - CDN for static assets
   - HTTPS certificate

## 🔧 Production Configuration

### Environment Variables

#### Backend (.env)
```bash
# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
WORKERS=4

# CORS
ALLOWED_ORIGINS=https://yourdomain.com

# Models
TRAFFIC_MODEL_PATH=/app/models/traffic_model.h5

# Optional: Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# Optional: Redis
REDIS_URL=redis://localhost:6379
```

#### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Performance Optimization

#### Backend
```python
# main.py
import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        workers=4,  # Multiple workers
        log_level="info"
    )
```

#### Frontend
```javascript
// next.config.js
module.exports = {
  reactStrictMode: true,
  swcMinify: true,  // Faster minification
  images: {
    domains: ['your-api-domain.com'],
  },
  compress: true,
}
```

### Monitoring & Logging

#### Backend (FastAPI)
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

#### Frontend (Vercel Analytics)
```bash
npm install @vercel/analytics
```

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

## 📊 Health Checks

### Backend Health Endpoint
Already included at `/health`:
```bash
curl https://api.yourdomain.com/health
# Response: {"status": "healthy"}
```

### Frontend Health
```tsx
// app/api/health/route.ts
export async function GET() {
  return Response.json({ status: 'healthy' })
}
```

## 🔐 Security

### Backend
- Enable CORS only for your frontend domain
- Use environment variables for secrets
- Rate limiting (optional):
  ```python
  from slowapi import Limiter
  limiter = Limiter(key_func=get_remote_address)
  ```

### Frontend
- Never expose API keys client-side
- Use HTTPS only in production
- Set secure headers in next.config.js

## 🔄 CI/CD

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        run: |
          # Railway CLI deployment
          railway up

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## 📈 Scaling

### Horizontal Scaling
- **Frontend**: Vercel auto-scales
- **Backend**: Add more workers or instances
  ```bash
  docker-compose up --scale backend=3
  ```

### Load Balancing
Use Nginx or cloud load balancers:
```nginx
upstream backend {
    server backend1:8000;
    server backend2:8000;
    server backend3:8000;
}
```

### Caching
- **Redis** for API responses
- **CDN** for static assets
- **Browser caching** for images

## 🐛 Troubleshooting

### Common Issues

1. **CORS errors**
   - Check `ALLOWED_ORIGINS` in backend
   - Verify frontend URL matches

2. **Import errors (backend)**
   - Ensure original projects are accessible
   - Check volume mounts in docker-compose.yml

3. **Build failures (frontend)**
   - Clear `.next` folder: `rm -rf .next`
   - Delete node_modules: `rm -rf node_modules && npm install`

4. **Slow API responses**
   - Check model loading (move to startup)
   - Add Redis caching
   - Optimize database queries

### Logs

```bash
# Docker logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Direct logs
# Backend
tail -f /var/log/uvicorn.log

# Frontend (Vercel)
vercel logs
```

## 📝 Checklist

- [ ] Environment variables configured
- [ ] Domain name set up (if applicable)
- [ ] HTTPS enabled
- [ ] CORS configured correctly
- [ ] Models uploaded/accessible
- [ ] Health checks working
- [ ] Monitoring enabled
- [ ] Backups configured
- [ ] Documentation updated

## 🎉 Post-Deployment

1. **Test all projects**
   - Visit each project page
   - Test core functionality
   - Check mobile responsiveness

2. **Monitor performance**
   - Use Vercel Analytics
   - Set up error tracking (Sentry)

3. **Share**
   - Add to portfolio
   - Share on LinkedIn/GitHub
   - Update README with live URL

---

**Congratulations on deploying your CS50 AI Portfolio! 🚀**

# 🚀 ChatBTC Deployment Guide

This guide covers deploying ChatBTC to various cloud platforms.

## 📋 Prerequisites

Before deploying, ensure you have:

- **OpenAI API Key** (required for AI chat functionality)
- **CoinGecko API Key** (optional, for enhanced price data)
- **CryptoPanic API Key** (optional, for enhanced news data)

## 🚂 Railway Deployment (Recommended)

Railway is ideal for multi-service Docker applications like ChatBTC.

### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with your GitHub account

### Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your `chatbtc` repository

### Step 3: Configure Services
Railway will automatically detect your services. Configure each:

#### PostgreSQL Database
- Railway will create a PostgreSQL database automatically
- Note the DATABASE_URL for other services

#### Qdrant Vector Database  
- Deploy the `qdrant` service
- Will be available internally at `qdrant:6333`

#### Backend API
- Service: `backend`
- Add environment variables:
  - `OPENAI_API_KEY`: Your OpenAI API key
  - `DATABASE_URL`: Use Railway's PostgreSQL URL
  - `QDRANT_URL`: `http://qdrant:6333`
  - `COINGECKO_API_KEY`: (optional)
  - `CRYPTOPANIC_API_KEY`: (optional)

#### Frontend
- Service: `frontend`
- Add environment variables:
  - `NEXT_PUBLIC_API_URL`: Your backend service URL
  - `NODE_ENV`: `production`

### Step 4: Deploy
1. Each service will build and deploy automatically
2. Railway provides public URLs for frontend and backend
3. Set the frontend's `NEXT_PUBLIC_API_URL` to the backend URL

## 🔧 Environment Variables

### Required
- `OPENAI_API_KEY`: OpenAI API key for chat functionality

### Optional
- `COINGECKO_API_KEY`: Enhanced Bitcoin price data
- `CRYPTOPANIC_API_KEY`: Enhanced news aggregation

### Auto-configured
- `DATABASE_URL`: PostgreSQL connection (Railway manages this)
- `QDRANT_URL`: Vector database URL (internal service communication)

## 🌐 Alternative Deployment Options

### Render
1. Connect GitHub repo to Render
2. Create services for each component
3. Configure environment variables
4. Deploy

### DigitalOcean App Platform
1. Create new App from GitHub
2. Configure multi-service deployment
3. Add managed PostgreSQL database
4. Set environment variables

### Self-hosted with Docker
1. Use `docker-compose.prod.yml`
2. Set environment variables in `.env`
3. Run: `docker-compose -f docker-compose.prod.yml up -d`

## 📊 Post-Deployment

After successful deployment:

1. **Test Chat**: Visit `/chat` and ask Bitcoin questions
2. **Check News**: Visit `/news` for latest Bitcoin news
3. **View Analytics**: Visit `/analytics` for price charts
4. **API Health**: Check `/api/health` endpoint

## 🔍 Monitoring

- Check service logs for any errors
- Monitor API key usage limits
- Verify database connections
- Test all features end-to-end

## 🛡️ Security Notes

- Never commit API keys to version control
- Use platform environment variables for secrets
- Enable HTTPS in production
- Regularly rotate API keys
- Monitor for suspicious usage

## 📈 Scaling

For high traffic:
- Enable auto-scaling on your platform
- Consider Redis for caching
- Add CDN for static assets
- Monitor database performance
- Set up alerts and monitoring

## 🆘 Troubleshooting

### Common Issues
- **Chat not working**: Check OpenAI API key and credits
- **No price data**: Verify CoinGecko API setup
- **Database errors**: Check DATABASE_URL configuration
- **Frontend/backend disconnect**: Verify NEXT_PUBLIC_API_URL

### Support
- Check service logs first
- Verify all environment variables
- Test local deployment with same config
- Check API key quotas and limits
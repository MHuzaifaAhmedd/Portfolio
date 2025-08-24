# ✅ Deployment Checklist

## 🗄️ MongoDB Atlas Setup
- [ ] Create MongoDB Atlas account
- [ ] Create new cluster (M0 free tier)
- [ ] Create database user with read/write permissions
- [ ] Get connection string
- [ ] Add IP to whitelist (0.0.0.0/0 for all IPs)

## ⚙️ Railway Backend Deployment
- [ ] Push code to GitHub
- [ ] Create Railway account
- [ ] Deploy from GitHub repo
- [ ] Set environment variables:
  - [ ] `MONGODB_URI`
  - [ ] `JWT_SECRET`
  - [ ] `JWT_EXPIRES_IN`
  - [ ] `NODE_ENV=production`
  - [ ] `FRONTEND_URL` (will update after Vercel deployment)
  - [ ] `EMAIL_USER`
  - [ ] `EMAIL_PASS`
  - [ ] `EMAIL_FROM`
- [ ] Copy Railway URL

## 🌐 Vercel Frontend Deployment
- [ ] Create Vercel account
- [ ] Import GitHub repo
- [ ] Set environment variables:
  - [ ] `NEXT_PUBLIC_API_URL` (Railway URL)
  - [ ] `NEXT_PUBLIC_APP_NAME`
  - [ ] `NEXT_PUBLIC_APP_URL`
- [ ] Deploy
- [ ] Copy Vercel URL

## 🔄 Final Configuration
- [ ] Update Railway `FRONTEND_URL` with actual Vercel URL
- [ ] Test backend health endpoint
- [ ] Test frontend loading
- [ ] Test contact form
- [ ] Test admin login
- [ ] Test project management

## 🧪 Testing
- [ ] Frontend loads correctly
- [ ] Navigation works
- [ ] Contact form submits
- [ ] Admin login works
- [ ] Projects display correctly
- [ ] Image uploads work (if configured)

## 📊 Post-Deployment
- [ ] Monitor Railway logs
- [ ] Monitor Vercel analytics
- [ ] Check MongoDB Atlas status
- [ ] Set up monitoring alerts (optional)
- [ ] Consider custom domain
- [ ] Set up backups

---

**Status**: 🚧 In Progress  
**Last Updated**: [Date]  
**Next Action**: [Action Item]

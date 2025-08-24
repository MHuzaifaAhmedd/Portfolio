# 🚀 Deployment Guide: Vercel + Railway

This guide will walk you through deploying your Huzaifa Portfolio app using Vercel (frontend) and Railway (backend).

## 📋 Prerequisites

- [GitHub](https://github.com) account
- [Vercel](https://vercel.com) account (free)
- [Railway](https://railway.app) account (free)
- [MongoDB Atlas](https://mongodb.com/atlas) account (free)

## 🗄️ Step 1: Set Up MongoDB Atlas

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://mongodb.com/atlas)
   - Sign up for free account
   - Create a new cluster (free tier: M0)

2. **Configure Database**
   - Create a database user with read/write permissions
   - Get your connection string
   - Add your IP address to whitelist (or use 0.0.0.0/0 for all IPs)

3. **Connection String Format**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/huzaifa-portfolio?retryWrites=true&w=majority
   ```

## ⚙️ Step 2: Deploy Backend to Railway

1. **Push Code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Deploy to Railway**
   - Go to [Railway](https://railway.app)
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select your repository
   - Railway will automatically detect it's a Node.js app

3. **Configure Environment Variables**
   In Railway dashboard, add these variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=your-email@gmail.com
   MAX_FILE_SIZE=10485760
   UPLOAD_PATH=./uploads/projects
   ```

4. **Get Your Backend URL**
   - Railway will provide a URL like: `https://your-app-name.railway.app`
   - Copy this URL for the next step

## 🌐 Step 3: Deploy Frontend to Vercel

1. **Deploy to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

2. **Configure Environment Variables**
   In Vercel dashboard, add:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-domain.railway.app
   NEXT_PUBLIC_APP_NAME=Huzaifa Portfolio
   NEXT_PUBLIC_APP_URL=https://your-frontend-domain.vercel.app
   ```

3. **Deploy Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Get Your Frontend URL**
   - Vercel will provide a URL like: `https://your-app-name.vercel.app`

## 🔄 Step 4: Update Backend CORS

1. **Update Railway Environment**
   - Go back to Railway dashboard
   - Update `FRONTEND_URL` with your actual Vercel URL
   - Redeploy if necessary

## 📁 Step 5: File Uploads Configuration

**Important**: Railway's free tier has limitations for file uploads. Consider:

1. **Option A: Use Cloudinary (Recommended)**
   - Sign up at [Cloudinary](https://cloudinary.com)
   - Update backend to use Cloudinary instead of local storage
   - More reliable for production

2. **Option B: Use Railway's Persistent Storage**
   - Railway provides persistent storage
   - Configure in Railway dashboard
   - Update upload path in environment variables

## 🧪 Step 6: Test Your Deployment

1. **Test Frontend**
   - Visit your Vercel URL
   - Check if it loads correctly
   - Test navigation between pages

2. **Test Backend**
   - Visit: `https://your-backend.railway.app/api/health`
   - Should return: `{"status":"OK","message":"Huzaifa Portfolio Backend is running!"}`

3. **Test API Endpoints**
   - Test contact form submission
   - Test admin login
   - Test project creation/editing

## 🔧 Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Ensure `FRONTEND_URL` in Railway matches your Vercel URL exactly
   - Check for trailing slashes

2. **MongoDB Connection Issues**
   - Verify connection string format
   - Check IP whitelist in MongoDB Atlas
   - Ensure database user has correct permissions

3. **Build Errors**
   - Check Vercel build logs
   - Ensure all dependencies are in `package.json`
   - Verify TypeScript configuration

4. **Environment Variables**
   - Double-check all variables are set correctly
   - Ensure no extra spaces or quotes
   - Redeploy after changing variables

## 📊 Monitoring & Maintenance

1. **Railway Dashboard**
   - Monitor backend performance
   - Check logs for errors
   - Monitor resource usage

2. **Vercel Dashboard**
   - Monitor frontend performance
   - Check analytics
   - Monitor build status

3. **MongoDB Atlas**
   - Monitor database performance
   - Check connection status
   - Monitor storage usage

## 🚀 Next Steps

1. **Custom Domain**
   - Add custom domain in Vercel
   - Update CORS settings accordingly

2. **SSL/HTTPS**
   - Both platforms provide SSL automatically
   - Ensure all URLs use HTTPS

3. **Backup Strategy**
   - Set up MongoDB Atlas backups
   - Consider database migration scripts

4. **Performance Optimization**
   - Enable Vercel analytics
   - Monitor and optimize database queries
   - Implement caching strategies

## 📞 Support

- **Vercel**: [vercel.com/support](https://vercel.com/support)
- **Railway**: [railway.app/support](https://railway.app/support)
- **MongoDB Atlas**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)

---

**Happy Deploying! 🎉**

Your portfolio will be live and accessible to the world!

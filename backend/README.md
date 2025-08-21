# 🚀 Huzaifa Portfolio Backend API

A robust, production-ready backend API for Huzaifa's portfolio website built with Express.js, MongoDB, and JWT authentication.

## ✨ Features

- **Contact Form API** - Handle portfolio contact submissions
- **Admin Dashboard** - Manage contacts and view analytics
- **JWT Authentication** - Secure admin access
- **Email Notifications** - Automatic email alerts for new contacts
- **Spam Protection** - Basic spam detection and rate limiting
- **MongoDB Integration** - Scalable database with proper indexing
- **Input Validation** - Comprehensive data validation and sanitization
- **Error Handling** - Professional error responses and logging

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Email**: Nodemailer with Gmail SMTP
- **Validation**: Custom middleware with spam detection
- **Security**: bcryptjs for password hashing, CORS protection

## 📁 Project Structure

```
backend/
├── models/           # Database models
│   ├── Contact.js   # Contact form submissions
│   └── User.js      # Admin user management
├── routes/           # API route handlers
│   ├── contact.js   # Contact form endpoints
│   ├── admin.js     # Admin dashboard endpoints
│   └── auth.js      # Authentication endpoints
├── middleware/       # Custom middleware
│   ├── auth.js      # JWT authentication
│   └── validation.js # Input validation
├── utils/            # Utility functions
│   └── email.js     # Email functionality
├── server.js         # Main server file
├── setup.js          # Database setup script
├── package.json      # Dependencies and scripts
└── README.md         # This file
```

## 🚀 Quick Start

### 1. Prerequisites

- Node.js (v14 or higher)
- MongoDB database (local or Atlas)
- Gmail account for email notifications

### 2. Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd backend

# Install dependencies
npm install

# Create environment file
cp env.example .env
```

### 3. Environment Configuration

Create a `.env` file with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/huzaifa_portfolio

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Admin Credentials
ADMIN_EMAIL=admin@huzaifa.dev
ADMIN_PASSWORD=your_secure_password_here
```

### 4. Database Setup

```bash
# Run the setup script
npm run setup
```

This will:
- Create database indexes
- Set up the admin user
- Verify database connection

### 5. Start Development Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## 📡 API Endpoints

### Contact Form
- `POST /api/contact` - Submit contact form
- `GET /api/contact/stats` - Get contact statistics
- `GET /api/contact/recent` - Get recent contacts

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/me` - Get current user info

### Admin Dashboard
- `GET /api/admin/dashboard` - Get dashboard data
- `GET /api/admin/contacts` - Get all contacts (paginated)
- `PATCH /api/admin/contacts/:id/status` - Update contact status
- `POST /api/admin/contacts/:id/reply` - Send reply to contact

## 🔐 Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📧 Email Configuration

### Gmail Setup

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the generated password in your `.env` file

### Email Templates

The system includes three email templates:
- **Contact Notification** - Sent to admin when form is submitted
- **Welcome Email** - Sent to contact form submitter
- **Reply Email** - Sent when admin replies to a contact

## 🛡️ Security Features

- **Rate Limiting** - Prevents spam submissions
- **Input Validation** - Comprehensive data sanitization
- **Spam Detection** - Basic keyword-based spam filtering
- **CORS Protection** - Configurable cross-origin requests
- **JWT Security** - Secure token-based authentication
- **Password Hashing** - bcryptjs with salt rounds

## 📊 Database Models

### Contact Model
- Name, email, project type, message
- Status tracking (new, read, replied, archived)
- Timestamps and metadata
- Spam detection flags

### User Model
- Admin authentication
- Role-based access control
- Account security features
- Login attempt tracking

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify Functions
```bash
# Build and deploy
npm run build
netlify deploy
```

### Traditional Hosting
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🧪 Testing

```bash
# Test the API endpoints
curl http://localhost:5000/api/health

# Test contact form
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "projectType": "web-development",
    "message": "Hello, I have a project idea!"
  }'
```

## 🔧 Development

### Available Scripts

```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm run setup    # Run database setup script
```

### Code Style

- Use ES6+ features
- Follow Express.js best practices
- Implement proper error handling
- Use async/await for database operations
- Include comprehensive logging

## 📝 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 5000 |
| `NODE_ENV` | Environment mode | No | development |
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | JWT signing secret | Yes | - |
| `EMAIL_USER` | Gmail username | Yes | - |
| `EMAIL_PASS` | Gmail app password | Yes | - |
| `FRONTEND_URL` | Frontend URL for CORS | No | http://localhost:3000 |
| `ADMIN_EMAIL` | Admin user email | No | admin@huzaifa.dev |
| `ADMIN_PASSWORD` | Admin user password | No | admin123456 |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Email: Ahmedhuzaifa451@gmail.com
- LinkedIn: [Huzaifa Ahmed](https://www.linkedin.com/in/huzaifa-ahmed-38755b1b7)

## 🎯 Roadmap

- [ ] Email reply functionality
- [ ] File upload support
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] Advanced spam filtering
- [ ] Rate limiting middleware
- [ ] API documentation with Swagger
- [ ] Unit and integration tests

---

**Built with ❤️ by Huzaifa Ahmed**


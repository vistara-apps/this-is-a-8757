# Ad Remix 🎨

**Spin up viral ad variations and auto-post them to your test socials.**

Ad Remix is a mini-app that takes a product image, generates multiple AI-powered ad creative variations, and automatically posts them to test social media accounts for growth hacking and A/B testing.

## 🚀 Features

### Core Features
- **AI-Powered Ad Variation Generation**: Upload a product image and get 3-5 distinct ad creative variations optimized for social media
- **Platform-Specific Optimization**: Generated ads are tailored for TikTok and Instagram with platform-specific formats and best practices
- **Automated Social Posting**: Directly publish generated ad variations to pre-configured test social media accounts
- **Basic Performance Insights**: Track engagement metrics to identify top-performing ad variations

### Technical Features
- **Secure Authentication**: JWT-based authentication with Supabase Auth
- **File Upload & Processing**: Image optimization with multiple size variants
- **Payment Processing**: Stripe integration for $0.50 per batch pricing
- **Real-time Analytics**: Performance tracking and insights
- **Responsive Design**: Mobile-first UI with Tailwind CSS

## 🛠 Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **Axios** for API communication
- **React Router** for navigation

### Backend
- **Node.js** with Express.js
- **Supabase** for database and authentication
- **OpenAI API** for AI-powered ad generation
- **Stripe** for payment processing
- **Sharp** for image processing
- **Multer** for file uploads

### Infrastructure
- **Docker** for containerization
- **Supabase Storage** for file storage
- **PostgreSQL** database with Row Level Security

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Docker (optional)
- Supabase account
- OpenAI API key
- Stripe account

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ad-remix
```

### 2. Install Dependencies
```bash
# Install all dependencies (frontend + backend)
npm run install:all
```

### 3. Environment Setup

#### Frontend (.env)
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:3001/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

#### Backend (server/.env)
```bash
cp server/.env.example server/.env
```

Edit `server/.env`:
```env
# Database
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AI
OPENAI_API_KEY=your_openai_api_key

# Payments
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Security
JWT_SECRET=your_jwt_secret_key

# App
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### 4. Database Setup

Run the database migration:
```bash
# Connect to your Supabase project and run:
# server/migrations/001_initial_schema.sql
```

### 5. Start Development Servers

#### Option 1: Run Both Servers
```bash
npm run dev:full
```

#### Option 2: Run Separately
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run dev:backend
```

#### Option 3: Docker
```bash
npm run docker:up
```

### 6. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api

## 📁 Project Structure

```
ad-remix/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   ├── utils/             # Utility functions
│   └── styles/            # CSS files
├── server/                # Backend source code
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Express middleware
│   │   ├── models/        # Data models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── utils/         # Utility functions
│   ├── migrations/        # Database migrations
│   └── package.json       # Backend dependencies
├── public/                # Static assets
├── docker-compose.yml     # Docker configuration
└── package.json          # Frontend dependencies
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/refresh-token` - Refresh access token

### File Upload
- `POST /api/upload` - Upload product image
- `GET /api/upload` - Get user's uploaded images
- `DELETE /api/upload/:filename` - Delete image

### Payments
- `POST /api/payments/create-payment-intent` - Create payment intent
- `POST /api/payments/webhook` - Stripe webhook handler

### Ad Generation
- `POST /api/ads/generate` - Generate ad variations
- `GET /api/ads/campaigns` - Get user campaigns

## 💰 Pricing Model

**Pay-per-remix**: $0.50 per batch of 5 ad variations

This micro-transaction model aligns with the 'build fast, test cheap' ethos, allowing users to pay only for value delivered without recurring commitments.

## 🔒 Security Features

- JWT-based authentication
- Row Level Security (RLS) in database
- File upload validation and processing
- Stripe webhook signature verification
- Environment variable protection
- CORS configuration

## 🚀 Deployment

### Docker Deployment
```bash
# Build and start containers
npm run docker:build
npm run docker:up
```

### Manual Deployment
```bash
# Build both frontend and backend
npm run build:all

# Start production server
npm run start:backend
```

## 🧪 Testing

### Run Tests
```bash
# Frontend tests
npm test

# Backend tests
cd server && npm test
```

## 📊 Monitoring & Analytics

The application includes built-in analytics for:
- Ad variation performance
- User engagement metrics
- Payment analytics
- Storage usage tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@adremix.com or join our Discord community.

## 🗺 Roadmap

- [ ] Social media API integrations (TikTok, Instagram)
- [ ] Advanced analytics dashboard
- [ ] Subscription pricing model
- [ ] Multi-language support
- [ ] Video ad generation
- [ ] Automated A/B testing
- [ ] Performance optimization recommendations

---

**Built with ❤️ for growth hackers and marketers**

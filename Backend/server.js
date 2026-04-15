import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import seedAdmin from './seedAdmin.js';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

dotenv.config({ path: './.env' });

// Validate required environment variables
const validateEnvironment = () => {
  const required = ['JWT_SECRET', 'MONGODB_URL'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  console.log('✅ All required environment variables are set');
};

const startServer = async () => {
  validateEnvironment();

  const { default: connectDB } = await import('./config/DB.js');
  const { default: AdminRoutes } = await import('./routes/AdminRoutes.js');
  const { getAllMusicNotes } = await import('./controllers/AdminController.js');
  const { globalErrorHandler, notFoundHandler } = await import('./middlewares/errorHandler.js');
  const musicRoutes = (await import('./routes/MusicRoute.js')).default;
  const courseRoutes = (await import('./routes/CourseRoutes.js')).default;
  const userRoutes = (await import('./routes/UserRoutes.js')).default;
  const userDashboardRoutes = (await import('./routes/UserDashboardRoutes.js')).default;
  const uploadRoutes = (await import('./routes/UploadRoutes.js')).default;
  const mediaRoutes = (await import('./routes/MediaRoutes.js')).default;

  let passport = null;
  try {
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_CALLBACK_URL) {
      console.log('✅ Google OAuth credentials found - loading passport...');
      const passportModule = await import('passport');
      passport = passportModule.default;
      await import('./config/passport.js');
      console.log('✅ Passport with Google OAuth loaded successfully');
    } else {
      console.log('⚠️  Google OAuth not fully configured - skipping passport initialization');
    }
  } catch (err) {
    console.warn('⚠️  Passport initialization skipped or failed:', err.message);
  }

  const authRoutes = (await import('./routes/AuthRouters.js')).default;

  const session = (await import('express-session')).default;
  const cookieParser = (await import('cookie-parser')).default;

  const app = express();
  const PORT = process.env.PORT || 5000;
  const NODE_ENV = process.env.NODE_ENV || 'development';

  console.log(`🚀 Starting Raadhyam Backend in ${NODE_ENV} mode...`);

  // ============ Security Middleware ============

  // Helmet for security headers
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }));

  // CORS Configuration
  const corsOptions = {
    origin: (process.env.CLIENT_URL || 'http://localhost:5173'),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400
  };
  app.use(cors(corsOptions));

  // Compression
  app.use(compression());

  // Request logging
  if (NODE_ENV === 'production') {
    app.use(morgan('combined'));
  } else {
    app.use(morgan('dev'));
  }

  // Parsing middleware
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({
    extended: true,
    limit: '50mb'
  }));
  app.use(cookieParser());

  // Rate limiting
  const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || 900000), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || 100), // requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => NODE_ENV !== 'production'
  });

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs for auth endpoints
    message: 'Too many authentication attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true
  });

  app.use('/api/', limiter);
  app.use('/api/auth/login', authLimiter);
  app.use('/api/auth/register', authLimiter);

  // Session configuration
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'default-secret-change-in-production',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      }
    })
  );

  // Conditionally use passport if available
  if (passport) {
    app.use(passport.initialize());
    app.use(passport.session());
  }

  // ============ Health Check & Routes ============

  app.get('/api/health', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Server is healthy',
      timestamp: new Date().toISOString(),
      environment: NODE_ENV,
      uptime: process.uptime()
    });
  });

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/courses', courseRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/music', musicRoutes);
  app.use('/api/user', userDashboardRoutes);
  app.use('/api/upload', uploadRoutes);
  app.use('/api/admin', AdminRoutes);
  app.use('/api/media', mediaRoutes);

  app.get('/api/music-notes', getAllMusicNotes);

  // ============ Error Handling ============

  app.use(notFoundHandler);
  app.use(globalErrorHandler);

  // ============ Database & Server Startup ============

  await connectDB();

  // Seed admin user if not exists
  await seedAdmin();

  const server = app.listen(PORT, () => {
    console.log(`\n✅ Server is running on http://localhost:${PORT}`);
    console.log(`📝 Environment: ${NODE_ENV}`);
    console.log(`🔒 CORS Origin: ${process.env.CLIENT_URL || 'http://localhost:5173'}\n`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  });

  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
  });
};

startServer().catch(err => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});

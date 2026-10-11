const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const userRoutes = require('./routes/user.routes');
const transactionRoutes = require('./routes/transaction.routes');
const { notFound, errorHandler } = require('./middleware/error.middleware');

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    const configured = (process.env.CORS_ORIGINS || 'http://localhost:3000')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);

    // Requests without an Origin header include Postman and server-to-server calls.
    if (!origin || configured.includes('*') || configured.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origin is not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id'],
  credentials: false
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000;
const max = Number(process.env.RATE_LIMIT_MAX) || 200;
app.use(rateLimit({
  windowMs,
  limit: max,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
    errors: []
  }
}));

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Expense Tracker API is healthy',
    data: { status: 'ok', uptimeSeconds: Math.floor(process.uptime()) }
  });
});

app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;

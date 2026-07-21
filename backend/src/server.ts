import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import { config } from './config';
import apiRoutes from './routes';

const app = express();

// Trust proxy for Render / Cloud reverse proxies (Express Rate Limit compatibility)
app.set('trust proxy', 1);

// 1. Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://arions-web.vercel.app',
  process.env.FRONTEND_URL,
  process.env.CORS_ORIGIN,
  config.FRONTEND_URL,
  config.CORS_ORIGIN
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes('*') ||
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app')
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.options('*', cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per windowMs
  message: { success: false, message: 'Demasiadas peticiones desde esta IP. Intenta de nuevo más tarde.' }
});

app.use('/api', limiter);

// 2. Body Parsers & Static Files
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

const uploadsPath = path.resolve(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// 3. Swagger OpenAPI Docs Configuration
const swaggerOptions: swaggerJsDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ARIONS REST API',
      version: '1.0.0',
      description: 'API RESTful para la plataforma enterprise de Innovación Tecnológica y Obras de Construcción ARIONS'
    },
    servers: [
      {
        url: `http://localhost:${config.PORT}/api/v1`,
        description: 'Servidor Local de Desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.ts']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 4. API Routes
app.use('/api/v1', apiRoutes);

// Root endpoint status check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API de ARIONS en línea y operativa 🚀',
    version: '1.0.0'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'ARIONS Enterprise API'
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

// 5. Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno en el servidor.'
  });
});

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(config.PORT, () => {
    console.log(`🚀 Servidor ARIONS escuchando en http://localhost:${config.PORT}`);
    console.log(`📚 Documentación Swagger disponible en http://localhost:${config.PORT}/api/v1/docs`);
  });
}

export default app;

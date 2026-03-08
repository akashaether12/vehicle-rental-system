const dotenv = require("dotenv");

dotenv.config();

const requiredEnvVars = ["MONGO_URI", "JWT_SECRET"];

for (const variable of requiredEnvVars) {
  if (!process.env[variable]) {
    throw new Error(`Missing required environment variable: ${variable}`);
  }
}

const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  appName: process.env.APP_NAME || "Velocity Rentals",
  paymentHoldMinutes: Number(process.env.PAYMENT_HOLD_MINUTES) || 15,
  smtpHost: process.env.SMTP_HOST || "",
  smtpPort: Number(process.env.SMTP_PORT) || 587,
  smtpUser: process.env.SMTP_USER || "",
  smtpPass: process.env.SMTP_PASS || "",
  smtpFrom: process.env.SMTP_FROM || "noreply@velocityrentals.local",
  adminEmail: process.env.ADMIN_EMAIL || "admin@velocityrentals.com",
  adminPassword: process.env.ADMIN_PASSWORD || "Admin@123",
};

module.exports = config;

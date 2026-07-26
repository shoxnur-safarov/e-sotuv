import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 daqiqa
  max: 5, // shu vaqt oralig'ida maksimal 5 ta urinish
  message: { message: "Juda ko'p urinish qildingiz. 15 daqiqadan keyin qayta urinib ko'ring." },
  standardHeaders: true,
  legacyHeaders: false,
});
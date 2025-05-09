import rateLimit from 'express-rate-limit';

export const rateLimiter = (sec, max) => {
  return rateLimit({
    windowMs: 1000 * sec,
    max: max,
    message: {
      status: 429,
      success: false,
      error: "Too Many Requests",
      message:"You have exceeded the request limit. Try again later.",
    },
    headers: true,
    handler:(_req, res) => {
      res.status(429).json({
        status: 429,
        success: false,
        error: "Too Many Request",
        message: "Slow down! You have exceeded the rate limit. please try again later",
      })
    }
  })
}
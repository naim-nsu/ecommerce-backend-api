import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 1 minutes
  limit: 100, // Limit each IP to 50 requests per `window`
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  message: {
    error: {
      message: "You have sent too many requests. Please try again later.",
    },
  },
});

export default limiter;

const { z } = require('zod');

// GET /paginated?page=0&limit=20
// Note: validate middleware checks req.body by default.
// For query params, parse them here as strings then coerce.
const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 0))
    .refine((val) => val >= 0, { message: 'page must be 0 or greater' }),

  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 20))
    .refine((val) => val >= 1 && val <= 100, { message: 'limit must be between 1 and 100' }),
});

module.exports = { paginationSchema };
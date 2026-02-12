import { z } from 'zod';
import { insertBikeSchema, bikes } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  bikes: {
    list: {
      method: 'GET' as const,
      path: '/api/bikes' as const,
      input: z.object({
        brand: z.string().optional(),
        minPrice: z.coerce.number().optional(),
        maxPrice: z.coerce.number().optional(),
        minCC: z.coerce.number().optional(),
        maxCC: z.coerce.number().optional(),
        category: z.string().optional(),
        search: z.string().optional(),
        sort: z.enum(['price_asc', 'price_desc', 'latest']).optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof bikes.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/bikes/:id' as const,
      responses: {
        200: z.custom<typeof bikes.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/bikes' as const,
      input: insertBikeSchema,
      responses: {
        201: z.custom<typeof bikes.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    // We can add update/delete if admin features are needed later
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

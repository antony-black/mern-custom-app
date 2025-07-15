import { Document, Types } from 'mongoose';
import { z } from 'zod';

export const zProductBaseSchema = z.object({
  name: z.string().min(3, 'Please, let it be at least 3 characters.'),
  price: z.number().positive('Should be a positive number.'),
  image: z
    .url({ message: 'Image must be a valid URL.' })
    .refine((url) => /\.(jpeg|jpg|png|webp|svg)$/i.test(url), {
      message: 'Image URL must end with .jpg, .png,, .webp, or .svg',
    }),
  publicId: z.string().optional(),
});

export type TProductBase = z.infer<typeof zProductBaseSchema>;
// =====================================
export const zProductSchemaWithMeta = zProductBaseSchema.extend({
  _id: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type TProduct = z.infer<typeof zProductSchemaWithMeta>; // Actual product
// ====================================
export const zApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    data: dataSchema.optional(),
  });

// Create a schema for API response with TProduct[] as data
export const zProductListResponseSchema = zApiResponseSchema(z.array(zProductSchemaWithMeta));
// Similarly for a single product
export const zProductResponseSchema = zApiResponseSchema(zProductSchemaWithMeta);
export const zCloudinaryResponseSchema = zApiResponseSchema(zProductSchemaWithMeta);
export type TProductListApiResponse = z.infer<typeof zProductListResponseSchema>;
export type TProductApiResponse = z.infer<typeof zProductResponseSchema>;

export type TApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};
// ==================================
const zObjectId = z
  .instanceof(Types.ObjectId)
  .or(z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid ObjectId format' }));

export const zDbDocSchema = zProductBaseSchema.extend({
  _id: zObjectId,
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

type TDbDocSchema = z.infer<typeof zDbDocSchema>;

export type TDbDoc = Document & TProductBase & TDbDocSchema;

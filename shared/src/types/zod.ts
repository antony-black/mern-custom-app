import { Types } from 'mongoose';
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

export const zProductSchemaWithMeta = zProductBaseSchema.extend({
  _id: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const zApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    data: dataSchema.optional(),
  });

export const zProductListResponseSchema = zApiResponseSchema(z.array(zProductSchemaWithMeta));
export const zProductResponseSchema = zApiResponseSchema(zProductSchemaWithMeta);
export const zCloudinaryResponseSchema = zApiResponseSchema(zProductSchemaWithMeta);

const zObjectId = z
  .instanceof(Types.ObjectId)
  .or(z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid ObjectId format' }));

export const zDbDocSchema = zProductBaseSchema.extend({
  _id: zObjectId,
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

import { Document } from 'mongoose';
import { z } from 'zod';
import {
  zProductBaseSchema,
  zProductSchemaWithMeta,
  zProductListResponseSchema,
  zProductResponseSchema,
  zDbDocSchema,
} from './zod';

export type TProductBase = z.infer<typeof zProductBaseSchema>;

export type TProduct = z.infer<typeof zProductSchemaWithMeta>;
export type TProductListApiResponse = z.infer<typeof zProductListResponseSchema>;
export type TProductApiResponse = z.infer<typeof zProductResponseSchema>;

export type TApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};

export type TValidator<T> = (data: T) => { success: boolean; message?: string };

type TDbDocSchema = z.infer<typeof zDbDocSchema>;

export type TDbDoc = Document & TProductBase & TDbDocSchema;

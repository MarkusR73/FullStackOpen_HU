import { Gender } from './types';
import { z } from 'zod';

export const NewPatientSchema = z.object ({
    name: z.string(),
    ssn: z.string().regex(/^\d{6}-(\d{4}|\d{3}[A-Z])$/, 'Invalid SSN format'),
    occupation: z.string(),
    dateOfBirth: z.string().date(),
    gender: z.nativeEnum(Gender),
});

export const RawPatientSchema = NewPatientSchema.extend({
  gender: z.nativeEnum(Gender),
  entries: z.array(z.unknown()).optional(),
  id: z.string()
});
import { Gender } from './types';
import { z } from 'zod';

export const NewPatientSchema = z.object ({
    name: z.string(),
    dateOfBirth: z.string().date(),
    ssn: z.string().regex(/^\d{6}-\d{3}[A-Z]$/, 'Invalid SSN format'),
    gender: z.nativeEnum(Gender),
    occupation: z.string(),
});
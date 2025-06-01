import express from 'express';
import patientService from '../services/patientService';
import { NewPatientSchema } from '../utils';
import { NewPatient, Patient } from '../types';
import { z } from 'zod';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientService.getNonSensitiveEntries());
});

router.get('/:id', (req: express.Request, res: express.Response<Patient>, next: express.NextFunction) => {
  try {
    const patient = patientService.getPatient(req.params.id);
    if (patient) {
      res.json(patient);
    } else {
      next(new Error('Patient not found'));
    }
  } catch (error) {
    next(error);
  }
});

const newPatientParser = (req: express.Request, _res: express.Response, next: express.NextFunction) => {
  try {
    NewPatientSchema.parse(req.body);
    //console.log(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

router.post('/', newPatientParser, (req: express.Request<unknown, unknown, NewPatient>, res: express.Response<Patient>) => {
  const adddedPatientEntry = patientService.addPatient(req.body);
  res.json(adddedPatientEntry);
});

const errorMiddleware = (error: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (error instanceof z.ZodError) {
    res.status(400).json({ error: error.issues });
  } else if (error instanceof Error) {
    res.status(400).json({ error: error.message });
  } else {
    next(error);
  }
};

router.use(errorMiddleware);

export default router;
import patientEntries from '../../../data/patientEntries';
import { Patient, NewPatient, NonSensitivePatient } from '../types';
import { v4 as uuid } from 'uuid';
import { RawPatientSchema } from '../utils';

const patients: Patient[] = (patientEntries as unknown[]).map(obj => {
  const parsed = RawPatientSchema.parse(obj);
  // Ensure 'entries' is always an array of type Entry[]
  return {
    ...parsed,
    entries: (parsed.entries ?? []) as import('../types').Entry[]
  };
});

// Define a schema for non-sensitive patient data
const NonSensitivePatientSchema = RawPatientSchema.pick({
  id: true,
  name: true,
  dateOfBirth: true,
  gender: true,
  occupation: true,
});

const getPatient = (id: string): Patient | undefined => {
  return patients.find(patient => patient.id === id);
};

const getNonSensitiveEntries = (): NonSensitivePatient[] => {
  return patients.map((patient) =>
    NonSensitivePatientSchema.parse(patient)
  );
};

const addPatient = ( entry: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    ...entry
  };

  patients.push(newPatient);
  return newPatient;
};

export default {
  getPatient,
  getNonSensitiveEntries,
  addPatient
};
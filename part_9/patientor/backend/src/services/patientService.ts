import patientEntries from '../../../data/patientEntries';
import { Patient, NonSensitivePatient } from '../types';

const patients: Patient[] = patientEntries;

const getNonSensitiveEntries = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

export default {
  getNonSensitiveEntries,
};
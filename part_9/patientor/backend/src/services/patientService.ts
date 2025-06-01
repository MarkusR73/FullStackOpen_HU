import patientEntries from '../../../data/patientEntries';
import { Patient, NewPatient, NonSensitivePatient } from '../types';
import { v4 as uuid } from 'uuid';

const patients: Patient[] = patientEntries;

const getPatient = (id: string): Patient | undefined => {
  return patients.find(patient => patient.id === id);
};

const getNonSensitiveEntries = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
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
export interface Diagnosis {
  code: string;
  name: string;
  latin?: string; // Optional field
}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: string;
  occupation: string;
}

export enum Gender {
  Female = 'female',
  Male = 'male',
  Other = 'other',
}

export type NonSensitivePatient = Omit<Patient, 'ssn'>;

export type NewPatient = Omit<Patient, 'id'>;
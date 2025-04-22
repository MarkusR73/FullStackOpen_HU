import diagnosesEntries from '../../../data/diagnosesEntries';
import { Diagnosis } from '../types';

const diagnosis: Diagnosis[] = diagnosesEntries;

const getEntries = (): Diagnosis[] => {
  return diagnosis;
};

export default {
  getEntries,
};
import express from 'express';
import cors from 'cors';
import diagnosesRouter from './routes/diagnoseRouter';
import patientRouter from './routes/patientRouter';

const app = express();

// Use cors middleware directly
app.use(cors());
app.use(express.json());

const PORT = 3001;

app.get('/api/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.use('/api/diagnoses', diagnosesRouter);
app.use('/api/patients', patientRouter);
app.use('api/patient/:id', patientRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
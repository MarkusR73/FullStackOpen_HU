import express from 'express';
import { calculateBmi } from './bmiCalculator';

const app = express();

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const height = Number(req.query.height as string);
  const weight = Number(req.query.weight as string);
  if (isNaN(height) || isNaN(weight)) {
    res.status(400).send({ error: 'malformatted parameters' });
  }
  try {
    const result = calculateBmi(height, weight);
    res.json(result);
  } catch (error: unknown) {
    res.status(400).json({ error: (error as Error).message });
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
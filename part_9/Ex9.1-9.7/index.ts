import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();

// Add this middleware to parse JSON request bodies
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const height = Number(req.query.height as string);
  const weight = Number(req.query.weight as string);
  if (isNaN(height) || isNaN(weight)) {
    res.status(400).send({ error: 'malformatted parameters' });
  }
  else {
    try {
      const result = calculateBmi(height, weight);
      res.json(result);
    } catch (error: unknown) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { daily_exercises, target }: any = req.body;

  if (!daily_exercises || target === undefined) {
    res.status(400).json({ error: 'parameters missing' });
  }
  else if (
    !Array.isArray(daily_exercises) ||
    daily_exercises.some((hours) => isNaN(Number(hours))) ||
    isNaN(Number(target))
  ) {
    res.status(400).json({ error: 'malformatted parameters' });
  }
  else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    try {
      const result = calculateExercises(
        daily_exercises.map((hours: any) => Number(hours)),
        Number(target)
      );
      res.json(result);
    } catch (error: unknown) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
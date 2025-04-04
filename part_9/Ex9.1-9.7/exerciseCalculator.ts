interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const parseExerciseArguments = (args: string[]): { target: number; dailyHours: number[] } => {
  if (args.length < 4) {
    throw new Error("Usage: npm run calculateExercises <target> <day1> <day2> ... <dayN>");
  }

  const target = Number(args[2]);
  const dailyHours = args.slice(3).map(Number);

  if (isNaN(target) || dailyHours.some(isNaN)) {
    throw new Error("Provided values must be numbers.");
  }

  return { target, dailyHours };
};

const calculateExercises = (dailyHours: number[], target: number): ExerciseResult => {
  const periodLength = dailyHours.length;
  const trainingDays = dailyHours.filter(h => h > 0).length;
  const average = dailyHours.reduce((sum, h) => sum + h, 0) / periodLength;
  const success = average >= target;

  let rating: number;
  let ratingDescription: string;

  if (average < target * 0.5) {
    rating = 1;
    ratingDescription = "You need to train a lot more!";
  } else if (average < target) {
    rating = 2;
    ratingDescription = "Not too bad but could be better";
  } else {
    rating = 3;
    ratingDescription = "Great job! You met the target!";
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

try {
  const { target, dailyHours } = parseExerciseArguments(process.argv);
  console.log(calculateExercises(dailyHours, target));
} catch (error: unknown) {
  let errorMessage = "Something bad happened.";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }
  console.log(errorMessage);
  process.exit(1);
}
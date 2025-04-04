interface BmiValues {
  height: number;
  weight: number;
}

export const parseBmiArguments = (args: string[]): BmiValues => {
  if (args.length !== 4) {
    throw new Error("Usage: npm run calculateBmi <heightCm> <weightKg>");
  }

  const height = Number(args[2]);
  const weight = Number(args[3]);

  if (isNaN(height) || isNaN(weight)) {
    throw new Error("Provided values must be numbers.");
  }

  return { height, weight };
};

const calculateBmi = (heightCm: number, weightKg: number): string => {
  if (heightCm <= 0) {
    throw new Error("The given height must be a positive number!");
  }
  if (weightKg <= 0) {
    throw new Error("The given weight must be a positive number!");
  }
  const heightM = heightCm / 100;
  const bmi = Math.round((weightKg / (heightM ** 2)) * 10) / 10;  // Round to 1 decimal place

  if (bmi < 16.0) {
    return "Underweight (Severe thinness)";
  } else if (bmi < 17.0) {
    return "Underweight (Moderate thinness)";
  } else if (bmi < 18.5) {
    return "Underweight (Mild thinness)";
  } else if (bmi < 25.0) {
    return "Normal range";
  } else if (bmi < 30.0) {
    return "Overweight (Pre-obese)";
  } else if (bmi < 35.0) {
    return "Obese (Class I)";
  } else if (bmi < 40.0) {
    return "Obese (Class II)";
  } else {
    return "Obese (Class III)";
  }
}

try {
  const { height, weight } = parseBmiArguments(process.argv);
  console.log(calculateBmi(height, weight));
}
catch (error: unknown) {
  let errorMessage = "Something bad happened.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    console.log(errorMessage);
    process.exit(1);
}
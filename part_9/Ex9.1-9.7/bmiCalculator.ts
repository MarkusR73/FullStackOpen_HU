interface BmiValues {
  height: number;
  weight: number;
}

interface BmiResult {
  weight: number;
  height: number;
  bmi: string;
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

export const calculateBmi = (heightCm: number, weightKg: number): BmiResult => {
  if (heightCm <= 0) {
    throw new Error("The given height must be a positive number!");
  }
  if (weightKg <= 0) {
    throw new Error("The given weight must be a positive number!");
  }
  const heightM = heightCm / 100;
  const bmiValue = Math.round((weightKg / (heightM ** 2)) * 10) / 10;  // Round to 1 decimal place

  let bmiCategory: string;
  if (bmiValue < 16.0) {
    bmiCategory = "Underweight (Severe thinness)";
  } else if (bmiValue < 17.0) {
    bmiCategory = "Underweight (Moderate thinness)";
  } else if (bmiValue < 18.5) {
    bmiCategory = "Underweight (Mild thinness)";
  } else if (bmiValue < 25.0) {
    bmiCategory = "Normal range";
  } else if (bmiValue < 30.0) {
    bmiCategory = "Overweight (Pre-obese)";
  } else if (bmiValue < 35.0) {
    bmiCategory = "Obese (Class I)";
  } else if (bmiValue < 40.0) {
    bmiCategory = "Obese (Class II)";
  } else {
    bmiCategory = "Obese (Class III)";
  }
  
  return {
    weight: weightKg,
    height: heightCm,
    bmi: bmiCategory,
  };
}

if (require.main === module) {
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
}
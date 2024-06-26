export function calculateBmi(height: number, weight: number): string {
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters ** 2);
  
    if (bmi < 18.5) {
      return 'Underweight';
    } else if (bmi < 24.9) {
      return 'Normal (healthy weight)';
    } else if (bmi < 29.9) {
      return 'Overweight';
    } else {
      return 'Obese';
    }
  }
  
  // For testing the function directly
  console.log(calculateBmi(180, 74));
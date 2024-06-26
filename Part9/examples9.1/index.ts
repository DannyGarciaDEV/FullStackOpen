import express from 'express';
import { calculateBmi } from './bmiCalculator';

const app = express();
const PORT = 3003;

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  // Check if height or weight are not valid numbers
  if (isNaN(height) || isNaN(weight)) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  // Calculate BMI using imported function
  const bmi = calculateBmi(height, weight);
  
  // Return BMI result as JSON
  return res.json({ weight, height, bmi });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

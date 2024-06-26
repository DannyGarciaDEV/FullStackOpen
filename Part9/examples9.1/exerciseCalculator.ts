interface ExerciseResult {
    periodLength: number;
    trainingDays: number;
    success: boolean;
    rating: number;
    ratingDescription: string;
    target: number;
    average: number;
  }
  
  function calculateExercises(dailyHours: number[], target: number): ExerciseResult {
    const periodLength = dailyHours.length;
    const trainingDays = dailyHours.filter(day => day > 0).length;
    const totalHours = dailyHours.reduce((acc, day) => acc + day, 0);
    const average = totalHours / periodLength;
    const success = average >= target;
  
    let rating: number;
    let ratingDescription: string;
  
    if (average >= target) {
      rating = 3;
      ratingDescription = 'Great job!';
    } else if (average >= target * 0.5) {
      rating = 2;
      ratingDescription = 'Not too bad but could be better';
    } else {
      rating = 1;
      ratingDescription = 'You need to work harder';
    }
  
    return {
      periodLength,
      trainingDays,
      success,
      rating,
      ratingDescription,
      target,
      average
    };
  }
  
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log('Please provide the target and at least one daily exercise hour.');
  } else {
    const target = Number(args[0]);
    const dailyHours = args.slice(1).map(arg => Number(arg));
    
    if (isNaN(target) || dailyHours.some(isNaN)) {
      console.log('All arguments should be numbers.');
    } else {
      console.log(calculateExercises(dailyHours, target));
    }
  }
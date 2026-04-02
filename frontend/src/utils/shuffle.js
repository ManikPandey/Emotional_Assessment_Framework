import questionsData from '../data/questions.json';

// Helper to shuffle any array
const shuffleArray = (array) => [...array].sort(() => 0.5 - Math.random());

export const generateAssessment = () => {
  // Part A: 5 questions from each dimension
  const dimensionsA = ['selfAwareness', 'selfRegulation', 'motivation', 'empathy', 'socialSkills'];
  let selectedPartA = [];

  dimensionsA.forEach(dim => {
    const allDimQuestions = questionsData.filter(q => q.part === 'A' && q.dimension === dim);
    const shuffledDim = shuffleArray(allDimQuestions).slice(0, 5);
    selectedPartA = [...selectedPartA, ...shuffledDim];
  });

  // Part B: 10 random questions from the effectiveness pool
  const allPartB = questionsData.filter(q => q.part === 'B');
  const selectedPartB = shuffleArray(allPartB).slice(0, 10);

  // Combine them (Keep them grouped by section for a better UX)
  return [...selectedPartA, ...selectedPartB];
};
// frontend/src/pages/TestForm.jsx
import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { generateAssessment } from '../utils/shuffle';

const sections = [
  { id: 'selfAwareness', title: 'Part A: Self-Awareness', desc: 'Understanding your own emotions.' },
  { id: 'selfRegulation', title: 'Part A: Self-Regulation', desc: 'Managing your emotional reactions.' },
  { id: 'motivation', title: 'Part A: Motivation', desc: 'Your drive and resilience.' },
  { id: 'empathy', title: 'Part A: Empathy', desc: 'Understanding others.' },
  { id: 'socialSkills', title: 'Part A: Social Skills', desc: 'Navigating relationships.' },
  { id: 'effectiveness', title: 'Part B: Workplace Effectiveness', desc: 'Real-world outcomes.' }
];

const TestForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [userDetails, setUserDetails] = useState(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate the shuffled questions only once when component mounts
  const testQuestions = useMemo(() => generateAssessment(), []);

  useEffect(() => {
    if (!location.state?.userDetails) navigate('/');
    else setUserDetails(location.state.userDetails);
  }, [location, navigate]);

  const handleOptionChange = (questionId, value) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  // Filter questions for the current view
  const currentSection = sections[currentSectionIndex];
  const questionsInView = testQuestions.filter(q => q.dimension === currentSection.id);
  
  // Check if current section is fully answered
  const isSectionComplete = questionsInView.every(q => responses[q.id]);

  const handleNext = async () => {
    if (currentSectionIndex < sections.length - 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setCurrentSectionIndex(prev => prev + 1);
    } else {
      submitAssessment();
    }
  };

  const submitAssessment = async () => {
    setIsSubmitting(true);
    const scores = { selfAwareness: 0, selfRegulation: 0, motivation: 0, empathy: 0, socialSkills: 0, effectiveness: 0, totalScore: 0 };

    testQuestions.forEach(q => {
      scores[q.dimension] += responses[q.id];
      if (q.part === 'A') scores.totalScore += responses[q.id]; // Standard total usually only counts Part A
    });

    try {
      const res = await axios.post('http://localhost:5000/api/submit', {
        name: userDetails.name,
        registrationNumber: userDetails.registrationNumber,
        scores
      });
      navigate('/results', { state: { userDetails, scores, dbData: res.data } });
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  if (!userDetails) return null;
  const progress = Math.round(((currentSectionIndex) / sections.length) * 100);

  return (
    <div className="max-w-3xl mx-auto pb-12">
      {/* Sticky Apple-like Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md pt-4 pb-4 z-50 border-b border-slate-200 mb-8">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">EI Assessment</h2>
            <p className="text-xs text-slate-500">{userDetails.name}</p>
          </div>
          <div className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Section {currentSectionIndex + 1} of 6
          </div>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }} 
            animate={{ width: `${progress}%` }} 
            className="bg-indigo-600 h-full rounded-full"
          />
        </div>
      </div>

      {/* Animated Form Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSectionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-800">{currentSection.title}</h1>
            <p className="text-slate-500 mt-2">{currentSection.desc}</p>
          </div>

          <div className="space-y-6">
            {questionsInView.map((q, index) => (
              <div key={q.id} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-medium text-slate-800 mb-6 text-center md:text-left">
                  <span className="text-indigo-400 font-bold mr-2">{index + 1}.</span> {q.text}
                </h3>
                
                <div className="flex justify-between items-center max-w-lg mx-auto md:mx-0">
                  <span className="text-xs text-slate-400 font-medium uppercase hidden sm:block">Disagree</span>
                  <div className="flex space-x-3 w-full sm:w-auto justify-between">
                    {[1, 2, 3, 4, 5].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleOptionChange(q.id, val)}
                        className={`w-12 h-12 rounded-full font-semibold transition-all duration-300 ${
                          responses[q.id] === val 
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110' 
                            : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-indigo-50 hover:border-indigo-300'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-slate-400 font-medium uppercase hidden sm:block">Agree</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-end">
            <button
              onClick={handleNext}
              disabled={!isSectionComplete || isSubmitting}
              className={`py-4 px-8 rounded-full text-white font-bold tracking-wide transition-all ${
                isSectionComplete && !isSubmitting
                  ? 'bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200 cursor-pointer' 
                  : 'bg-slate-300 cursor-not-allowed'
              }`}
            >
              {currentSectionIndex === sections.length - 1 
                ? (isSubmitting ? 'Analyzing...' : 'Complete Assessment') 
                : 'Next Section →'}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TestForm;
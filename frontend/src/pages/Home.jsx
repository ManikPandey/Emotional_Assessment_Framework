// frontend/src/pages/Home.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react'; // Using Lucide for a nice icon

const Home = () => {
  const [formData, setFormData] = useState({ name: '', registrationNumber: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleStart = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.registrationNumber.trim()) {
      setError("Please fill in both fields to begin.");
      return;
    }
    
    // Navigate to the test page and pass the user's details along
    navigate('/test', { state: { userDetails: formData } });
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-md border border-slate-100">
      <div className="flex justify-center mb-6">
        <BrainCircuit size={48} className="text-blue-600" />
      </div>
      
      <h2 className="text-2xl font-bold text-center mb-2">Welcome to the EI Assessment</h2>
      <p className="text-slate-500 text-center mb-8">
        Discover your emotional competence across 5 distinct dimensions.
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleStart} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Registration Number / Employee ID
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g., 23BAI10426"
            value={formData.registrationNumber}
            onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 mt-4"
        >
          Start Assessment
        </button>
      </form>
    </div>
  );
};

export default Home;
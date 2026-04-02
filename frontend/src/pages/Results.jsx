// frontend/src/pages/Results.jsx
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts'
import { evaluateTotalEI, evaluateDimension } from '../utils/scoring';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [globalData, setGlobalData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Check if user arrived here legally (with scores)
  useEffect(() => {
    if (!location.state?.scores) {
      navigate('/');
    } else {
      fetchGlobalAnalytics();
    }
  }, [location, navigate]);

  // 2. Fetch the comparison data from your database
  const fetchGlobalAnalytics = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/analytics`);
      setGlobalData(res.data);
      setIsLoading(false);
    } catch (err) {
      console.error("Failed to fetch analytics", err);
      setIsLoading(false);
    }
  };

  if (!location.state?.scores) return null;

  const { userDetails, scores } = location.state;
  const overallEval = evaluateTotalEI(scores.totalScore);

  // Formatting data for the charts
  const dimensionNames = {
    selfAwareness: "Self-Awareness",
    selfRegulation: "Self-Regulation",
    motivation: "Motivation",
    empathy: "Empathy",
    socialSkills: "Social Skills"
  };

  // Bar Chart Data (Comparing User vs DB Average)
  const comparisonData = globalData ? Object.keys(dimensionNames).map(key => ({
    subject: dimensionNames[key],
    "Your Score": scores[key],
    "Global Average": Number(globalData[`avg${key.charAt(0).toUpperCase() + key.slice(1)}`]?.toFixed(1)) || 0,
    fullMark: 25,
  })) : [];

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-fade-in">
      {/* Header Profile */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Assessment Report</h2>
          <p className="text-slate-500 font-medium">{userDetails.name} | ID: {userDetails.registrationNumber}</p>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 px-4 rounded-lg transition"
        >
          Take New Test
        </button>
      </div>

      {/* Main Score Banner */}
      <div className={`p-8 rounded-xl border-2 mb-8 flex flex-col md:flex-row items-center gap-8 shadow-sm ${overallEval.bg} ${overallEval.border}`}>
        <div className="flex-shrink-0 text-center">
          <div className="text-sm font-bold tracking-widest text-slate-500 uppercase mb-1">Total Score</div>
          <div className={`text-6xl font-black ${overallEval.color}`}>{scores.totalScore}</div>
          <div className="text-sm text-slate-500 mt-1">out of 175</div>
        </div>
        <div>
          <h3 className={`text-3xl font-bold mb-2 ${overallEval.color}`}>{overallEval.level}</h3>
          <p className="text-slate-700 text-lg leading-relaxed">{overallEval.description}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Radar Chart (Personal Profile) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6 text-center">Your Emotional Profile</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={comparisonData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" textAnchor="middle" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 25]} tick={{ fill: '#94a3b8' }} />
                <Radar name="Your Score" dataKey="Your Score" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart (Comparison) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6 text-center">
            {isLoading ? "Loading Global Averages..." : "Comparison vs. Peers"}
          </h3>
          <div className="h-72">
            {!isLoading && (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
      <XAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} />
      <YAxis domain={[0, 25]} tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
      <Tooltip 
        cursor={{fill: 'transparent'}}
        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
      />
      <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
      
      {/* "You" Bar - Vibrant */}
      <Bar dataKey="Your Score" fill="#4f46e5" radius={[6, 6, 6, 6]} barSize={32}>
        {/* Label on top of your score */}
        <LabelList dataKey="Your Score" position="top" fill="#4f46e5" fontWeight="bold" />
      </Bar>
      
      {/* "Global Average" Bar - Muted */}
      <Bar dataKey="Global Average" fill="#cbd5e1" radius={[6, 6, 6, 6]} barSize={32}>
         <LabelList dataKey="Global Average" position="top" fill="#94a3b8" fontSize={12} />
      </Bar>
    </BarChart>
  </ResponsiveContainer>
)}
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <h3 className="text-xl font-bold text-slate-800 mb-4">Dimension Breakdown</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.keys(dimensionNames).map(key => {
          const evalData = evaluateDimension(scores[key]);
          return (
            <div key={key} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-slate-800">{dimensionNames[key]}</h4>
                <span className={`text-xl font-black ${evalData.color}`}>{scores[key]}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mb-3">
                <div className={`h-1.5 rounded-full ${evalData.color.replace('text-', 'bg-')}`} style={{ width: `${(scores[key]/25)*100}%` }}></div>
              </div>
              <span className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase tracking-wider mb-2 ${evalData.color.replace('text-', 'bg-').replace('600', '100')} ${evalData.color}`}>
                {evalData.label}
              </span>
              <p className="text-sm text-slate-600">{evalData.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Results;
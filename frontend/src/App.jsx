// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TestForm from './pages/TestForm';
import Results from './pages/Results';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
        <header className="bg-white shadow-sm py-4">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-2xl font-bold text-blue-900">
              Emotional Intelligence Assessment
            </h1>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/test" element={<TestForm />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
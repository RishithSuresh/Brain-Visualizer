import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import VisualizationPage from './pages/VisualizationPage';
import AnalyticsPage from './pages/AnalyticsPage';

/**
 * Root application component.
 * Wraps all pages with the shared Navbar and React Router.
 */
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-brain-dark text-white font-sans">
        <Navbar />
        <Routes>
          <Route path="/"           element={<HomePage />} />
          <Route path="/visualize"  element={<VisualizationPage />} />
          <Route path="/analytics"  element={<AnalyticsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


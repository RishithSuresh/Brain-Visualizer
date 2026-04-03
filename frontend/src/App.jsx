import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ToastViewport from './components/Toast';
import HomePage from './pages/HomePage';
import VisualizationPage from './pages/VisualizationPage';
import AnalyticsPage from './pages/AnalyticsPage';
import { ToastProvider } from './hooks/useToast';

/**
 * Root application component.
 * Wraps all pages with the shared Navbar and React Router.
 */
function App() {
  return (
    <ToastProvider>
      <Router>
        <div className="min-h-screen bg-brain-dark text-white font-sans">
          <Navbar />
          <Routes>
            <Route path="/"           element={<HomePage />} />
            <Route path="/visualize"  element={<VisualizationPage />} />
            <Route path="/analytics"  element={<AnalyticsPage />} />
          </Routes>
          <ToastViewport />
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;


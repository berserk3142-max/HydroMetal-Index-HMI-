import { useState } from 'react';
import LandingPage from './components/LandingPage';
import DataInputForm from './components/DataInputForm';
import ResultsDashboard from './components/ResultsDashboard';
import FileUpload from './components/FileUpload';
import MapView from './components/MapView';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [results, setResults] = useState(null);
  const [samples, setSamples] = useState([]);
  const [darkMode, setDarkMode] = useState(true);

  const handleCalculate = (data) => {
    setResults(data);
    setCurrentView('results');
  };

  const handleFileData = (data) => {
    setSamples(data);
    if (data.length > 0) {
      setResults(data[0]);
      setCurrentView('results');
    }
  };

  const handleNewCalculation = () => {
    setCurrentView('calculate');
    setResults(null);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage onGetStarted={() => setCurrentView('calculate')} />;
      case 'calculate':
        return (
          <DataInputForm
            onCalculate={handleCalculate}
            onFileUpload={() => setCurrentView('upload')}
          />
        );
      case 'upload':
        return (
          <FileUpload
            onDataLoaded={handleFileData}
            onBack={() => setCurrentView('calculate')}
          />
        );
      case 'results':
        return (
          <ResultsDashboard
            results={results}
            samples={samples}
            onNewCalculation={handleNewCalculation}
            onViewMap={() => setCurrentView('map')}
          />
        );
      case 'map':
        return (
          <MapView
            samples={samples.length > 0 ? samples : (results ? [results] : [])}
            onBack={() => setCurrentView('results')}
          />
        );
      default:
        return <LandingPage onGetStarted={() => setCurrentView('calculate')} />;
    }
  };

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <header className="app-header">
        <div className="logo" onClick={() => setCurrentView('landing')}>
          <span className="logo-icon">💧</span>
          <span className="logo-text">HMPI Calculator</span>
        </div>
        <nav className="nav-links">
          <button
            className={`nav-btn ${currentView === 'landing' ? 'active' : ''}`}
            onClick={() => setCurrentView('landing')}
          >
            Home
          </button>
          <button
            className={`nav-btn ${currentView === 'calculate' ? 'active' : ''}`}
            onClick={() => setCurrentView('calculate')}
          >
            Calculate
          </button>
          {results && (
            <button
              className={`nav-btn ${currentView === 'results' ? 'active' : ''}`}
              onClick={() => setCurrentView('results')}
            >
              Results
            </button>
          )}
          {(samples.length > 0 || results) && (
            <button
              className={`nav-btn ${currentView === 'map' ? 'active' : ''}`}
              onClick={() => setCurrentView('map')}
            >
              Map View
            </button>
          )}
        </nav>
        <button className="theme-toggle" onClick={toggleDarkMode}>
          {darkMode ? '☀️' : '🌙'}
        </button>
      </header>
      <main className="app-main">
        {renderView()}
      </main>
      <footer className="app-footer">
        <p>© 2024 HMPI Calculator | Heavy Metal Pollution Index Assessment Tool</p>
        <p className="footer-note">Based on WHO Drinking Water Guidelines</p>
      </footer>
    </div>
  );
}

export default App;

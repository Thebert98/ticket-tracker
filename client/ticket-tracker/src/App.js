import './App.css';
import AdminPanel from './components/AdminPanel';
import LandingPage from './components/LandingPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';

function App() {
  return (
    <Router>
       <div className='App'>
        <header className='App-header'>
          <Navigation />
          </header>
          </div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  )
}

export default App;

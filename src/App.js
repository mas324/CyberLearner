import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Quizzer from './pages/Quizzlet';
import DevicePage from './pages/Devices';
import Report from './pages/Reporter';
import { navbar as NavBar } from './components/Navbar';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route exact path='/' element={<HomePage />} />
        <Route path='/devices' element={<DevicePage />} />
        <Route path='/quizzes' element={<Quizzer />} />
        <Route path='/reports' element={<Report />} />
      </Routes>
    </Router>
  );
}

export default App;

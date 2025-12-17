import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Predict from './pages/Predict'; // パスはこれでOKです
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/predict" element={<Predict />} />
        <Route path="/" element={<Navigate to="/predict" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
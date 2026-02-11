import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../components/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;
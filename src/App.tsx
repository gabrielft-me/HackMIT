import './App.css'
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import Home from './pages/Home'
import SearchPage from './pages/SearchPage'
import About from './pages/About'

const App: React.FC = () => {

  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> |
        <Link to="/About">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/About" element={<About />} />
      </Routes>
    </Router>
  )
}

export default App
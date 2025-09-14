import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import SearchPage from "./pages/SearchPage";
import About from "./pages/About";
import { Logo } from "./components/Logo";
import Launch from "./pages/Launch";
import { UserDataProvider } from "./providers/UserDataProvider";

const App: React.FC = () => {

  return (
    <UserDataProvider>
      <Router>
        <nav className="navbar navbar-expand-lg navbar-dark bg-success fixed-top">
          <div className="container d-flex align-items-center">
            <div className="me-2 d-flex align-items-center">
              <div style={{ marginRight: "3px" }}>
                <Link to="/Launch" style={{ display: "inline-block" }}>
                  <Logo />
                </Link>
              </div>
            </div>
            <Link className="navbar-brand" to="/Launch">
              AIPlug
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/About">
                    About
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/SearchPage">
                    SearchPage
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div style={{ paddingTop: "70px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/About" element={<About />} />
            <Route path="/SearchPage" element={<SearchPage />} />
            <Route path="/Launch" element={<Launch />} />
          </Routes>
        </div>
      </Router>
    </UserDataProvider>
  );
};

export default App;

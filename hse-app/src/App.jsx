import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Projects from "./pages/Projects";
import ProjectMetrics from "./pages/ProjectMetrics";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectMetrics />} />
      </Routes>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateEmployee from './components/CreateEmployee';
import EmployeeList from './components/EmployeeList';
import Nav from './components/Nav';

function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<CreateEmployee />} />
        <Route path="/employee-list" element={<EmployeeList />} />
      </Routes>
    </Router>
  );
}

export default App;

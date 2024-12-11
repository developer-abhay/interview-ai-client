import Dashboard from './pages/Dashboard'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import InterviewPage from './pages/InterviewScreen';
import Home from './pages/Home';
import LoginPage from './pages/Login';
const App = () => {
  return (
    <main>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/interview/:type' element={<InterviewPage />} />
        </Routes>
      </Router>
    </main>
  )
}

export default App

import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './hooks/AuthProvider';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Callback from './pages/Callback';
import Header from './components/layouts/Header';
import ProtectedRoute from './components/ProtectedRoute';
import Portfolio from './pages/Portfolio';
import EditPortfolio from './pages/EditPortfolio';

function App() {
  return (
    <AuthProvider>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/:portfolioUuid' element={<Portfolio />} />
        <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path='/oauth/callback' element={<ProtectedRoute><Callback /></ProtectedRoute>} />
        <Route path='/:portfolioUuid/edit' element={<ProtectedRoute><EditPortfolio /></ProtectedRoute>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;

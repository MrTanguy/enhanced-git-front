import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './hooks/AuthProvider'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Callback from './pages/Callback'
import Header from './components/layouts/Header'
import ProtectedRoute from './components/ProtectedRoute'
import Portfolio from './pages/Portfolio'
import EditPortfolio from './pages/EditPortfolio'

function App() {

  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          {/* Route publique */}
          <Route path='/login' element={<Login />}></Route>
          <Route path='/register' element={<Register />}></Route>
          <Route path='/:portfolioUuid' element={<Portfolio />}></Route>

          {/* Route protégées */}
          <Route path='/dashboard' element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute>}></Route>
          <Route path='/oauth/callback' element={ <ProtectedRoute> <Callback /> </ProtectedRoute>}></Route>
          <Route path='/:portfolioUuid/edit' element={ <ProtectedRoute> <EditPortfolio /> </ProtectedRoute>}></Route>
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App

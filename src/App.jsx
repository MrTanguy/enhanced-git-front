import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './hooks/AuthProvider'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Header from './components/Header'
import ProtectedRoute from './components/ProtectedRoute'

function App() {

  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          {/* Route publique */}
          <Route path='/login' element={<Login />}></Route>
          <Route path='/register' element={<Register />}></Route>

          {/* Route protégées */}
          <Route path='/dashboard' element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute>}></Route>
        </Routes>
        </AuthProvider>
    </Router>
  )
}

export default App

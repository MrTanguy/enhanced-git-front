import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import { AuthProvider } from './hooks/AuthProvider'

function App() {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/login' element={<Login />}></Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import ClientDashboard from './pages/ClientDashboard/ClientDashboard'
import CodeResult from './pages/CodeResult/CodeResult'
import DashboardLayout from './layouts/DashboardLayout'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<DashboardLayout/>}>
          <Route path='/dashboard' element={<ClientDashboard/>}/>
          <Route path='/analyze' element={<CodeResult/>}/>
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App

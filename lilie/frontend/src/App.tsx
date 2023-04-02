import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import ClientDashboard from './pages/ClientDashboard/ClientDashboard'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ClientDashboard/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App

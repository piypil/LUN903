import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { WelcomePage } from './pages/WelcomePage'
import { AboutPage } from './pages/AboutPage'
import { DashbordPage } from './pages/DashbordPage'
import ProjectResultsPage from './pages/ProjectResultsPage';
import { ConfigProvider } from 'antd'

function App() {

  return (
    <BrowserRouter>
      <ConfigProvider>
      <Routes>
          <Route path='/' element={<WelcomePage/>}></Route>
          <Route path='/about' element={<AboutPage/>}></Route>
          <Route path='/projects' element={<DashbordPage/>}></Route>
          <Route path="/results/:projectId" element={<ProjectResultsPage />} />
      </Routes>
      </ConfigProvider>
    </BrowserRouter>
  )
}

export default App

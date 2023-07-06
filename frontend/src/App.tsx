import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { WelcomePage } from './pages/WelcomePage'
import { AboutPage } from './pages/AboutPage'
import { DashbordPage } from './pages/DashbordPage'
import { ConfigProvider } from 'antd'

function App() {

  return (
    <BrowserRouter>
      <ConfigProvider
        theme={{
          components: {
            Typography: {
              colorWarning: '#ff8c00'
            }
          }
        }}
        >
      <Routes>
          <Route path='/' element={<WelcomePage/>}></Route>
          <Route path='/about' element={<AboutPage/>}></Route>
          <Route path='/dashbord' element={<DashbordPage/>}></Route>
      </Routes>
      </ConfigProvider>
    </BrowserRouter>
  )
}

export default App

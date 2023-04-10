import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import ClientDashboard from './pages/ClientDashboard/ClientDashboard'
import CodeResult from './pages/CodeResult/CodeResult'
import DashboardLayout from './layouts/DashboardLayout'
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
        <Route path='/' element={<DashboardLayout/>}>
          <Route path='/dashboard' element={<ClientDashboard/>}/>
          <Route path='/analyze' element={<CodeResult/>}/>
        </Route>

      </Routes>
      </ConfigProvider>
    </BrowserRouter>
  )
}

export default App

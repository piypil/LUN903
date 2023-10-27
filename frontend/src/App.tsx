import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { WelcomePage } from './pages/WelcomePage';
import { DocsPage } from './pages/DocsPage';
import DashbordPage from './pages/DashbordPage';
import ProjectResultsPage from './pages/ProjectResultsPageSAST';
import ProjectResultsPageDAST from './pages/ProjectResultsPageDAST';
import LoginPage from './pages/LoginPage';
import UserProfile from './pages/UserProfile';
import { ConfigProvider } from 'antd';
import { ThemeProvider } from './components/ThemeContext';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { useState } from 'react';

const baseUrl = process.env.REACT_APP_URL;
const manifestUrl = `${baseUrl}tonconnect-manifest.json`;

function App() {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      {!isConnected ? (
        <LoginPage onConnect={() => setIsConnected(true)} />
      ) : (
        <ThemeProvider>
          <BrowserRouter>
            <ConfigProvider>
              <Routes>
                <Route path='/' element={<WelcomePage />} />
                <Route path='/about' element={<DocsPage />} />
                <Route path='/profile' element={<UserProfile />} />
                <Route path='/projects' element={<DashbordPage />} />
                <Route path='/results/:fileHash' element={<ProjectResultsPage />} />
                <Route path='/results-dast/:fileHash' element={<ProjectResultsPageDAST />} />
              </Routes>
            </ConfigProvider>
          </BrowserRouter>
        </ThemeProvider>
      )}
    </TonConnectUIProvider>
  );
}

export default App;

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { WelcomePage } from './pages/WelcomePage';
import { AboutPage } from './pages/AboutPage';
import DashbordPage from './pages/DashbordPage';
import ProjectResultsPage from './pages/ProjectResultsPageSAST';
import ProjectResultsPageDAST from './pages/ProjectResultsPageDAST';
import { ConfigProvider } from 'antd';
import { ThemeProvider } from './components/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ConfigProvider>
          <Routes>
            <Route path='/' element={<WelcomePage />} />
            <Route path='/about' element={<AboutPage />} />
            <Route path='/projects' element={<DashbordPage />} />
            <Route path='/results/:fileHash' element={<ProjectResultsPage />} />
            <Route path='/results-dast/:fileHash' element={<ProjectResultsPageDAST />} />
          </Routes>
        </ConfigProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

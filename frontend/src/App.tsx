import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { WelcomePage } from './pages/WelcomePage';
import { AboutPage } from './pages/AboutPage';
import { DashbordPage } from './pages/DashbordPage';
import ProjectResultsPage from './pages/ProjectResultsPage';
import ProjectResultsPageDAST from './pages/ProjectResultsPageDAST';

import { ConfigProvider } from 'antd';

function App() {
  return (
    <BrowserRouter>
      <ConfigProvider>
        <Routes>
          <Route path='/' element={<WelcomePage />} />
          <Route path='/about' element={<AboutPage />} />
          <Route path='/projects' element={<DashbordPage />} />
          <Route path='/results/:projectId' element={<ProjectResultsPage />} />
          <Route path='/results-dast/:projectId' element={<ProjectResultsPageDAST />} />
        </Routes>
      </ConfigProvider>
    </BrowserRouter>
  );
}

export default App;

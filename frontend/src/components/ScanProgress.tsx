import React, { useState, useEffect } from 'react';
import { Progress } from 'antd';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const ScanProgress: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/scan-progress/`);
        const data = await response.json();
        setProgress(data.progress);
      } catch (error) {
        console.error('Error fetching scan progress:', error);
      }
    };

    const interval = setInterval(fetchProgress, 1000);
    fetchProgress();

    return () => clearInterval(interval);
  }, []);

  return (
    <Progress percent={progress} steps={2} />
  );
};

export default ScanProgress;

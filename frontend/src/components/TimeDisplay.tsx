import React, { useState, useEffect } from 'react';
import { Statistic, Card } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

const TimeDisplay: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card style={{
      textAlign: 'center',
      width: 300,
      margin: 'auto',
      backgroundColor: '#7289da',
      border: '5px solid #FFCF48',
      padding: '10px 20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center', 
      height: '60px', 
    }}>
      <Statistic
        value={currentTime}
        prefix={<ClockCircleOutlined style={{ color: '#FFCF48', fontSize: '20px' }} />}
        valueStyle={{ fontSize: '20px', color: '#FFCF48', margin: '0' }}
      />
    </Card>
  );
};

export default TimeDisplay;

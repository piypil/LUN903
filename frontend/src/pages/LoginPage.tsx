import React, { useEffect } from 'react';
import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react';
import { Card, Typography, Space } from 'antd';

const { Title } = Typography;

interface LoginPageProps {
  onConnect: () => void;
}

function LoginPage({ onConnect }: LoginPageProps) {
  const address = useTonAddress();

  useEffect(() => {
    if (address) {
      onConnect();
    }
  }, [address, onConnect]);

  return (
    <div className="login-page" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(120deg, #1B1D2A, #2C2F47)'
    }}>
      <Card style={{ 
          width: 320, 
          textAlign: 'center',
          borderRadius: '15px',
          boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.2)',
          backgroundColor: 'rgba(255, 255, 255, 0.05)'
      }}>
        <Space direction="vertical" size="middle">
          <Title level={3} style={{ color: '#FFF' }}>Вход в систему</Title>
          <TonConnectButton className="ton-connect-button" />
        </Space>
      </Card>
    </div>
  );
}

export default LoginPage;

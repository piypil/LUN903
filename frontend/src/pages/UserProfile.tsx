import React from 'react';
import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { Card, Typography, Avatar, Button } from 'antd';
import LayoutMenu from '../layouts/LayoutMenu';

const { Title, Text } = Typography;


function UserProfile() {
  const address = useTonAddress();
  const [tonConnectUI, setTonConnectUI] = useTonConnectUI();

  const handleDisconnect = async () => {
    try {
        if (tonConnectUI.connected) {
            await tonConnectUI.disconnect();
            alert("Вы успешно вышли из аккаунта!");
        }
    } catch (error) {
        console.error("Ошибка при отключении:", error);
        alert("Произошла ошибка при выходе из аккаунта.");
    }
  };

  return (
    <LayoutMenu>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Card
          style={{ width: 400, textAlign: 'center', borderRadius: '15px' }}
          hoverable>
          <Avatar size={100} icon={<img src="/" alt="User Avatar" />} />
          <Title level={3} style={{ marginTop: 20 }}>Профиль пользователя</Title>
          <Text strong>Адрес кошелька:</Text>
          <br />
          <Text code style={{ marginTop: 10, display: 'block', wordBreak: 'break-all' }}>{address}</Text>
          <Button onClick={handleDisconnect} type="primary" danger style={{ marginTop: 20 }}>
            Выйти
          </Button>
        </Card>
      </div>
    </LayoutMenu>
  );
}

export default UserProfile;

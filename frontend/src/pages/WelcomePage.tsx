import React from 'react';
import { Typography, Card } from 'antd';
import { UploadFile } from '../components/UploadFile';
import { ScanDAST } from '../components/ScanDAST';
import { AlertMessage } from '../components/AlertMessage';
import LayoutMenu from '../layouts/LayoutMenu';
import { useTheme } from '../components/ThemeContext';
import { RecentScans } from '../components/RecentScans';

export function WelcomePage() {
  const { Title } = Typography;
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);
  const { theme } = useTheme();

  const backgroundColor = theme === 'dark' ? '#121920' : '#f0f0f0';
  const textColor = theme === 'dark' ? '#f0f0f0' : '#121920';

  const cardStyle = {
    background: backgroundColor,
    marginBottom: '16px',
    borderRadius: '5px'
  };

  const titleStyle = {
    color: textColor,
    marginBottom: '16px'
  };

  return (
    <LayoutMenu>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto', gap: '16px' }}>
        <div>
          <Card style={cardStyle}>
            <AlertMessage showSuccessMessage={showSuccessMessage} />
            <Title level={5} style={titleStyle}>Запуск SAST/SCA</Title>
            <UploadFile setShowSuccessMessage={setShowSuccessMessage} />
            <Title level={5} style={titleStyle}>Запуск DAST</Title>
            <ScanDAST />
          </Card>
          <Card style={cardStyle}>
            <Title level={5} style={titleStyle}>Руководства</Title>
            <div style={{ color: textColor }}>col-6</div>
          </Card>
        </div>
        <div>
          <Card style={cardStyle}>
            <Title level={5} style={titleStyle}>Последние</Title>
            <RecentScans />
          </Card>
        </div>
      </div>
    </LayoutMenu>
  );
};

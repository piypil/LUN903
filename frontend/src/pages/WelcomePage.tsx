import React from 'react';
import { Col, Row, Typography } from 'antd';
import { UploadFile } from '../components/UploadFile';
import { ScanURL } from '../components/ScanURL';
import { AlertMessage } from '../components/AlertMessage';
import LayoutMenu from '../layouts/LayoutMenu';
import { useTheme } from '../components/ThemeContext';

export function WelcomePage() {
  const { Title } = Typography;
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);
  const { theme } = useTheme();

  const backgroundColor = theme === 'dark' ? '#121920' : '#f0f0f0';
  const textColor = theme === 'dark'? '#f0f0f0' : '#121920';

  return (
    <div>
        <LayoutMenu>
        <Row gutter={{ xs: 2, sm: 16, md: 24, lg: 32 }}>
            <Col className="gutter-row" span={12} style={{ padding: '8px', background: backgroundColor }}>
              <div style={{ background: backgroundColor, padding: '16px' }}>
                <AlertMessage showSuccessMessage={showSuccessMessage} />
                <Title level={5} style={{ color: textColor }}>Запуск SAST</Title>
                <UploadFile setShowSuccessMessage={setShowSuccessMessage} />
                <Title level={5} style={{ color: textColor }}>Запуск DAST</Title>
                <ScanURL />
              </div>
            </Col>
            <Col className="gutter-row" span={12} style={{ padding: '8px' }}>
              <div style={{ background: backgroundColor, padding: '16px' }}>
                <Title level={5} style={{ color: textColor }}>Руководства</Title>
                <div style={{ color: textColor }}>col-6</div>
              </div>
            </Col>
            <Col span={12} style={{ padding: '8px' }}>
              <div style={{ background: backgroundColor, padding: '16px' }}>
                <Title level={5} style={{ color: textColor }}>Последние</Title>
                <div style={{ color: textColor }}>col-12</div>
              </div>
            </Col>
          </Row>
        </LayoutMenu>
    </div>
  );
};

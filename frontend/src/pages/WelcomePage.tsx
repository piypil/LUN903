import React from 'react';
import { Col, Row, Typography } from 'antd';
import { UploadFile } from '../components/UploadFile';
import { ScanURL } from '../components/ScanURL';
import LayoutMenu from '../layouts/LayoutMenu';

export function WelcomePage() {
  const { Title } = Typography;
  return (
    <div>
      <LayoutMenu>
        <Row gutter={{ xs: 2, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={12} style={{ padding: '8px' }}>
            <div style={{ background: '#f0f0f0', padding: '16px' }}>
              <Title level={4}>Запуск</Title>
              <UploadFile />
              <ScanURL />
            </div>
          </Col>
          <Col className="gutter-row" span={12} style={{ padding: '8px' }}>
            <div style={{ background: '#f0f0f0', padding: '16px' }}>
              <Title level={4}>Руководства</Title>
              <div>col-6</div>
            </div>
          </Col>
          <Col span={12} style={{ padding: '8px' }}>
            <div style={{ background: '#f0f0f0', padding: '16px' }}>
              <Title level={4}>Последние</Title>
              col-12
            </div>
          </Col>
        </Row>
      </LayoutMenu>
    </div>
  );
};

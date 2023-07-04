import React from 'react';
import { Col, Row } from 'antd';
import { UploadFile } from '../components/UploadFile';

export function WelcomePage() {
  return (
    <div>
      <Row>
        <Col span={8}>
          <UploadFile />
        </Col>
      </Row>
    </div>
  );
};
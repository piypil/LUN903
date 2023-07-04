import React from 'react';
import { Col, Row } from 'antd';
import { UploadFile } from '../components/UploadFile';
import LayoutMenu from '../layouts/LayoutMenu'

export function WelcomePage() {
  return (
    <div>
      <Row>
        <Col span={8}>
        <LayoutMenu>
          <UploadFile />
        </LayoutMenu>
        </Col>
      </Row>
    </div>
  );
};
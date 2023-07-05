import React from 'react';
import { Col, Row } from 'antd';
import { UploadFile } from '../components/UploadFile';
import LayoutMenu from '../layouts/LayoutMenu'

export function WelcomePage() {
  return (
    <div>
      <LayoutMenu>
        <Row gutter={{ xs: 2, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={12}>
            <UploadFile />
          </Col>
          <Col className="gutter-row" span={12}>
            <div>col-6</div>
          </Col>
          <Col span={12}>col-12</Col>
        </Row>
      </LayoutMenu>
    </div>
  );
};
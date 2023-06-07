import React, { useState } from 'react'
import { Layout, Menu, theme, Input, Col, Row, Typography, Button } from 'antd';
import UploadProject from './components/Upload';

const { Title, Paragraph, Text, Link } = Typography

export default function ClientDashboard() {
  
  return (
    <div>
      <Row style={{ marginBottom: 16,}}>
        <Col span={8}>
          <Title level={4}>Загрузите проект</Title>
          <Input size='large' placeholder="Название проекта" />
        </Col>
      </Row>
      <Row>
        <Col span={8}>
          <UploadProject />
        </Col>
      </Row>
      <Row>
        <Col span={8}>
          <Button block type='primary'>Отправить</Button>
        </Col>
      </Row>
    </div>
  );
};


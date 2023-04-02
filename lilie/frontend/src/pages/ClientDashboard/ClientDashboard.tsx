import React, {useState} from 'react'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  FileSearchOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme, Input, Col, Row, Typography, Button } from 'antd';
import UploadProject from './components/Upload';

const { Title, Paragraph, Text, Link } = Typography

const { Header, Sider, Content } = Layout;


export default function ClientDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <FileSearchOutlined />,
              label: 'Запустить анализ',
            },
            {
              key: '2',
              icon: <UserOutlined />,
              label: 'Аккаунт',
            },
            {
              key: '3',
              icon: <SettingOutlined />,
              label: 'Настройки',
              onClick: ()=>console.log("Проверка")
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header style={{ padding: 0, background: colorBgContainer }}>
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => setCollapsed(!collapsed),
          })}
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: '100vh',
            background: colorBgContainer,
          }}
        >
          <Row style={{ marginBottom: 16 }}>
            <Col span={8}>
              <Title level={4}>Загрузите проект</Title>
              <Input size='large' placeholder="Название проекта" />
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <UploadProject/>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Button block type='primary'>Отправить</Button>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};


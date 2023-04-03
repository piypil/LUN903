import React, { useState } from 'react'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  FileSearchOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme, Input, Col, Row, Typography, Button } from 'antd';
import { Outlet } from 'react-router-dom';

const { Title, Paragraph, Text, Link } = Typography

const { Header, Sider, Content } = Layout;

export default function DashboardLayout() {
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
              onClick: () => console.log("Проверка")
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
          <Outlet/>
        </Content>
      </Layout>
    </Layout>
  )
}

import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FileSearchOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Switch } from 'antd';
import { Col, Row } from 'antd';
import type { MenuTheme } from 'antd';

const { Header, Sider, Content } = Layout;

interface LayoutMenuProps {
  children: React.ReactNode;
}

export default function LayoutMenu({ children }: LayoutMenuProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<MenuTheme>('light');

  const changeTheme = (value: boolean) => {
    setTheme(value ? 'dark' : 'light');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme={theme}>
        <div className="demo-logo-vertical" />
        <Menu
          theme={theme}
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
              onClick: () => console.log('Проверка'),
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout" style={{ maxHeight: '100vh', overflow: 'auto'}}>
        <Header style={{ 
                  padding: 0,
                  background: theme === 'dark' ? '#001529' : '#fff',
                  color: theme === 'dark' ? '#fff' : '#000',
                }}>
          <Row gutter={16}>
            <Col className="gutter-row" span={6}>
              <div>
              {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: () => setCollapsed(!collapsed),
              })}
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div>col-1</div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div>col-2</div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div>
              <Switch
                checked={theme === 'dark'}
                onChange={changeTheme}
                checkedChildren="Dark"
                unCheckedChildren="Light"
              />
              </div>
            </Col>
          </Row>
        </Header>
        <Content
          style={{
            padding: 24,
            minHeight: 280,
            background: theme === 'dark' ? '#001529' : '#fff',
            color: theme === 'dark' ? '#fff' : '#000',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}

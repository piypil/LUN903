import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Switch} from 'antd';
import type { MenuTheme } from 'antd';

const { Header, Sider, Content } = Layout;

interface LayoutMenuProps {
  children: React.ReactNode;
}

export default function LayoutMenu({ children }: LayoutMenuProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<MenuTheme>('dark');

  const changeTheme = (value: boolean) => {
    setTheme(value ? 'dark' : 'light');
  };

  return (
    <Layout style={{minHeight:'100vh'}} >
      <Sider trigger={null} collapsible collapsed={collapsed} theme={theme}>
        <div className="demo-logo-vertical" />
        <Menu
          theme={theme}
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <UserOutlined />,
              label: 'nav 1',
            },
            {
              key: '2',
              icon: <VideoCameraOutlined />,
              label: 'nav 2',
            },
            {
              key: '3',
              icon: <UploadOutlined />,
              label: 'nav 3',
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout" style={{maxHeight:'100vh', overflow:'auto'}}>
        <Header style={{ padding: 0 }} >
          <Switch
            checked={theme === 'dark'}
            onChange={changeTheme}
            checkedChildren="Dark"
            unCheckedChildren="Light"/>
          <br />
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => setCollapsed(!collapsed),
          })}
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

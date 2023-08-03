import React, { useState, useCallback } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FileSearchOutlined,
  SettingOutlined,
  UserOutlined,
  BugTwoTone,
} from '@ant-design/icons';
import { Layout, Menu, Switch } from 'antd';
import { Col, Row } from 'antd';
import type { MenuTheme } from 'antd';
import { Link } from "react-router-dom";
import logo from '../assets/images/logo512.png';
import Marquee from 'react-fast-marquee';
import ScanProgress from '../components/ScanProgress';

const { Header, Sider, Content } = Layout;

interface LayoutMenuProps {
  children: React.ReactNode;
}

export default function LayoutMenu({ children }: LayoutMenuProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<MenuTheme>(() => {
    const localTheme = window.localStorage.getItem('theme');
    return localTheme ? (localTheme as MenuTheme) : 'light';
  });

  const changeTheme = (value: boolean) => {
    const newTheme = value ? 'dark' : 'light';
    setTheme(newTheme);
    window.localStorage.setItem('theme', newTheme);
  };

  const handleCollapseClick = useCallback(() => {
    setCollapsed((prevState) => !prevState);
  }, []);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} style={{ 
                  background: theme === 'dark' ? '#121920' : '#7289da',
                  color: theme === 'dark' ? '#fff' : '#000',
                }}>
        <div style={{ display: 'flex', alignItems: 'center', height: '64px', padding: '0 16px' }}>
          <img src={logo} alt="Logo" style={{ width: '32px', height: '32px' }} />
        </div>
        <Menu
          style={{ 
            background: theme === 'dark' ? '#121920' : '#7289da',
            color: theme === 'dark' ? '#fff' : '#000',
          }}
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <BugTwoTone />,
              label: <Link to="/">Запуск</Link>,
            },
            {
              key: '2',
              icon: <FileSearchOutlined />,
              label: <Link to="/projects">Проводник</Link>,
            },
            {
              key: '3',
              icon: <UserOutlined />,
              label: 'Аккаунт',
            },
            {
              key: '4',
              icon: <SettingOutlined />,
              label: 'Настройки',
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout" style={{ maxHeight: 'auto', overflow: 'auto', background: theme === 'dark' ? '#001529' : '#99aab5' }}>
        <Header style={{ 
                  padding: 0,
                  background: theme === 'dark' ? '#121920' : '#7289da',
                  color: theme === 'dark' ? '#fff' : '#000',
                }}>
          <Row gutter={16}>
            <Col className="gutter-row" span={6}>
              <div>
              {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: handleCollapseClick,
              })}
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <ScanProgress />
            </Col>
            <Col className="gutter-row" span={6}>
              <Marquee pauseOnHover style={{ 
                background: theme === 'dark' ? '#121920' : '#7289da',
                color: theme === 'dark' ? '#fff' : '#000',
                }}>
                  (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧__EAT__(„• ֊ •„)__SLEEP__°˖✧◝(⁰▿⁰)◜✧˖°__HACK__( ◕▿◕ )
              </Marquee>
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
            margin: '14px 16px',
            padding: 24,
            minHeight: 280,
            background: theme === 'dark' ? '#1a2530' : '#ffffff',
            color: theme === 'dark' ? '#fff' : '#000',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}

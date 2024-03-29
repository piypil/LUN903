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
import { Link } from "react-router-dom";
import logo from '../assets/images/logo512.png';
import Marquee from 'react-fast-marquee';
import TimeDisplay from '../components/TimeDisplay';
import { useTheme } from '../components/ThemeContext';
import { Alert } from 'antd';

const { Header, Sider, Content } = Layout;

interface LayoutMenuProps {
  children: React.ReactNode;
}

export default function LayoutMenu({ children }: LayoutMenuProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();

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
            <Col className="gutter-row" span={2}>
              <div>
                {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                  className: 'trigger',
                  onClick: handleCollapseClick,
                })}
              </div>
            </Col>
            <Col className="gutter-row" span={10} style={{ padding: '1px' }}>
              <TimeDisplay />
            </Col>
            <Col className="gutter-row" span={6} style={{ padding: '10px' }}>
              <Alert
              type="warning"
                message={
                  <Marquee pauseOnHover style={{
                    background: theme === 'dark' ? '#121920' : '#FFCF48',
                    color: theme === 'dark' ? '#FFCF48' : '#000',
                  }}>
                    (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧__EAT__(„• ֊ •„)__SLEEP__°˖✧◝(⁰▿⁰)◜✧˖°__HACK__( ◕▿◕ )
                  </Marquee>
                }
              />
            </Col>
            <Col className="gutter-row" span={6}>
              <div>
                <Switch
                  checked={theme === 'dark'}
                  onChange={toggleTheme}
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
            background: theme === 'dark' ? '#191B26' : '#ffffff',
            color: theme === 'dark' ? '#fff' : '#000',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}

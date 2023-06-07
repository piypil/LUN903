import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';
import ClientDashboard from './pages/ClientDashboard/ClientDashboard'

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{minHeight:'100vh'}}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <PieChartOutlined />,
              label: 'Анализ',
            },
            {
              key: '2',
              icon: <UploadOutlined />,
              label: 'Загрузка',
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout" style={{maxHeight:'100vh', overflow:'auto'}}>
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
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <div style={{ 
            padding: 24, 
            textAlign: 'center', 
            background: colorBgContainer,}}>
            <ClientDashboard/>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
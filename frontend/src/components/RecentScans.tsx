import { useEffect, useState } from 'react';
import { List, Typography, Space, Tag } from 'antd';
import { ClockCircleOutlined, FileOutlined, CodeOutlined } from '@ant-design/icons';
import VulnerabilitySummary from './VulnerabilitySummary';
import SCAVulnerabilitySummary from './SCAVulnerabilitySummary';

const API_BASE_URL = process.env.REACT_APP_API_URL;

interface Scan {
  id: number;
  name: string;
  file: string;
  uploaded_at: string;
  file_hash: string;
}

export const RecentScans = () => {
  const [recentScans, setRecentScans] = useState<Scan[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/files/`)
      .then((response) => response.json())
      .then((data) => {
        const lastThree = data.slice(-3);
        setRecentScans(lastThree);
      });
  }, []);

  return (
    <List
      dataSource={recentScans.slice().reverse()}
      renderItem={(item: Scan) => (
        <List.Item>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space direction="vertical" align="center" style={{ width: '100%' }}>
              <Typography.Text strong><FileOutlined /> {item.name}</Typography.Text>
              <Typography.Text type="secondary"><ClockCircleOutlined /> {new Date(item.uploaded_at).toLocaleDateString()} | {new Date(item.uploaded_at).toLocaleTimeString()}</Typography.Text>
              <Tag icon={<CodeOutlined />} color="blue">{item.file_hash}</Tag>
            </Space>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <div style={{ width: '48%' }}>
                <VulnerabilitySummary fileHash={item.file_hash} />
              </div>
              <div style={{ width: '48%' }}>
                <SCAVulnerabilitySummary fileHash={item.file_hash} />
              </div>
            </div>
          </Space>
        </List.Item>
      )}
    />
  );

}

import React, { useEffect, useState } from 'react';
import { Space, Table, Spin, notification, Button } from 'antd';
import { ExclamationCircleOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import moment from 'moment';
import { useTheme } from '../components/ThemeContext';
import { Link } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL;

interface DASTData {
  uuid: string;
  project_name: string;
  url: string;
  scan_date: string;
  results: any;
}

export function TableViewDAST() {
  const [data, setData] = useState<DASTData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { theme } = useTheme();

  const handleError = (message: string) => {
    notification.error({
      message: "Error",
      description: message
    });
  };

  const columns: ColumnsType<DASTData> = [
    {
      title: 'Project',
      dataIndex: 'project_name',
      key: 'project_name',
      render: (name, record) => (
        <Space size="middle">
          <Link to={`/results-dast/${record.uuid}`}>{name}</Link>
        </Space>
      ),
    },
    {
      title: 'ID',
      dataIndex: 'uuid',
      key: 'uuid',
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
    },
    {
      title: 'Scan Date',
      dataIndex: 'scan_date',
      key: 'scan_date',
      render: (date) => moment(date).format('YYYY.MM.DD -> HH:mm'),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a target="_blank" rel="noopener noreferrer">
            <DownloadOutlined /> Download
          </a>
          <Button>
            <DeleteOutlined /> Delete
          </Button>
        </Space>
      ),
      },
  ];

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/dast-projects/`)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        handleError('Error fetching DAST data.');
        console.error(error);
        setLoading(false);
      });
  }, []);

  const tableClassName = theme === 'dark' ? 'dark-theme' : '';

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '5rem' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem' }}>
      <Table
        className={tableClassName}
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.uuid}
      />
    </div>
  )
}

export default TableViewDAST;

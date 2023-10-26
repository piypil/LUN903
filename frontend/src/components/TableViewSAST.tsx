import { useEffect, useState } from 'react';
import { Space, Table, Spin, Modal, Button, notification } from 'antd';
import { ExclamationCircleOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useTheme } from '../components/ThemeContext';

const { confirm } = Modal;

const API_BASE_URL = process.env.REACT_APP_API_URL;

interface FileData {
  file_hash: string;
  name: string;
  file: string;
  uploaded_at: string;
}

export function TableViewSAST() {
  const [data, setData] = useState<FileData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { theme } = useTheme();

  const handleError = (message: string) => {
    notification.error({
      message: "Error",
      description: message
    });
  };

  const handleDelete = (file_hash: string) => {
    axios
      .delete(`${API_BASE_URL}/files/${file_hash}/`)
      .then(() => {
        setData(data.filter((record) => record.file_hash !== file_hash));
      })
      .catch((error) => {
        handleError('Error deleting record.');
        console.error('Error deleting record:', error);
      });
  }

  const showDeleteConfirm = (file_hash: string) => {
    confirm({
      title: 'Are you sure delete this record?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        handleDelete(file_hash);
      }
    });
  }

  const columns: ColumnsType<FileData> = [
    {
      title: 'Project',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Space size="middle">
          <Link to={`/results/${record.file_hash}`}>{name}</Link>
        </Space>
      ),
    },
    {
      title: 'ID',
      dataIndex: 'file_hash',
      key: 'file_hash',
    },
    {
      title: 'Scan Date',
      dataIndex: 'uploaded_at',
      key: 'uploaded_at',
      render: (date) => moment(date).format('YYYY.MM.DD -> HH:mm'),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a href={record.file} target="_blank" rel="noopener noreferrer">
            <DownloadOutlined /> Download
          </a>
          <Button danger onClick={() => showDeleteConfirm(record.file_hash)}>
            <DeleteOutlined /> Delete
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/files/`)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        handleError('Error fetching data.');
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
        rowKey={(record) => record.file_hash}
      />
    </div>
  )
}

export default TableViewSAST;

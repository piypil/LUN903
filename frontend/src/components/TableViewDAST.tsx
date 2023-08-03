import React, { useEffect, useState } from 'react';
import { Space, Table, Spin, Modal, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import { Link } from 'react-router-dom';
import moment from 'moment';

const { confirm } = Modal;

const API_BASE_URL = process.env.REACT_APP_API_URL;

interface ProjectData {
  id: number;
  project_name: string;
  url: string;
  scan_date: string;
  results: any;
}

export function TableViewDAST() {
  const [data, setData] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const deleteRecord = (id: number) => {
    // Надо добавить удаление записи
    console.log('Delete record with id:', id);
  }

  const showDeleteConfirm = (id: number) => {
    confirm({
      title: 'Are you sure delete this record?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        deleteRecord(id);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  const columns: ColumnsType<ProjectData> = [
    {
      title: 'Project',
      dataIndex: 'project_name',
      key: 'project_name',
      render: (project_name, record) => (
        <Space size="middle">
          <Link to={`/results-dast/${record.id}`}>{project_name}</Link>
        </Space>
      ),
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      render: (url) => (
        <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
      ),
    },
    {
      title: 'Scan Date',
      dataIndex: 'scan_date',
      render: (date) => moment(date).format('YYYY.MM.DD -> HH:mm'),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button danger onClick={() => showDeleteConfirm(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/scanned-projects/`)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey={(record) => record.id.toString()}
    />
  );
}

export default TableViewDAST;

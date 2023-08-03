import React, { useEffect, useState } from 'react';
import { Space, Table, Spin, Modal, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import { Link } from 'react-router-dom';
import moment from 'moment';

const { confirm } = Modal;

const API_BASE_URL = process.env.REACT_APP_API_URL;

interface FileData {
  id: number;
  name: string;
  file: string;
  uploaded_at: string;
}

export function TableViewSAST() {
  const [data, setData] = useState<FileData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const deleteRecord = (id: number) => {
    // надо добавить удаление записи
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

  const columns: ColumnsType<FileData> = [
    {
      title: 'Project',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Space size="middle">
          <Link to={`/results/${record.id}`}>{name}</Link>
        </Space>
      ),
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
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
            Download
          </a>
          <Button danger onClick={() => showDeleteConfirm(record.id)}>
            Delete
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

export default TableViewSAST;


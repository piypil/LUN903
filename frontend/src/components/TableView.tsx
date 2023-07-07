import React, { useEffect, useState } from 'react';
import { Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import { Link } from 'react-router-dom';

export function TableView() {
  interface FileData {
    id: number;
    name: string;
    file: string;
    uploaded_at: string;
  }

  const columns: ColumnsType<FileData> = [
    {
      title: 'Name',
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
      title: 'Uploaded At',
      dataIndex: 'uploaded_at',
      key: 'uploaded_at',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a href={record.file} target="_blank" rel="noopener noreferrer">
            Download
          </a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];
  const [data, setData] = useState<FileData[]>([]);

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/files/')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return <Table columns={columns} dataSource={data} />;
}

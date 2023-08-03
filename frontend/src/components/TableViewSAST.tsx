import React, { useEffect, useState } from 'react';
import { Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import { Link } from 'react-router-dom';
import moment from 'moment';

const API_BASE_URL = process.env.REACT_APP_API_URL;

interface FileData {
  id: number;
  name: string;
  file: string;
  uploaded_at: string;
}

export function TableViewSAST() {
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
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  const [data, setData] = useState<FileData[]>([]);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/files/`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={data.length === 0}
    />
  );
}

export default TableViewSAST;

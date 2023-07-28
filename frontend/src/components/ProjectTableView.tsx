import React, { useEffect, useState } from 'react';
import { Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface ProjectData {
  id: number;
  project_name: string;
  url: string;
  scan_date: string;
  results: any;
}

export function ProjectTableView() {
  const columns: ColumnsType<ProjectData> = [
    {
      title: 'Project Name',
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
      render: (url) => <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>,
    },
    {
      title: 'Scan Date',
      dataIndex: 'scan_date',
      key: 'scan_date',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/results-dast/${record.id}`}>Results</Link>
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  const [data, setData] = useState<ProjectData[]>([]);

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/scanned-projects/')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return <Table columns={columns} dataSource={data} />;
}

export default ProjectTableView;
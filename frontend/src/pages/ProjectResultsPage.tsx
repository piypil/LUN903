import React, { useEffect, useState } from 'react';
import { Table, Typography } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const { Title } = Typography;

interface Vulnerability {
  code: string;
  filename: string;
  test_name: string;
  issue_text: string;
  line_number: number;
  end_col_offset: number;
}

const ProjectResultsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [selectedVulnerability, setSelectedVulnerability] = useState<Vulnerability | null>(null);
  const [code, setCode] = useState<string>('');

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/results/${projectId}/`)
      .then((response) => {
        const data = response.data;
        setVulnerabilities(data[0]?.result_data?.results || []);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [projectId]);

  const columns = [
    {
      title: 'Vulnerability',
      dataIndex: 'test_name',
      key: 'test_name',
    },
    {
      title: 'Description',
      dataIndex: 'issue_text',
      key: 'issue_text',
    },
    {
      title: 'Code',
      dataIndex: 'filename',
      key: 'code',
      render: (text: string, vulnerability: Vulnerability) => (
        <div className="code-container">
          {selectedVulnerability === vulnerability && (
            <pre>{code}</pre>
          )}
        </div>
      ),
    },
  ];

  const handleRowClick = (record: Vulnerability) => {
    setSelectedVulnerability(record);
    fetchCode(record.filename);
  };

  const fetchCode = (filePath: string) => {
    axios
      .get(`http://localhost:8000/api/code/?file_path=${filePath}`)
      .then((response) => {
        const data = response.data;
        setCode(data.code);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <Title level={2}>Результаты проекта {projectId}</Title>
      <Table
        dataSource={vulnerabilities}
        columns={columns}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
      />
    </div>
  );
};

export default ProjectResultsPage;
